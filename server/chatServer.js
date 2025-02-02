import express from 'express';
import cors from 'cors';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        const response = await cohere.generate({
            model: 'command',
            prompt: `As an AI assistant, respond to: "${message}"`,
            max_tokens: 300,
            temperature: 0.7,
            k: 0,
            stopSequences: [],
            returnLikelihoods: 'NONE'
        });

        res.json({
            message: response.generations[0].text.trim()
        });

    } catch (error) {
        console.error('Chat server error:', error);
        res.status(500).json({ 
            error: 'Failed to process chat message',
            details: error.message
        });
    }
});

const CHAT_PORT = 8080;

app.listen(CHAT_PORT, () => {
    console.log(`Chat server running on port ${CHAT_PORT}`);
    console.log('CORS enabled for:', 'http://localhost:5173');
}); 