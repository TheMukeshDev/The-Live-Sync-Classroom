import React, { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import StickyNote from './StickyNote';
import '../styles/StickyNoteBoard.css';

function StickyNoteBoard({ socket, notes }) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const boardRef = useRef(null);

  const colors = [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#95E1D3', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Blue
    '#F8B88B', // Orange
  ];

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const randomX = Math.random() * (window.innerWidth - 250);
    const randomY = Math.random() * (window.innerHeight - 250);

    socket.emit('add-note', {
      content: newNoteContent,
      color: selectedColor,
      x: randomX,
      y: randomY,
    });

    setNewNoteContent('');
  };

  return (
    <div className="sticky-note-board">
      <div className="note-creation-section">
        <h3>Create New Sticky Note</h3>
        <div className="create-form">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAddNote();
              }
            }}
          />
          <div className="color-picker">
            <span>Color:</span>
            {colors.map((color) => (
              <button
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                title={color}
              />
            ))}
          </div>
          <button onClick={handleAddNote} className="btn-add-note">
            <Plus size={18} />
            Add Note
          </button>
        </div>
      </div>

      <div className="board" ref={boardRef}>
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>📝 No sticky notes yet. Create one to get started!</p>
          </div>
        ) : (
          notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              socket={socket}
            />
          ))
        )}
      </div>

      <div className="note-stats">
        Total Notes: {notes.length}
      </div>
    </div>
  );
}

export default StickyNoteBoard;
