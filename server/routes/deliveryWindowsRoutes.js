const express = require('express');

const router = express.Router();

function formatDayLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function buildWindows() {
  const windows = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset < 4; dayOffset += 1) {
    for (let hour = 12; hour < 20; hour += 2) {
      const start = new Date(now);
      start.setDate(now.getDate() + dayOffset);
      start.setHours(hour, 0, 0, 0);

      if (start <= now) {
        continue;
      }

      const end = new Date(start);
      end.setHours(hour + 2, 0, 0, 0);

      windows.push({
        id: `${start.toISOString()}-${end.toISOString()}`,
        date: formatDayLabel(start),
        label: `${formatDayLabel(start)} • ${formatTime(start)} - ${formatTime(end)}`
      });
    }
  }

  return windows.slice(0, 8);
}

router.get('/', (req, res) => {
  res.json({ windows: buildWindows() });
});

module.exports = router;
