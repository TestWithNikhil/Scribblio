import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomService } from './game/roomService.js';
import { registerSocketHandlers } from './socket/serverSocket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const roomService = new RoomService();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

registerSocketHandlers(io, roomService);

const port = Number(process.env.PORT || 3001);

httpServer.listen(port, () => {
  console.log(`Scribblio server running on http://localhost:${port}`);
});
