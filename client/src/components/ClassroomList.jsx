import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import '../styles/ClassroomList.css';

function ClassroomList({ socket, onJoin, showNameInput }) {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/classrooms');
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassroomName }),
      });
      const classroom = await response.json();
      setClassrooms((prev) => [...prev, classroom]);
      setNewClassroomName('');
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const handleJoinClassroom = (classroomId) => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    onJoin(classroomId, userName);
  };

  return (
    <div className="classroom-list-container">
      <header className="list-header">
        <h1>🎓 Live Sync Classroom</h1>
        <p>Real-time Collaboration Tool</p>
      </header>

      {showNameInput && (
        <div className="name-input-section">
          <h2>Welcome to Live Sync Classroom!</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && userName && handleJoinClassroom(classrooms[0]?.id)}
            className="name-input"
          />
        </div>
      )}

      <div className="create-classroom">
        <h2>Create New Classroom</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Classroom name (e.g., Biology 101)"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateClassroom()}
          />
          <button onClick={handleCreateClassroom} className="btn-create">
            <Plus size={20} />
            Create
          </button>
        </div>
      </div>

      <section className="classrooms-section">
        <h2>Available Classrooms</h2>
        {loading ? (
          <p className="loading">Loading classrooms...</p>
        ) : classrooms.length === 0 ? (
          <p className="no-classrooms">No classrooms yet. Create one to get started!</p>
        ) : (
          <div className="classrooms-grid">
            {classrooms.map((classroom) => (
              <div key={classroom.id} className="classroom-card">
                <h3>{classroom.name}</h3>
                <div className="classroom-stats">
                  <span>👥 {classroom.userCount} users</span>
                  <span>📌 {classroom.noteCount} notes</span>
                  <span>🗳️ {classroom.pollCount} polls</span>
                </div>
                <button
                  onClick={() => handleJoinClassroom(classroom.id)}
                  className="btn-join"
                  disabled={!userName.trim()}
                >
                  Join Classroom
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClassroomList;
