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
    // Initialize Pusher
    const pusher = new Pusher('your-pusher-key', {
      cluster: 'us3',
      encrypted: true,
    });
    const channel = pusher.subscribe(roomId);
    channel.bind('chat_message', function(data) {
      setMessages(prev => [...prev, data.message]);
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(roomId);
    };
  }, [roomId]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: userEmail,
        timestamp: new Date().toLocaleTimeString(),
        roomId,
      };

      try {
        await fetch(`${API_BASE_URL}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        // setNewMessage(''); // Clear the input box
      } catch (error) {
        console.error('Error:', error);
      }
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
