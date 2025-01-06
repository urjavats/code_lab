//mongoDb
require('./config/db')

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const cors = require('cors');
const server = require("http").createServer(app);
// Create Socket.IO instance
const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
      transports: ['websocket', 'polling']
    }
  });
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('join_room', (data) => {
      socket.join(data.roomId);
      console.log(`User ${socket.id} joined room ${data.roomId}`);
    });
  
    socket.on("code_change", (data) => {
        const { roomId, code } = data;
        console.log(`Code change in room ${roomId}:`, code);
        socket.to(roomId).emit("receive_code", code);
      });
  
      socket.on("chat_message", (data) => {
        const { roomId, message } = data;
        console.log(`Chat message in room ${roomId}:`, message);
        socket.to(roomId).emit("receive_message", message);
      });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('code_change', (data) => {
        console.log(`Broadcasting code change to room ${data.roomId}`);
        socket.to(data.roomId).emit('receive_code', data.code);
      });
      
      socket.on('chat_message', (data) => {
        console.log(`Broadcasting chat message to room ${data.roomId}`);
        socket.to(data.roomId).emit('receive_message', data);
      });
  });
//for accepting post form data
const bodyParser=require('express').json;
app.use(bodyParser());
app.use(express.json());
app.use(cors({
  origin: FRONTEND_URL, // Allow frontend to access backend
  methods: ["GET", "POST"],
  credentials: true,
}));


const userRouter=require('./api/User');
const roomRouter=require('./api/Room');
app.use('/user',userRouter);
app.use('/room',roomRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});
// Allow CORS so that backend and frontend could be put on different servers
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });



