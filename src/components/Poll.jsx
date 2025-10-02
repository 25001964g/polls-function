import React, { useState, useEffect } from 'react';
import './Poll.css';

const Poll = ({ poll, onVote, hasVoted, userVote }) => {
  const [selectedOption, setSelectedOption] = useState(userVote || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    setSelectedOption(userVote || null);
  }, [userVote]);

  const handleOptionSelect = (optionId) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null || hasVoted || isSubmitting) return;
    
    setIsSubmitting(true);
    await onVote(poll.id, selectedOption);
    setIsSubmitting(false);
  };

  const getTotalVotes = () => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  return (
    <div className="poll-container">
      <div className="poll-header">
        <h2 className="poll-question">{poll.question}</h2>
        <div className="poll-meta">
          <span className="poll-type">{poll.type}</span>
          <span className="vote-count">{getTotalVotes()} votes</span>
        </div>
      </div>

      <div className="poll-options">
        {poll.type === 'Rating Scale' ? (
          <div className="rating-poll">
            {poll.ratingScale?.labels && (
              <div className="rating-labels">
                <span className="rating-label-min">
                  {poll.ratingScale.labels.min}
                </span>
                <span className="rating-label-max">
                  {poll.ratingScale.labels.max}
                </span>
              </div>
            )}
            <div className="rating-options">
              {poll.options.map((option) => (
                <div
                  key={option.id}
                  className={`rating-option ${
                    selectedOption === option.id ? 'selected' : ''
                  } ${hasVoted ? 'voted' : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="rating-number">{option.text}</div>
                  {hasVoted && (
                    <div className="rating-stats">
                      <div 
                        className="rating-bar"
                        style={{ height: `${getPercentage(option.votes)}%` }}
                      />
                      <span className="rating-percentage">
                        {getPercentage(option.votes)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          poll.options.map((option) => (
            <div
              key={option.id}
              className={`poll-option ${
                selectedOption === option.id ? 'selected' : ''
              } ${hasVoted ? 'voted' : ''} ${
                poll.type === 'Yes/No Question' ? 
                  (option.text === 'Yes' ? 'yes-option' : 'no-option') : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="option-content">
                <div className="option-text">
                  {poll.type === 'Yes/No Question' ? 
                    (option.text === 'Yes' ? '✓ Yes' : '✗ No') : 
                    option.text
                  }
                </div>
                {hasVoted && (
                  <div className="option-stats">
                    <span className="vote-percentage">
                      {getPercentage(option.votes)}%
                    </span>
                    <span className="vote-count">({option.votes} votes)</span>
                  </div>
                )}
              </div>
              
              {hasVoted && (
                <div 
                  className="vote-bar"
                  style={{ width: `${getPercentage(option.votes)}%` }}
                />
              )}
              
              {selectedOption === option.id && !hasVoted && (
                <div className="selection-indicator">✓</div>
              )}
            </div>
          ))
        )}
      </div>

      {!hasVoted && (
        <div className="poll-actions">
          <button
            className="submit-vote-btn"
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="voted-message">
          <p>Thank you for voting! You voted for: <strong>{poll.options.find(opt => opt.id === userVote)?.text}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Poll;