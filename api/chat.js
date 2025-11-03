const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Configure CORS for Vercel deployment
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nepal-connect-5g7d6xtl1-aaditya-sapkotas-projects.vercel.app']
    : '*',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Start the chat
    const chat = model.startChat({
      history: context || [],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048,
      },
    });

    // Generate response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      response: text,
      context: chat.getHistory()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Export the Express app as a serverless function
module.exports = app;