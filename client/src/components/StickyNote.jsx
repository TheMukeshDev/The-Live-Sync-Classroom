import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import '../styles/StickyNote.css';

function StickyNote({ note, socket }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [position, setPosition] = useState({ x: note.x, y: note.y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef(null);

  useEffect(() => {
    setPosition({ x: note.x, y: note.y });
    setContent(note.content);
  }, [note]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.note-actions') || isEditing) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      socket.emit('update-note', {
        noteId: note.id,
        content,
        x: position.x,
        y: position.y,
        color: note.color,
      });
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position, dragOffset, content, note.id]);

  const handleSaveEdit = () => {
    socket.emit('update-note', {
      noteId: note.id,
      content,
      x: position.x,
      y: position.y,
      color: note.color,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this note?')) {
      socket.emit('delete-note', { noteId: note.id });
    }
  };

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${isDragging ? 'dragging' : ''}`}
      style={{
        backgroundColor: note.color,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="note-header">
        <small className="note-author">{note.userName}</small>
        <div className="note-actions">
          <button
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            title="Edit note"
          >
            ✏️
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="note-edit">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
          <button className="save-btn" onClick={handleSaveEdit}>
            Save
          </button>
        </div>
      ) : (
        <p className="note-content">{content}</p>
      )}

      <small className="note-time">
        {new Date(note.updatedAt).toLocaleTimeString()}
      </small>
    </div>
  );
}

export default StickyNote;
