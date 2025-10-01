import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formatPollCode } from '../utils/pollUtils';
import './PollResults.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PollResults = ({ poll, onBack, onDeletePoll }) => {
  const getTotalVotes = () => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const chartColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
    '#4BC0C0',
    '#FF6384'
  ];

  const barChartData = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(option => option.votes),
        backgroundColor: chartColors.slice(0, poll.options.length),
        borderColor: chartColors.slice(0, poll.options.length).map(color => color + '80'),
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        data: poll.options.map(option => option.votes),
        backgroundColor: chartColors.slice(0, poll.options.length),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Poll Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Vote Distribution',
      },
    },
  };

  const handleDeletePoll = () => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      onDeletePoll(poll.id);
    }
  };

  return (
    <div className="poll-results-container">
      <div className="results-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Polls
        </button>
        <div className="poll-info">
          <h2>{poll.question}</h2>
          <div className="poll-meta">
            <span className="poll-type">{poll.type}</span>
            <span className="poll-code">Code: {formatPollCode(poll.code)}</span>
            <span className="total-votes">{getTotalVotes()} total votes</span>
            <span className="created-date">
              Created: {new Date(poll.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button onClick={handleDeletePoll} className="delete-poll-btn">
          Delete Poll
        </button>
      </div>

      <div className="results-content">
        <div className="results-summary">
          <h3>Results Summary</h3>
          <div className="summary-grid">
            {poll.options.map((option, index) => (
              <div key={option.id} className="summary-item">
                <div className="option-label">
                  <span 
                    className="color-indicator" 
                    style={{ backgroundColor: chartColors[index] }}
                  ></span>
                  {option.text}
                </div>
                <div className="vote-stats">
                  <span className="vote-count">{option.votes} votes</span>
                  <span className="vote-percentage">({getPercentage(option.votes)}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${getPercentage(option.votes)}%`,
                      backgroundColor: chartColors[index]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {getTotalVotes() > 0 ? (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Bar Chart</h3>
              <div className="chart-wrapper">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-section">
              <h3>Distribution Chart</h3>
              <div className="chart-wrapper">
                <Doughnut data={doughnutChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-votes-message">
            <h3>No votes yet</h3>
            <p>Share this poll to start collecting responses!</p>
          </div>
        )}

        <div className="poll-actions">
          <button className="share-btn">
            📤 Share Poll
          </button>
          <button className="export-btn">
            📊 Export Results
          </button>
          <button className="reset-btn" onClick={() => {
            if (window.confirm('Are you sure you want to reset all votes? This action cannot be undone.')) {
              // Reset votes logic would go here
              console.log('Reset votes for poll:', poll.id);
            }
          }}>
            🔄 Reset Votes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollResults;