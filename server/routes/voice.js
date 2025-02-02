import express from 'express';
import { CohereClient } from 'cohere-ai';

const router = express.Router();
const cohere = new CohereClient({
    token: 'UEGJ9vsdsq6titxxHUXbVSb5yX7PNkpO6RINVDcl'
});

router.post('/', async (req, res) => {
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required',
                shouldContinue: false 
            });
        }

        const response = await cohere.generate({
            model: 'command',
            prompt: `As an empathetic AI companion, respond to: ${message}. Keep the response concise, natural, and engaging to continue the conversation.`,
            max_tokens: 150,
            temperature: 0.7,
            k: 0,
            stopSequences: [],
            returnLikelihoods: 'NONE'
        });

        res.json({
            message: response.generations[0].text.trim(),
            shouldContinue: true
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            shouldContinue: false
        });
    }
});

export default router; 