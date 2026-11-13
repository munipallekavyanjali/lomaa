import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { initDatabase, DB_PATH } from './db.js';

// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & seed initial data
initDatabase();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Retro Liquid Glassmorphism Task Management API (with JWT Auth)',
    database: {
      type: 'SQLite',
      path: DB_PATH
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start listening
app.listen(PORT,'0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(` 💧 RETRO LIQUID GLASS TASK MANAGEMENT SERVER (JWT AUTH)`);
  console.log(`======================================================`);
  console.log(`🚀 API Server running at: http://localhost:${PORT}`);
  console.log(`🔑 Auth Endpoint:        http://localhost:${PORT}/api/auth`);
  console.log(`📋 Tasks Endpoint:       http://localhost:${PORT}/api/tasks`);
  console.log(`🗄️ Database Path (SQLite): ${DB_PATH}`);
  console.log(`⚡ DBeaver Connection:   Open DBeaver -> New SQLite Connection -> Paste DB Path above!`);
  console.log(`======================================================\n`);
});
