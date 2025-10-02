import React, { useState } from 'react';
import { generatePollCode } from '../utils/pollUtils';
import './PollCreator.css';

const PollCreator = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollType, setPollType] = useState('Multiple Choice');
  const [ratingScale, setRatingScale] = useState({ min: 1, max: 5, labels: { min: '', max: '' } });
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

  const resetOptionsForPollType = (type) => {
    switch (type) {
      case 'Yes/No Question':
        setOptions(['Yes', 'No']);
        break;
      case 'Rating Scale':
        setOptions([]);
        setRatingScale({ min: 1, max: 5, labels: { min: '', max: '' } });
        break;
      default:
        setOptions(['', '']);
        break;
    }
  };

  const handlePollTypeChange = (newType) => {
    setPollType(newType);
    resetOptionsForPollType(newType);
  };

  const generateRatingOptions = () => {
    const options = [];
    for (let i = ratingScale.min; i <= ratingScale.max; i++) {
      options.push({
        id: i - 1,
        text: i.toString(),
        votes: 0
      });
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    let pollOptions = [];

    //restriction of options based on poll type
    if (pollType === 'Rating Scale') {
      if (ratingScale.min >= ratingScale.max) {
        alert('Maximum value must be greater than minimum value');
        return;
      }
      pollOptions = generateRatingOptions();
    } else if (pollType === 'Yes/No Question') {
      pollOptions = [
        { id: 0, text: 'Yes', votes: 0 },
        { id: 1, text: 'No', votes: 0 }
      ];
    } else {
      const validOptions = options.filter(option => option.trim() !== '');
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options');
        return;
      }
      pollOptions = validOptions.map((option, index) => ({
        id: index,
        text: option.trim(),
        votes: 0
      }));
    }

    setIsCreating(true);
    //create poll
    const newPoll = {
      id: Date.now().toString(),
      code: generatePollCode(),
      question: question.trim(),
      type: pollType,
      options: pollOptions,
      ...(pollType === 'Rating Scale' && { 
        ratingScale: {
          ...ratingScale,
          labels: {
            min: ratingScale.labels.min || ratingScale.min.toString(),
            max: ratingScale.labels.max || ratingScale.max.toString()
          }
        }
      }),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await onCreatePoll(newPoll);
    setIsCreating(false);
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setPollType('Multiple Choice');
    setRatingScale({ min: 1, max: 5, labels: { min: '', max: '' } });
  };

  const pollTypes = [
    'Multiple Choice',
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
            onChange={(e) => handlePollTypeChange(e.target.value)}
          >
            {pollTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Different option types based on poll type */}
        {pollType === 'Rating Scale' ? (
          <div className="form-group">
            <label>Rating Scale Configuration</label>
            <div className="rating-config">
              <div className="rating-range">
                <div className="range-input">
                  <label>Minimum Value</label>
                  <input
                    type="number"
                    value={ratingScale.min}
                    onChange={(e) => setRatingScale({...ratingScale, min: parseInt(e.target.value) || 1})}
                    min="0"
                    max="9"
                  />
                </div>
                <div className="range-input">
                  <label>Maximum Value</label>
                  <input
                    type="number"
                    value={ratingScale.max}
                    onChange={(e) => setRatingScale({...ratingScale, max: parseInt(e.target.value) || 5})}
                    min="2"
                    max="10"
                  />
                </div>
              </div>
              <div className="rating-labels">
                <div className="label-input">
                  <label>Low End Label (Optional)</label>
                  <input
                    type="text"
                    value={ratingScale.labels.min}
                    onChange={(e) => setRatingScale({
                      ...ratingScale, 
                      labels: {...ratingScale.labels, min: e.target.value}
                    })}
                    placeholder="e.g., Poor, Disagree"
                    maxLength="20"
                  />
                </div>
                <div className="label-input">
                  <label>High End Label (Optional)</label>
                  <input
                    type="text"
                    value={ratingScale.labels.max}
                    onChange={(e) => setRatingScale({
                      ...ratingScale, 
                      labels: {...ratingScale.labels, max: e.target.value}
                    })}
                    placeholder="e.g., Excellent, Agree"
                    maxLength="20"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : pollType === 'Yes/No Question' ? (
          <div className="form-group">
            <label>Answer Options</label>
            <div className="yes-no-display">
              <div className="fixed-option">✓ Yes</div>
              <div className="fixed-option">✗ No</div>
            </div>
            <small>Options are automatically set to Yes/No for this poll type</small>
          </div>
        ) : (
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
        )}

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
            className="submit-created-poll-btn"
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
            {pollType === 'Rating Scale' ? (
              <div className="rating-preview">
                <div className="rating-labels-preview">
                  <span className="rating-label-min">
                    {ratingScale.labels.min || ratingScale.min}
                  </span>
                  <span className="rating-label-max">
                    {ratingScale.labels.max || ratingScale.max}
                  </span>
                </div>
                <div className="rating-scale-preview">
                  {Array.from({ length: ratingScale.max - ratingScale.min + 1 }, (_, i) => (
                    <div key={i} className="rating-option">
                      {ratingScale.min + i}
                    </div>
                  ))}
                </div>
              </div>
            ) : pollType === 'Yes/No Question' ? (
              <div className="yes-no-preview">
                <div className="preview-option yes-option">✓ Yes</div>
                <div className="preview-option no-option">✗ No</div>
              </div>
            ) : (
              options.filter(opt => opt.trim()).map((option, index) => (
                <div key={index} className="preview-option">
                  {option || `Option ${index + 1}`}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;