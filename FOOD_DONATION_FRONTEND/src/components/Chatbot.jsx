import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa'; // Robot icon
import { FiX } from 'react-icons/fi'; // Close icon
import './chatbot.css';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Sorry, I couldn't process your request." },
      ]);
    }

    setInput('');
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaRobot className="chatbot-icon" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-box">
          <div className="chat-header">
            <span>💬 AI Chatbot</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong>{' '}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about food donation..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
