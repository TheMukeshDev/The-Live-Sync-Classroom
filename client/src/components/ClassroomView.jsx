import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import StickyNoteBoard from './StickyNoteBoard';
import PollManager from './PollManager';
import UserList from './UserList';
import '../styles/ClassroomView.css';

function ClassroomView({ socket, classroomId, userName, onLeave }) {
  const [notes, setNotes] = useState([]);
  const [polls, setPolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    if (!socket) return;

    // Receive initial classroom state
    socket.on('classroom-state', (data) => {
      setNotes(data.notes);
      setPolls(data.polls);
      setUsers(data.users);
    });

    // Notes
    socket.on('note-added', (note) => {
      setNotes((prev) => [...prev, note]);
    });

    socket.on('note-updated', (updatedNote) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
    });

    socket.on('note-deleted', (data) => {
      setNotes((prev) => prev.filter((note) => note.id !== data.noteId));
    });

    // Polls
    socket.on('poll-created', (poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    socket.on('poll-updated', (updatedPoll) => {
      setPolls((prev) =>
        prev.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
      );
    });

    socket.on('poll-deleted', (data) => {
      setPolls((prev) => prev.filter((poll) => poll.id !== data.pollId));
    });

    // Users
    socket.on('user-joined', (data) => {
      setUsers((prev) => [
        ...prev.filter((u) => u.userId !== data.userId),
        {
          userId: data.userId,
          userName: data.userName,
          color: data.color,
        },
      ]);
    });

    socket.on('user-left', (data) => {
      setUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    return () => {
      socket.off('classroom-state');
      socket.off('note-added');
      socket.off('note-updated');
      socket.off('note-deleted');
      socket.off('poll-created');
      socket.off('poll-updated');
      socket.off('poll-deleted');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket]);

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  return (
    <div className="classroom-view">
      <header className="classroom-header">
        <div className="header-left">
          <h1>📚 Live Sync Classroom</h1>
          <p className="current-user">Welcome, {userName}!</p>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLeave}>
            <LogOut size={20} />
            Leave Classroom
          </button>
        </div>
      </header>

      <div className="classroom-container">
        <aside className="sidebar">
          <UserList users={users} currentUser={userName} />
        </aside>

        <main className="classroom-main">
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              📌 Sticky Notes
            </button>
            <button
              className={`tab ${activeTab === 'polls' ? 'active' : ''}`}
              onClick={() => setActiveTab('polls')}
            >
              🗳️ Live Polls
            </button>
          </nav>

          {activeTab === 'notes' && (
            <StickyNoteBoard socket={socket} notes={notes} />
          )}
          {activeTab === 'polls' && (
            <PollManager socket={socket} polls={polls} />
          )}
        </main>
      </div>
    </div>
  );
}

export default ClassroomView;
