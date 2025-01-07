// Chat.js
import React, { useState, useEffect } from 'react';
import './Chat.css';
import { io } from 'socket.io-client';
import Pusher from 'pusher-js';

function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [socket, setSocket] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const newSocket = io(`${API_BASE_URL}`);
    setSocket(newSocket);

    // Join the specific room
    newSocket.emit('join_room', { roomId });

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    const pusher = new Pusher('your-pusher-key', {
      cluster: 'us3',
      forceTLS: true
    });
    const channel = pusher.subscribe(roomId);
    channel.bind('chat_message', function(data) {
      setMessages(prev => [...prev, data.message]);
    });
    return () => {
      newSocket.disconnect();
      pusher.unsubscribe(roomId);
    };
  }, [roomId]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        id: Date.now(),
        text: newMessage,
        sender: userEmail, // Will be replaced with actual user data later
        timestamp: new Date().toLocaleTimeString(),
        roomId: roomId
      };

      // Emit message to server
      socket.emit('send_message', messageData);
      
      // Update local state
      setMessages([...messages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <div className={`chat-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="chat-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Room Chat</h3>
        <button className="toggle-button">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === userEmail ? 'sent' : 'received'}`}>
                <div className="message-header">
                  <span className="sender">{message.sender}</span>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
