import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import '../styles/Poll.css';

function Poll({ poll, socket }) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId) => {
    socket.emit('vote-poll', {
      pollId: poll.id,
      optionId,
    });
    setHasVoted(true);
  };

  const handleDeletePoll = () => {
    if (confirm('Delete this poll?')) {
      socket.emit('delete-poll', { pollId: poll.id });
    }
  };

  const totalVotes = Object.keys(poll.responses).length;

  return (
    <div className="poll-card">
      <div className="poll-header">
        <h3>{poll.question}</h3>
        <button
          className="delete-poll-btn"
          onClick={handleDeletePoll}
          title="Delete poll"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <small className="poll-author">By {poll.userName}</small>

      <div className="poll-options">
        {poll.options.map((option, index) => {
          const optionVotes = Object.values(poll.responses).filter(
            (v) => v === index
          ).length;
          const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;

          return (
            <button
              key={index}
              className={`poll-option ${
                hasVoted ? 'disabled' : ''
              }`}
              onClick={() => !hasVoted && handleVote(index)}
              disabled={hasVoted}
            >
              <div className="option-text">
                <span>{option}</span>
                <span className="vote-count">
                  {optionVotes} vote{optionVotes !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="poll-stats">
        Total Votes: {totalVotes}
        {hasVoted && <span className="voted-badge">✓ You voted</span>}
      </div>
    </div>
  );
}

export default Poll;
