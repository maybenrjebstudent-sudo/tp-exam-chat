const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// In-memory storage
let messages = [
  {
    id: 1,
    author: 'System',
    content: 'Bienvenue dans le chat en temps réel ! 👋',
    timestamp: new Date().toISOString()
  }
];
let nextId = 2;

// GET /api/messages - Return all messages
app.get('/api/messages', (req, res) => {
  res.json({
    success: true,
    data: messages,
    count: messages.length
  });
});

// POST /api/messages - Add a message
app.post('/api/messages', (req, res) => {
  const { author, content } = req.body;

  if (!author || !author.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Le champ "author" est requis.'
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Le champ "content" est requis.'
    });
  }

  const newMessage = {
    id: nextId++,
    author: author.trim().slice(0, 30),
    content: content.trim().slice(0, 500),
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);

  // Keep only last 100 messages in memory
  if (messages.length > 100) {
    messages = messages.slice(-100);
  }

  res.status(201).json({
    success: true,
    data: newMessage
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
