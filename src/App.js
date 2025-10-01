import React, { useState, useEffect } from 'react';
import Poll from './components/Poll';
import PollCreator from './components/PollCreator';
import PollResults from './components/PollResults';
import JoinPoll from './components/JoinPoll';
import { generatePollCode } from './utils/pollUtils';
import './App.css';

const App = () => {
  const [polls, setPolls] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'vote', 'results', 'join'
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    const savedVotes = localStorage.getItem('userVotes');
    
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    } else {
      // Initialize with sample polls
      initializeSamplePolls();
    }
    
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, []);

  // Save data to localStorage whenever polls or votes change
  useEffect(() => {
    localStorage.setItem('polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
  }, [userVotes]);

  const initializeSamplePolls = () => {
    const samplePolls = [
      {
        id: '1',
        code: 'ABC123',
        question: 'What is your favorite programming language?',
        type: 'Multiple Choice',
        options: [
          { id: 0, text: 'JavaScript', votes: 15 },
          { id: 1, text: 'Python', votes: 12 },
          { id: 2, text: 'Java', votes: 8 },
          { id: 3, text: 'TypeScript', votes: 10 }
        ],
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '2',
        code: 'DEF456',
        question: 'How satisfied are you with remote working?',
        type: 'Rating Scale',
        options: [
          { id: 0, text: 'Very Satisfied', votes: 18 },
          { id: 1, text: 'Satisfied', votes: 14 },
          { id: 2, text: 'Neutral', votes: 5 },
          { id: 3, text: 'Dissatisfied', votes: 2 },
          { id: 4, text: 'Very Dissatisfied', votes: 1 }
        ],
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '3',
        code: 'GHI789',
        question: 'Should we implement dark mode for our application?',
        type: 'Yes/No Question',
        options: [
          { id: 0, text: 'Yes, definitely!', votes: 25 },
          { id: 1, text: 'No, not necessary', votes: 7 }
        ],
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];
    setPolls(samplePolls);
  };

  const handleCreatePoll = async (newPoll) => {
    setPolls(prevPolls => [...prevPolls, newPoll]);
    setCurrentView('list');
  };

  const handleVote = async (pollId, optionId) => {
    // Update poll votes
    setPolls(prevPolls =>
      prevPolls.map(poll =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map(option =>
                option.id === optionId
                  ? { ...option, votes: option.votes + 1 }
                  : option
              )
            }
          : poll
      )
    );

    // Record user vote
    setUserVotes(prevVotes => ({
      ...prevVotes,
      [pollId]: optionId
    }));
  };

  const handleDeletePoll = (pollId) => {
    setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId));
    
    // Remove user vote for this poll
    setUserVotes(prevVotes => {
      const newVotes = { ...prevVotes };
      delete newVotes[pollId];
      return newVotes;
    });
    
    setCurrentView('list');
  };

  const handleJoinPoll = async (poll) => {
    setSelectedPoll(poll);
    setCurrentView('vote');
  };

  const openPoll = (poll) => {
    setSelectedPoll(poll);
    setCurrentView('vote');
  };

  const openResults = (poll) => {
    setSelectedPoll(poll);
    setCurrentView('results');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <PollCreator
            onCreatePoll={handleCreatePoll}
            onCancel={() => setCurrentView('list')}
          />
        );
      
      case 'join':
        return (
          <JoinPoll
            polls={polls}
            onJoinPoll={handleJoinPoll}
            onCancel={() => setCurrentView('list')}
          />
        );
      
      case 'vote':
        return selectedPoll ? (
          <Poll
            poll={selectedPoll}
            onVote={handleVote}
            hasVoted={userVotes.hasOwnProperty(selectedPoll.id)}
            userVote={userVotes[selectedPoll.id]}
          />
        ) : null;
      
      case 'results':
        return selectedPoll ? (
          <PollResults
            poll={selectedPoll}
            onBack={() => setCurrentView('list')}
            onDeletePoll={handleDeletePoll}
          />
        ) : null;
      
      default:
        return (
          <div className="polls-list-container">
            <div className="polls-header">
              <h1>Polls Creator</h1>
              <div className="header-actions">
                <button
                  className="join-poll-btn btn btn-secondary"
                  onClick={() => setCurrentView('join')}
                >
                Join with Code
                </button>
                <button
                  className="create-poll-btn btn btn-primary"
                  onClick={() => setCurrentView('create')}
                >
                Create New Poll
                </button>
              </div>
            </div>

            {polls.length === 0 ? (
              <div className="no-polls-message">
                <h3>No polls available</h3>
                <p>Create your first poll to get started!</p>
              </div>
            ) : (
              <div className="polls-grid">
                {polls.map((poll) => (
                  <div key={poll.id} className="poll-card">
                    <div className="poll-card-header">
                      <h3 className="poll-card-title">{poll.question}</h3>
                      <div className="poll-card-meta">
                        <span className="poll-type-badge">{poll.type}</span>
                        <span className="poll-code-badge">#{poll.code}</span>
                        <span className="poll-date">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="poll-card-stats">
                      <div className="stat">
                        <span className="stat-number">
                          {poll.options.reduce((total, option) => total + option.votes, 0)}
                        </span>
                        <span className="stat-label">Total Votes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{poll.options.length}</span>
                        <span className="stat-label">Options</span>
                      </div>
                      <div className="vote-status">
                        {userVotes.hasOwnProperty(poll.id) ? (
                          <span className="voted-indicator">✅ Voted</span>
                        ) : (
                          <span className="not-voted-indicator">⏳ Not Voted</span>
                        )}
                      </div>
                    </div>

                    <div className="poll-card-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => openPoll(poll)}
                        disabled={userVotes.hasOwnProperty(poll.id)}
                      >
                        {userVotes.hasOwnProperty(poll.id) ? 'View Poll' : 'Vote Now'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => openResults(poll)}
                      >
                        Results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="app">
      <div className="container">
        {currentView !== 'list' && (
          <div className="navigation">
            <button
              className="back-to-list-btn"
              onClick={() => setCurrentView('list')}
            >
              ← Back to Polls
            </button>
          </div>
        )}
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default App;