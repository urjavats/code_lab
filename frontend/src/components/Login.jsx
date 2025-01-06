import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Import axios for API calls
import Input from './input.jsx';
import Button from './button.jsx';
import Icon from './Icon.jsx';
import './Login.css';

import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

function Login() {
  const FacebookBackground =
    "linear-gradient(to right, #0546A0 0%, #0546A0 40%, #663FB6 100%)";
  const InstagramBackground =
    "linear-gradient(to right, #A12AC4 0%, #ED586C 40%, #F0A853 100%)";
  const TwitterBackground =
    "linear-gradient(to right, #56C1E1 0%, #35A9CE 50%)";
  
  const handleIconClick = (platform) => {
    const urls = {
      Facebook: 'https://www.facebook.com/LeetCode/',
      Instagram: 'https://www.instagram.com/leetcodeofficial/?hl=en',
      Twitter: 'https://x.com/leetcode?lang=en',
    };
    window.open(urls[platform], '_blank');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);

    if (!email || !password) {
      setError('Please fill in all fields!');
      setMessage('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server Response:', data);
      if (response.ok && data.status === 'SUCCESS') {
        setMessage('Login successful!');
        setError('');
        localStorage.setItem('userEmail', email);
      setTimeout(() => {
        navigate('/home');  
      }, 2000);
        // Handle successful login logic, e.g., navigate to the dashboard
      } else {
        setError(data.message || 'Login failed.');
        setMessage('');
      }
    } catch (error) {
      setError('Error connecting to the server.');
      setMessage('');
      console.error(error);
    }
  };
  

  useEffect(() => {
    document.body.classList.add('login-active');
    return () => {
      document.body.classList.remove('login-active');
    };
  }, []);

  return (
    <MainContainer>
      <WelcomeText>Welcome</WelcomeText>
      <InputContainer>
      <Input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) =>{
    console.log(e.target.value);
    setEmail(e.target.value)}} // Make sure this is being properly updated
/>
<Input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)} // Same here
/>

      </InputContainer>
      <ButtonContainer>
        <Button content="Sign In" onClick={handleSubmit} />
      </ButtonContainer>
      <LoginWith>Don't have an account? <a href="/register">Sign up</a></LoginWith>
      <HorizontalRule />
      <IconsContainer>
        <Icon color={FacebookBackground} onClick={() => handleIconClick('Facebook')}>
          <FaFacebookF />
        </Icon>
        <Icon color={InstagramBackground} onClick={() => handleIconClick('Instagram')}>
          <FaInstagram />
        </Icon>
        <Icon color={TwitterBackground} onClick={() => handleIconClick('Twitter')}>
          <FaTwitter />
        </Icon>
      </IconsContainer>
      <ForgotPassword>Forgot Password?</ForgotPassword>
      {message && <Message>{message}</Message>}
    </MainContainer>
  );
}

const Message = styled.p`
  color: #ff3333;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

// Existing styled-components here...
const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80vh;
  width: 30vw;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.4rem;
  @media only screen and (max-width: 320px) {
    width: 80vw;
    height: 90vh;
    hr {
      margin-bottom: 0.3rem;
    }
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 360px) {
    width: 80vw;
    height: 90vh;
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 411px) {
    width: 80vw;
    height: 90vh;
  }

  @media only screen and (min-width: 768px) {
    width: 80vw;
    height: 80vh;
  }
  @media only screen and (min-width: 1024px) {
    width: 70vw;
    height: 50vh;
  }
  @media only screen and (min-width: 1280px) {
    width: 30vw;
    height: 80vh;
  }
`;

const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 20%;
  width: 100%;
`;

const ButtonContainer = styled.div`
  margin: 1rem 0 2rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginWith = styled.h5`
  cursor: pointer;
`;

const HorizontalRule = styled.hr`
  width: 90%;
  height: 0.3rem;
  border-radius: 0.8rem;
  border: none;
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  background-color: #ebd0d0;
  margin: 1.5rem 0 1rem 0;
  backdrop-filter: blur(25px);
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 2rem 0 3rem 0;
  width: 80%;
`;


const ForgotPassword = styled.h4`
  cursor: pointer;
`;



export default Login;
