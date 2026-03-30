const express = require('express');
const { formatOrderForCustomer, lookupOrder } = require('../lib/orderLookup');

const router = express.Router();

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_PATTERN = /(?:\+?1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/;
const ORDER_ID_PATTERN = /\b([A-F0-9]{24}|[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})\b/i;
const REFERENCE_PATTERN = /\b([A-F0-9]{6})\b/i;

function detectLookupDetails(message) {
  const trimmed = String(message || '').trim();
  const email = trimmed.match(EMAIL_PATTERN)?.[0] || '';
  const phone = trimmed.match(PHONE_PATTERN)?.[0] || '';
  const orderId = trimmed.match(ORDER_ID_PATTERN)?.[1] || '';
  const reference = (trimmed.match(REFERENCE_PATTERN)?.[1] || '').toUpperCase();

  return {
    email,
    phone,
    orderId,
    reference
  };
}

function mergeLookupState(current, incoming) {
  return {
    email: incoming.email || current.email || '',
    phone: incoming.phone || current.phone || '',
    orderId: incoming.orderId || current.orderId || '',
    reference: incoming.reference || current.reference || ''
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value || 0));
}

function formatOrderDate(value) {
  if (!value) {
    return 'recently';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'recently';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function summarizeOrder(order) {
  const timing = order.fulfillmentMethod === 'delivery'
    ? order.deliveryWindow || 'delivery timing pending'
    : order.pickupTime || 'pickup timing pending';
  const itemSummary = order.items.length
    ? order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')
    : 'items on file';

  return `Order ${order.reference} is ${order.status}. ${order.fulfillmentMethod === 'delivery' ? 'Delivery window' : 'Pickup time'}: ${timing}. Total: ${formatCurrency(order.total)}. Items: ${itemSummary}.`;
}

function buildDeterministicReply({ lookupState, order, notFound }) {
  if (order) {
    return `${summarizeOrder(order)} Placed ${formatOrderDate(order.createdAt)} for ${order.customer?.fullName || order.customer?.email || 'this customer'}.`;
  }

  if (notFound) {
    return 'I could not find an order with that information. Double-check the reference, or send both the checkout email and phone number.';
  }

  if (lookupState.email && !lookupState.phone) {
    return 'I have the checkout email. Send the phone number used at checkout so I can match the order.';
  }

  if (!lookupState.email && lookupState.phone) {
    return 'I have the phone number. Send the checkout email too, or paste the order ID or 6-character reference.';
  }

  return 'Send your order ID or 6-character reference, or the email and phone number used at checkout, and I will look it up.';
}

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  if (!Array.isArray(payload.output)) {
    return '';
  }

  return payload.output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .filter((content) => content.type === 'output_text' && typeof content.text === 'string')
    .map((content) => content.text)
    .join('\n')
    .trim();
}

async function generateOpenAIReply({ messages, lookupState, order, notFound }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const conversation = messages
    .slice(-8)
    .map((message) => `${message.sender === 'assistant' ? 'Assistant' : 'Customer'}: ${message.text}`)
    .join('\n');

  const lookupSummary = JSON.stringify(
    {
      lookupState,
      order,
      notFound
    },
    null,
    2
  );

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_ORDER_SUPPORT_MODEL || 'gpt-5-mini',
      instructions:
        'You are River City Creamery order support. Only help customers find or understand an existing order. Never invent order details. If lookup data is missing, ask only for the missing identifier. If the order is found, summarize status, fulfillment timing, total, and items in 2 to 4 concise sentences.',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Conversation:\n${conversation}\n\nLookup context:\n${lookupSummary}`
            }
          ]
        }
      ],
      max_output_tokens: 220,
      text: {
        format: {
          type: 'text'
        }
      }
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || 'OpenAI request failed.');
  }

  return extractOutputText(payload) || null;
}

router.post('/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const currentLookupState = req.body?.lookupState || {};
    const latestCustomerMessage = [...messages].reverse().find((message) => message.sender === 'customer')?.text || '';
    const detectedDetails = detectLookupDetails(latestCustomerMessage);
    const lookupState = mergeLookupState(currentLookupState, detectedDetails);

    const hasLookupInput = lookupState.orderId || lookupState.reference || (lookupState.email && lookupState.phone);
    const matchedOrder = hasLookupInput ? await lookupOrder(lookupState) : null;
    const order = matchedOrder ? formatOrderForCustomer(matchedOrder) : null;
    const notFound = Boolean(hasLookupInput && !order);

    let reply = null;

    try {
      reply = await generateOpenAIReply({ messages, lookupState, order, notFound });
    } catch (error) {
      console.warn('OpenAI order support fallback:', error.message);
    }

    return res.json({
      reply: reply || buildDeterministicReply({ lookupState, order, notFound }),
      lookupState,
      order,
      usedOpenAI: Boolean(reply)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
