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
  cluster: 'us3',          
  useTLS: true
});


const allowedOrigins = [
  "http://localhost:3000", 
  "https://code-lab-pu8s.vercel.app"
];


// Create Socket.IO instance
const httpServer = http.createServer(app);
/*const io = new Server(httpServer, {
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
        pusher.trigger('room_' + roomId, 'code_change', { code });
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
  });*/


//for accepting post form data
const bodyParser=require('express').json;
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
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



const userRouter=require('./api/User');
const roomRouter=require('./api/Room');
app.use('/user',userRouter);
app.use('/room',roomRouter);
app.post('/pusher/auth', (req, res) => {
  const { socket_id, channel_name } = req.body;

  // Ensure the channel_name matches your expected naming pattern (e.g., 'private-document')
  if (channel_name.startsWith('private-')) {

    // Authenticate with Pusher
    const auth = pusher.authorizeChannel(socket_id, channel_name);
    console.log(auth);
    // Respond with the Pusher authentication result
    return res.send(auth);
  } else {
    // If channel name doesn't match expected pattern, return an error or reject
    return res.status(403).send('Forbidden');
  }
});
// Pusher event for sending code updates
app.post('/update-code', (req, res) => {
  const { roomId, code } = req.body;
  console.log('Update code received for room:', roomId);
  // Trigger 'code_change' event to notify other clients
  pusher.trigger(`private-${roomId}`, 'code_change', { code });
  res.status(200).send('Code update sent.');
});

app.post('/code_change', (req, res) => {
  const { roomId, code } = req.body;
  console.log(`Code change in room ${roomId}:`, code);

  // Trigger Pusher event
  pusher.trigger(`private-${roomId}`, 'code_change', { code });
  res.status(200).send('Code change broadcasted.');
});

app.post('/messages', (req, res) => {
  const { text, sender, timestamp, roomId } = req.body;
  console.log(`Received message for room ${roomId}:`, { text, sender, timestamp });

  pusher.trigger(roomId, 'chat_message', {
    message: { text, sender, timestamp },
  }).then(() => {
    console.log('Message broadcasted successfully');
    res.status(200).send('Message sent via Pusher.');
  }).catch((error) => {
    console.error('Error broadcasting message:', error);
    res.status(500).send('Error sending message via Pusher.');
  });
});
app.post('/broadcast-message', (req, res) => {
  const { text, sender, timestamp, roomId } = req.body;

  // Broadcast the message to the specified room using Pusher
  pusher.trigger(roomId, 'chat_message', {
    message: {
      text,
      sender,
      timestamp,
    },
  });

  res.status(200).send({ message: 'Message broadcasted successfully' });
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});
module.exports = app;



