import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [joinRoomVisible, setJoinRoomVisible] = useState(false);

  const handleJoinRoomClick = () => {
    setJoinRoomVisible(true);
  };

  const handleCancelClick = () => {
    setJoinRoomVisible(false);
  };

  const handleCreateRoomClick = () => {
    alert('Create Room clicked!');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-buttons">
          <button className="header-button" onClick={handleCreateRoomClick}>
            Join Room
          </button>
          <button className="header-button" onClick={handleJoinRoomClick}>
            Create Room
          </button>
        </div>
      </header>

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

      {joinRoomVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Join Room</h2>
            <form>
              <input type="text" placeholder="Room Name" className="form-input" />
              <select className="form-select">
                <option>Select Problem</option>
                <option>Problem 1</option>
                <option>Problem 2</option>
                <option>Problem 3</option>
              </select>
              <button type="submit" className="form-submit">
                Create
              </button>
              <button
                type="button"
                className="form-cancel"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
