import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_CLIENT || "http://localhost:3080",
    credentials: true
  }
});

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: process.env.DOMAIN_CLIENT || "http://localhost:3080",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LibreChat API is running',
    timestamp: new Date().toISOString()
  });
});

// Basic chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'gpt-3.5-turbo' } = req.body;
    
    // This is a placeholder response
    // In a real implementation, this would call the AI provider APIs
    const response = {
      id: Date.now().toString(),
      message: `This is a placeholder response to: "${message}". Please configure your AI provider API keys in the .env file to get real AI responses.`,
      model: model,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Please check your configuration and try again.'
    });
  }
});

// Basic conversations endpoint
app.get('/api/conversations', (req, res) => {
  res.json([]);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/LibreChat';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process, allow app to run without DB for demo purposes
  }
};

// Start server
const PORT = process.env.PORT || 3080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`
🚀 LibreChat is running!

📍 Server: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}
🔧 API Health: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/health

📝 To get started:
   1. Configure your AI provider API keys in the .env file
   2. Restart the services: docker compose restart
   3. Visit the URL above to start chatting!

🔑 Required API Keys:
   - OPENAI_API_KEY (for OpenAI GPT models)
   - ANTHROPIC_API_KEY (for Claude models)
   - GOOGLE_KEY (for Gemini models)
`);
});

// Connect to database
connectDB();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
