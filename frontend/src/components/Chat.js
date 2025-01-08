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
      authEndpoint: 'https://code-lab-five.vercel.app/pusher/auth',
    });
    pusher.connection.bind('connected', () => {
      const socketId = pusher.connection.socket_id;  // Get the socket ID
      const channelName = `private-${roomId}`;  // This is the channel to subscribe to
      console.log("Sending auth data:", { socket_id: socketId, channel_name: channelName });
      // Make an authentication request to your backend with socket_id and channel_name
      fetch('https://code-lab-five.vercel.app/pusher/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channelName,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        // After successful authentication, subscribe to the channel
        const channel = pusher.subscribe('private-677a3aeb9f8febabd93203cd');
        channel.bind('chat_message', function(data) {
          console.log("Received message via Pusher:", data);
          setMessages((prev) => [...prev, data.message]);
        });
      })
      .catch((error) => {
        console.error('Error during Pusher auth', error);
      });
    });

    return () => {
      pusher.disconnect(); // Ensure cleanup of Pusher connection
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
        // Send message data to backend API to store it
        const response = await fetch(`${API_BASE_URL}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });
  
        // If message is successfully saved, trigger Pusher event
        if (response.ok) {
          // Trigger Pusher event to broadcast the message
          const broadcastResponse = await fetch(`${API_BASE_URL}/broadcast-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData),
          });
  
          if (broadcastResponse.ok) {
            setNewMessage(''); // Clear the input box
          } else {
            console.error('Error broadcasting message');
          }
        } else {
          console.error('Error saving message');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    console.log("Updated messages:", messages);
  }, [messages]);

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
              <div key={message.id || message.timestamp
              } className={`message ${message.sender === userEmail ? 'sent' : 'received'}`}>
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
