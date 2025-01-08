import React, { useState } from 'react';
import './Register.css';  
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    dateOfBirth: '',
    name: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, accountType, dateOfBirth, name, major, company } = formData;

    // Ensure date is in proper format (YYYY-MM-DD)
    const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];

    const newUserData = {
      name,
      email,
      password: 'defaultPassword', // Add a placeholder if needed
      dateOfBirth: formattedDateOfBirth, 
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('User created successfully!');
        setError('');
        setTimeout(() => {
          navigate('/');  
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create user');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred while creating the user');
      setMessage('');
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            </div>
            <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
          </div>
          <div className="button-group">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
