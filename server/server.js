require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const queueRoutes = require('./routes/queueRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const authRoutes = require('./routes/authRoutes');
const canteenRoutes = require('./routes/canteenRoutes');
const menuRoutes = require('./routes/menuRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const queueService = require('./services/queueService');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach Socket.IO to Express app
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${req.method}] ${req.url}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'WAITWISE College Canteen Queue Intelligence API',
    timestamp: new Date(),
  });
});

// Dedicated Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/services', canteenRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/orders', queueRoutes);
app.use('/api/token', tokenRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Socket.IO Connection Logic
io.on('connection', (socket) => {
  console.log(`⚡ Client connected via Socket.IO: ${socket.id}`);

  socket.on('join_location', (locationId) => {
    const room = `location_${locationId}`;
    socket.join(room);
    console.log(`📍 Socket ${socket.id} joined room ${room}`);
  });

  socket.on('leave_location', (locationId) => {
    const room = `location_${locationId}`;
    socket.leave(room);
    console.log(`🚪 Socket ${socket.id} left room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed demo data on startup
  try {
    await queueService.seedDemoData('main-campus');
    await queueService.seedDemoData('block-b');
  } catch (err) {
    console.warn('Initial seed notice:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 WAITWISE Canteen Backend running on http://localhost:${PORT}`);
    console.log(`📡 Real-Time Socket.IO initialized`);
    console.log(`=============================================`);
  });
};

startServer();
