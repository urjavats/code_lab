//mongoDb
require('./config/db')

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const port = 5000;
const cors = require('cors');
const server = http.createServer(app);
// Create Socket.IO instance
const io = new Server(server, {
    cors: {
      origin: "http://192.168.137.1:3000",
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
  
    socket.on('code_change', (data) => {
      // Broadcast to all users in the room except sender
      socket.to(data.roomId).emit('receive_code', data.code);
    });
  
    socket.on('chat_message', (data) => {
      // Broadcast chat messages to room
      socket.to(data.roomId).emit('receive_message', data);
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
app.use(cors());

const userRouter=require('./api/User');
const roomRouter=require('./api/Room');
app.use('/user',userRouter)
app.use('/room',roomRouter)
// Allow CORS so that backend and frontend could be put on different servers

server.listen(port,()=>{
    console.log(`Server Running on Port ${port}`);
})



