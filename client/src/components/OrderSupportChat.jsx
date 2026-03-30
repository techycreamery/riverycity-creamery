import React, { useMemo, useState } from 'react';

function buildPrompt(details) {
  if (!details.orderId && !details.reference && (!details.email || !details.phone)) {
    return 'Share your order ID or 6-character reference, or send the email and phone number used at checkout.';
  }

  if (details.email && !details.phone) {
    return 'I have your email. Send the phone number used at checkout so I can match the order.';
  }

  if (!details.email && details.phone) {
    return 'I have your phone number. Send the checkout email too, or paste the order ID/reference.';
  }

  return '';
}

function OrderSupportChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'I can help you find an order. Send your order ID or 6-character reference, or the email and phone number you used at checkout.'
    }
  ]);
  const [input, setInput] = useState('');
  const [lookupState, setLookupState] = useState({
    email: '',
    phone: '',
    orderId: '',
    reference: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompt = useMemo(() => buildPrompt(lookupState), [lookupState]);

  const pushMessage = (sender, text) => {
    return {
      id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      sender,
      text
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const customerMessage = pushMessage('customer', trimmed);
    const nextMessages = [...messages, customerMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/order-support/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ sender, text }) => ({ sender, text })),
          lookupState
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to contact order support.');
      }

      setLookupState(payload.lookupState || lookupState);
      setMessages((current) => [...current, pushMessage('assistant', payload.reply || 'Send a bit more detail so I can locate the order.')]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        pushMessage(
          'assistant',
          `${error.message} Send your order ID or 6-character reference, or the email and phone number used at checkout.`
        )
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="content-block order-support-block">
      <div className="section">
        <div className="section-title order-support-title">
          <div>
            <span className="eyebrow">Order Help</span>
            <h2>AI order assistant</h2>
          </div>
          <p>
            Customers can check status with a reference code or the email and phone number
            used at checkout.
          </p>
        </div>

        <div className="order-support-chat">
          <div className="chat-thread" aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-bubble ${message.sender === 'customer' ? 'chat-bubble-customer' : 'chat-bubble-assistant'}`}
              >
                <span>{message.sender === 'customer' ? 'You' : 'River City AI'}</span>
                <p>{message.text}</p>
              </article>
            ))}

            {isLoading ? (
              <article className="chat-bubble chat-bubble-assistant">
                <span>River City AI</span>
                <p>Looking up that order now...</p>
              </article>
            ) : null}
          </div>

          <form className="chat-composer" onSubmit={handleSubmit}>
            <label htmlFor="order-support-input" className="chat-label">
              Ask about an order
            </label>
            <textarea
              id="order-support-input"
              rows="3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Example: My order reference is A1B2C3 or I ordered with jane@example.com and 406-555-0149"
            />
            <div className="chat-composer-footer">
              <p>{suggestedPrompt || 'I can also work with a full order ID from your confirmation.'}</p>
              <button type="submit" className="button button-primary" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default OrderSupportChat;
