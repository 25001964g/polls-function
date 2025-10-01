import React, { useState } from 'react';
import './JoinPoll.css';

const JoinPoll = ({ polls, onJoinPoll, onCancel }) => {
  const [pollCode, setPollCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Auto-format with dash
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 6);
    }
    
    setPollCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pollCode.trim()) {
      setError('Please enter a poll code');
      return;
    }

    // Remove dash for comparison
    const cleanCode = pollCode.replace('-', '');
    
    if (cleanCode.length !== 6) {
      setError('Poll code must be 6 characters long');
      return;
    }

    setIsJoining(true);

    // Find poll by code
    const poll = polls.find(p => p.code === cleanCode);
    
    if (!poll) {
      setError('Poll not found. Please check the code and try again.');
      setIsJoining(false);
      return;
    }

    if (!poll.isActive) {
      setError('This poll is no longer active.');
      setIsJoining(false);
      return;
    }

    await onJoinPoll(poll);
    setIsJoining(false);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (pastedText.length <= 6) {
      let formattedCode = pastedText;
      if (formattedCode.length > 3) {
        formattedCode = formattedCode.slice(0, 3) + '-' + formattedCode.slice(3);
      }
      setPollCode(formattedCode);
      setError('');
    }
  };

  return (
    <div className="join-poll-container">
      <div className="join-poll-header">
        <h2>🎯 Join a Poll</h2>
        <p>Enter the 6-character poll code to participate</p>
      </div>

      <form onSubmit={handleSubmit} className="join-poll-form">
        <div className="form-group">
          <label htmlFor="poll-code">Poll Code</label>
          <input
            id="poll-code"
            type="text"
            value={pollCode}
            onChange={handleCodeChange}
            onPaste={handlePaste}
            placeholder="XXX-XXX"
            maxLength="7"
            className={`poll-code-input ${error ? 'error' : ''}`}
            autoComplete="off"
            autoFocus
          />
          <small className="input-hint">
            Format: ABC-123 (case insensitive)
          </small>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={isJoining}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="join-btn"
            disabled={isJoining || !pollCode.trim()}
          >
            {isJoining ? 'Joining...' : 'Join Poll'}
          </button>
        </div>
      </form>

      <div className="join-poll-help">
        <h3>How to get a poll code?</h3>
        <ul>
          <li>Ask the poll creator for the 6-character code</li>
          <li>The code appears on the poll results page</li>
          <li>Codes are case-insensitive (ABC123 = abc123)</li>
          <li>Use dashes for easier reading (ABC-123)</li>
        </ul>
      </div>

      <div className="available-polls-hint">
        <p>Don't have a code? <button 
          type="button" 
          className="link-btn"
          onClick={onCancel}
        >
          Browse available polls
        </button></p>
      </div>
    </div>
  );
};

export default JoinPoll;