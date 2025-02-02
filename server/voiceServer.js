import express from 'express';
import cors from 'cors';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Ensure CORS is properly configured
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://therapeutic-assistant.vercel.app'  // Add your Vercel URL
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Cohere client with error handling
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || '' // Add fallback empty string
});

// Validate Cohere API key
if (!process.env.COHERE_API_KEY) {
    console.error('ERROR: COHERE_API_KEY is not set in .env file');
}

// Helper function to determine response type and length
const getResponseConfig = (message) => {
    const lowercaseMsg = message.toLowerCase();
    
    // Short responses
    if (
        lowercaseMsg.includes('hi') ||
        lowercaseMsg.includes('hello') ||
        lowercaseMsg.includes('how are you') ||
        lowercaseMsg.match(/^(yes|no|maybe|thanks?|okay|bye)$/i)
    ) {
        return {
            maxTokens: 50,
            prompt: `As a friendly AI assistant, give a brief response to: "${message}"`
        };
    }
    
    // Medium responses
    if (
        lowercaseMsg.includes('what') ||
        lowercaseMsg.includes('why') ||
        lowercaseMsg.includes('how') ||
        lowercaseMsg.includes('explain')
    ) {
        return {
            maxTokens: 200,
            prompt: `As an AI assistant, provide a clear explanation for: "${message}"`
        };
    }
    
    // Long responses
    if (
        lowercaseMsg.includes('tell me a story') ||
        lowercaseMsg.includes('story about') ||
        lowercaseMsg.includes('describe in detail')
    ) {
        return {
            maxTokens: 500,
            prompt: `As a storytelling AI, provide an engaging response to: "${message}"`
        };
    }
    
    // Default response
    return {
        maxTokens: 150,
        prompt: `As an AI assistant, respond naturally to: "${message}"`
    };
};

// Voice chat endpoint
app.post('/voice-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid message format',
                details: 'Message must be a non-empty string',
                shouldContinue: false 
            });
        }

        // Get response configuration
        const config = getResponseConfig(message);

        // Log request for debugging
        console.log('Processing request:', {
            message: message.substring(0, 50) + '...',
            maxTokens: config.maxTokens
        });

        // Make API call with error handling
        try {
            const response = await cohere.generate({
                model: 'command',
                prompt: config.prompt,
                max_tokens: config.maxTokens,
                temperature: 0.8,
                k: 0,
                p: 0.75,
                frequency_penalty: 0.1,
                presence_penalty: 0.1,
                stopSequences: [],
                returnLikelihoods: 'NONE',
                truncate: 'END'
            });

            // Validate response
            if (!response || !response.generations || !response.generations[0]) {
                throw new Error('Invalid response from Cohere API');
            }

            // Process and clean the response
            const text = response.generations[0].text.trim();
            const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
            
            // Log success
            console.log('Successfully processed request');

            res.json({
                message: chunks.join(' '),
                shouldContinue: true
            });

        } catch (cohereError) {
            console.error('Cohere API Error:', cohereError);
            throw new Error(`Cohere API Error: ${cohereError.message}`);
        }

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Voice processing error',
            details: error.message,
            shouldContinue: false
        });
    }
});

// Preflight handling
app.options('/voice-chat', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
});

// Start server with error handling
const VOICE_PORT = process.env.VOICE_PORT || 8081;

app.listen(VOICE_PORT, () => {
    console.log(`Voice server running on port ${VOICE_PORT}`);
    console.log('CORS enabled for:', 'http://localhost:5173');
    console.log('API Key status:', process.env.COHERE_API_KEY ? 'Set' : 'Not set');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message,
        shouldContinue: false
    });
}); 