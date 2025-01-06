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
      origin: "http://localhost:3000",
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
      socket.to(data.roomId).emit('receive_code', data.code);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
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

