import React, { useState } from 'react';
import './Home.css';
import { problems } from '../utils/problems/index.ts';

function Home() {
  const [joinRoomVisible, setJoinRoomVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [createRoomVisible, setCreateRoomVisible] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/room/');
      const data = await response.json();
      setAvailableRooms(data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };
  const handleJoinRoomClick = () => {
    setJoinRoomVisible(true);
    fetchRooms(); // Fetch rooms when popup opens
  };  

  const handleCancelClick = () => {
    setJoinRoomVisible(false);
  };
  const handleCreateRoomClick = () => {
    setCreateRoomVisible(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          problem: selectedProblem
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Redirect to code editor with room and problem info
        window.location.href = `/editor/${data.room._id}/${selectedProblem}`;
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-buttons">
          <button className="header-button" onClick={handleJoinRoomClick}>
            Join Room
          </button>
      <button className="header-button" onClick={handleCreateRoomClick}>
      Create
      </button>
        </div>
      </header>
      {joinRoomVisible && (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Join Room</h2>
      <div className="room-list">
        {availableRooms.map((room) => (
          <div key={room._id} className="room-item">
            <div className="room-info">
              <h3>{room.roomName}</h3>
              <p>Problem: {problems[room.problem]?.title}</p>
            </div>
            <button 
              className="join-button"
              onClick={() => window.location.href = `/editor/${room._id}/${room.problem}`}
            >
              Join
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="form-cancel"
        onClick={() => setJoinRoomVisible(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
      {createRoomVisible && (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Create Room</h2>
      <form onSubmit={handleCreateRoom}>
        <input 
          type="text" 
          placeholder="Room Name" 
          className="form-input"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <select 
          className="form-select"
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
          required
        >
          <option value="">Select Problem</option>
          {Object.entries(problems).map(([id, problem]) => (
            <option key={id} value={id}>
              {problem.title}
            </option>
          ))}
        </select>
        <div className="popup-buttons">
          <button type="submit" className="form-submit">
            Create
          </button>
          <button
            type="button"
            className="form-cancel"
            onClick={() => setCreateRoomVisible(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <div className={`main-content ${joinRoomVisible ? 'blurred' : ''}`}>
        <div className="card-section">
          <div className="card blog-card">
            <h3>Blogs on Data Structures</h3>
            <p>Explore various blogs related to data structures to enhance your knowledge.
                <a href="https://medium.com/topic/data-structures" target="_blank" rel="noopener noreferrer">Blogs</a></p>
          </div>
          <div className="card video-card">
            <h3>YouTube Videos</h3>
            <p>Watch curated YouTube videos to strengthen your understanding of data structures.
            <a href="https://www.youtube.com/results?search_query=data+structures" target="_blank" rel="noopener noreferrer">
            Watch Videos
            </a>
            </p>
          </div>
          <div className="card chatgpt-card">
            <h3>Need More Help?</h3>
            <p>
              Chat with GPT to clarify your doubts in data structures.
              <a
                href="https://chat.openai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="chat-link"
              >
                Chat with GPT
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
