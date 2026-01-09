import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';
import { initializeDatabase, seedDatabase } from './db/schema';

// Import routes
import authRoutes from './routes/auth';
import reportsRoutes from './routes/reports';
import zonesRoutes from './routes/zones';
import analyticsRoutes from './routes/analytics';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Make WebSocket server globally accessible
declare global {
    var wss: WebSocketServer;
}
global.wss = wss;

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('✅ New WebSocket client connected');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    });

    ws.on('close', () => {
        console.log('❌ WebSocket client disconnected');
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to HushMap real-time updates' }));
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'HushMap API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database
initializeDatabase();
seedDatabase();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🗺️  HushMap API Server Running     ║
║                                       ║
║   HTTP: http://localhost:${PORT}       ║
║   WebSocket: ws://localhost:${PORT}/ws ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
