import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access query params
import PromptsList from './PromptsList';
import Navbar from './Navbar'; // Import the Navbar component if not included in App.js
import './ChatUI.css';
import ApiService from '../api/apiClient'; // Import the updated ApiService

function ChatUI() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation(); // Hook to access the current location

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const playerId = queryParams.get('id');
  const playerName = queryParams.get('name');

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-expand textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handlePromptClick = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    const newMessage = { sender: 'user', text: trimmedPrompt };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    setPrompt('');

    try {
      // Determine the API endpoint based on presence of query params
      const apiEndpoint = playerId
        ? `/player/state-by-id?id=${playerId}&prompt=${encodeURIComponent(trimmedPrompt)}`
        : '/player';

      // Make the API call using ApiService
      const response = await ApiService.get(apiEndpoint, {
        // If using state-by-id, no additional params needed as they're in the URL
      });

      // Extract the outputText from the first result
      let aiText =
        response.data.results && response.data.results.length > 0
          ? response.data.results[0].outputText.trim()
          : `AI response to: "${trimmedPrompt}"`;

      // Remove "Bot:" prefix if present
      aiText = aiText.replace(/^Bot:\s*/i, '');

      const aiMessage = { sender: 'ai', text: aiText };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch AI response. Please try again.');
      const aiMessage = { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      {/* Include Navbar if it's not included in App.js */}
      {/* <Navbar /> */}

      <div className="chat-ui-container">
        {/* Conditional Context Box */}

        {messages.length > 0 && (
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'ai' ? 'ai-message' : 'user-message'}`}
                style={{
                  textAlign: msg.sender === 'ai' ? 'left' : 'right',
                }}
              >
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
        {messages.length === 0 && <PromptsList handlePromptClick={handlePromptClick} isPlayerPrompt={playerId && playerName} playerName={playerName} />}
        
        <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-form-container">
          {playerId && playerName && (
            <div className="context-box">
              Questions about <strong>{playerName}</strong>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="prompt-textarea"
            aria-label="Chat prompt input"
            rows={1}
            maxLength={500}
            disabled={isLoading}
          />
        </div>
          <button type="submit" className="send-button" aria-label="Send message" disabled={isLoading}>
            {isLoading ? <img src="/loader.gif" alt="Sending..." height="300px" width="300px" /> : <img src="/send-svgrepo-com.svg" alt="Send" />}
          </button>
        </form>

        {/* Display Error Message if Any */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default ChatUI;
