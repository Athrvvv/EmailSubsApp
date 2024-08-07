import React, { useState } from 'react';
import axios from 'axios';
import './Subscription.css';

const Subscription = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state for message type

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error'); // Set message type to error
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/subscribe', { email });
      setMessage(response.data.message);
      setMessageType(response.data.message === 'You are already subscribed!' ? 'error' : 'success'); // Set message type based on response
      setEmail(''); // Clear the input field
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error'); // Set message type to error
    }
  };

  const handleUnsubscribe = async () => {
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error'); // Set message type to error
      return;
    }
    if (window.confirm('Are you sure you want to unsubscribe?')) {
      try {
        const response = await axios.post('http://localhost:5000/unsubscribe', { email });
        setMessage(response.data.message);
        setMessageType(response.data.message === 'You are not subscribed!' ? 'error' : 'success'); // Set message type based on response
        setEmail(''); // Clear the input field
      } catch (error) {
        console.error(error);
        setMessage('An error occurred. Please try again.');
        setMessageType('error'); // Set message type to error
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h1>Email Subscription</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <div className="button-container">
          <button onClick={handleSubscribe}>Subscribe</button>
          <button onClick={handleUnsubscribe}>Unsubscribe</button>
        </div>
        {message && <p className={messageType}>{message}</p>}
      </div>
    </div>
  );
};

export default Subscription;
