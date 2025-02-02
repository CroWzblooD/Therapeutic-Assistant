import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import chatRoutes from './routes/chat.js';
import moodRoutes from './routes/mood.js';
import voiceRoutes from './routes/voice.js';

const app = express();

// Configure CORS properly
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

// Routes
app.use('/mood', moodRoutes);
app.use('/chat', chatRoutes);
app.use('/voice-chat', voiceRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 