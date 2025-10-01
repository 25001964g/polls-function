import React, { useState } from 'react';
import { generatePollCode } from '../utils/pollUtils';
import './PollCreator.css';

const PollCreator = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollType, setPollType] = useState('Multiple Choice');
  const [isCreating, setIsCreating] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsCreating(true);

    const newPoll = {
      id: Date.now().toString(),
      code: generatePollCode(),
      question: question.trim(),
      type: pollType,
      options: validOptions.map((option, index) => ({
        id: index,
        text: option.trim(),
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await onCreatePoll(newPoll);
    setIsCreating(false);
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setPollType('Multiple Choice');
  };

  const pollTypes = [
    'Multiple Choice',
    'Single Choice',
    'Rating Scale',
    'Yes/No Question'
  ];

  return (
    <div className="poll-creator-container">
      <div className="poll-creator-header">
        <h2>Create a New Poll</h2>
      </div>

      <form onSubmit={handleSubmit} className="poll-creator-form">
        <div className="form-group">
          <label htmlFor="question">Poll Question *</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask your audience?"
            rows="3"
            maxLength="200"
            required
          />
          <small>{question.length}/200 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="poll-type">Poll Type</label>
          <select
            id="poll-type"
            value={pollType}
            onChange={(e) => setPollType(e.target.value)}
          >
            {pollTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Answer Options *</label>
          <div className="options-container">
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  maxLength="100"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="remove-option-btn"
                    title="Remove option"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-poll-btn"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>

      <div className="poll-preview">
        <h3>Preview</h3>
        <div className="preview-content">
          <h4>{question || 'Your question will appear here'}</h4>
          <div className="preview-options">
            {options.filter(opt => opt.trim()).map((option, index) => (
              <div key={index} className="preview-option">
                {option || `Option ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;