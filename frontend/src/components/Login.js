import React from 'react';
import './Login.css'; // Create a CSS file for styling

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back!</h2>
        <form>
          <div className="form-group">
            <label htmlFor="loginId">Login ID</label>
            <input type="text" id="loginId" placeholder="Enter your login ID" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn">Sign In</button>
        </form>
      </div>
      <div className="login-image">
        <img 
          src="https://via.placeholder.com/500x400?text=Coding+Image" 
          alt="Coding" 
        />
      </div>
    </div>
  );
};

export default LoginPage;
