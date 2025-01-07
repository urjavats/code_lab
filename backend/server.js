//mongoDb

require('./config/db')

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const cors = require('cors');
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,  // from your Pusher dashboard
  key: process.env.PUSHER_KEY,      // from your Pusher dashboard
  secret: process.env.PUSHER_SECRET,  // from your Pusher dashboard
  cluster: 'us3',          // Pusher cluster (e.g., 'us2')
  useTLS: true
});

pusher.channel('room_' + roomId)
  .bind('client-code_change', (data) => {
    // Broadcast the code_change event to all clients
    pusher.trigger('room_' + roomId, 'code_change', {
      code: data.code
    });
  });

const allowedOrigins = [
  "http://localhost:3000", 
  "https://code-lab-pu8s.vercel.app"
];


// Create Socket.IO instance
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://code-lab-pu8s.vercel.app"],
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
        pusher.trigger(roomId, 'code_change', { code });
        socket.to(roomId).emit("receive_code", code);
      });
  
      socket.on("chat_message", (data) => {
        const { roomId, message } = data;
        console.log(`Chat message in room ${roomId}:`, message);
        pusher.trigger(roomId, 'chat_message', { message });
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
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin); // Logs the request origin
  console.log("Path:", req.path); // Logs the requested path
  next();
});



const userRouter=require('./api/User');
const roomRouter=require('./api/Room');
app.use('/user',userRouter);
app.use('/room',roomRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});
module.exports = (req, res) => {
  httpServer.emit('request', req, res); // Forward the request to the HTTP server
};



