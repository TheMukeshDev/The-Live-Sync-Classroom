import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Poll from './Poll';
import '../styles/PollManager.css';

function PollManager({ socket, polls }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter((opt) => opt.trim());
    if (!question.trim() || validOptions.length < 2) {
      alert('Please enter a question and at least 2 options');
      return;
    }

    socket.emit('create-poll', {
      question,
      options: validOptions,
    });

    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="poll-manager">
      <div className="poll-creation-section">
        <h3>Create New Poll</h3>
        <div className="create-form">
          <input
            type="text"
            placeholder="Poll question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="question-input"
          />

          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="btn-remove-option"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="poll-actions">
            <button onClick={handleAddOption} className="btn-add-option">
              <Plus size={18} />
              Add Option
            </button>
            <button onClick={handleCreatePoll} className="btn-create-poll">
              Create Poll
            </button>
          </div>
        </div>
      </div>

      <div className="polls-container">
        {polls.length === 0 ? (
          <div className="empty-state">
            <p>🗳️ No polls yet. Create one to engage your classroom!</p>
          </div>
        ) : (
          polls.map((poll) => (
            <Poll
              key={poll.id}
              poll={poll}
              socket={socket}
            />
          ))
        )}
      </div>

      <div className="poll-stats">
        Total Polls: {polls.length}
      </div>
    </div>
  );
}

export default PollManager;
