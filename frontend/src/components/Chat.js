// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { io } from 'socket.io-client';
import Pusher from 'pusher-js';

function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [socket, setSocket] = useState(null);
  const userEmail = sessionStorage.getItem('userEmail');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [sentMessages, setSentMessages] = useState(new Set());
  const channelRef = useRef(null);
  const messageIdSet = useRef(new Set());
  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('5d9419420d30ef661f76', {
      cluster: 'us3',
      encrypted: true,
      authEndpoint: 'https://code-lab-five.vercel.app/pusher/auth',
    });
    // const channel = pusher.subscribe('test-channel');

/*channel.bind('test-event', (data) => {
  console.log('Received event data:', data);
});*/


//Debugging: Add listeners for connection state change
/*pusher.connection.bind('state_change', (state) => {
  console.log('Connection state changed:', state);
});*/

/*pusher.connection.bind('error', (err) => {
  console.error('Connection error:', err);
});*/

    pusher.connection.bind('connected', () => {
      const socketId = pusher.connection.socket_id;  // Get the socket ID
      // const channelName = `private-${roomId}`;   // This is the channel to subscribe to
      //console.log("Sending auth data:", { socket_id: socketId, channel_name: channelName });
      // Make an authentication request to your backend with socket_id and channel_name
      fetch('https://code-lab-five.vercel.app/pusher/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: `private-${roomId}`,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        // After successful authentication, subscribe to the channel
        // const channel = pusher.subscribe(roomId);
        channelRef.current = pusher.subscribe(roomId);
        channelRef.current.bind('chat_message', function(data) {
          console.log("Received message via Pusher:", data);
          const messageId = `${data.message.timestamp}-${data.message.sender}`;

          if (!messageIdSet.current.has(messageId)) {
            // setMessages((prevMessages) => [...prevMessages, data.message]);
            // setSentMessages((prevSent) => new Set(prevSent).add(data.message.timestamp));
            // setMessages((prevMessages) => [...prevMessages, data.message]);
            // setMessages((prev) => [...prev, data.message]);
            // setSentMessages((prev) => new Set(prev).add(uniqueKey));
            setMessages((prevMessages) => [...prevMessages, data.message]);
            messageIdSet.current.add(messageId);
            if (!isExpanded) {
              setIsExpanded(true);
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error during Pusher auth', error);
      });
    });

    return () => {
      //channel.unbind_all();
      //channel.unsubscribe();
      //pusher.disconnect(); // Ensure cleanup of Pusher connection
      if (channelRef.current) {
        channelRef.current.unbind('chat_message'); // Unbind the event handler
        pusher.unsubscribe(roomId); // Unsubscribe from the channel
      }
      pusher.disconnect();
    };
  }, [roomId]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: userEmail,
       //  timestamp: new Date().toLocaleTimeString(),
       timestamp: new Date().toISOString(),
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
            {messages.map((message,index) => (
              <div 
              key={`${message.id || message.timestamp}-${message.sender}-${index}`} className={`message ${message.sender === userEmail ? 'sent' : 'received'}`}>
                <div className="message-header">
                  <span className="sender">{message.sender}</span>
                  <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
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
