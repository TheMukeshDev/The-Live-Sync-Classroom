import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ClassroomList from './components/ClassroomList';
import ClassroomView from './components/ClassroomView';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const handleJoinClassroom = (classroomId, name) => {
    if (!socket) return;

    setUserName(name);
    setShowNameInput(false);
    setCurrentClassroom(classroomId);
    socket.emit('join-classroom', { classroomId, userName: name });
  };

  const handleLeaveClassroom = () => {
    setCurrentClassroom(null);
    setShowNameInput(true);
  };

  if (!socket) {
    return <div className="loading">Connecting...</div>;
  }

  if (currentClassroom && !showNameInput) {
    return (
      <ClassroomView
        socket={socket}
        classroomId={currentClassroom}
        userName={userName}
        onLeave={handleLeaveClassroom}
      />
    );
  }

  return (
    <ClassroomList
      socket={socket}
      onJoin={handleJoinClassroom}
      showNameInput={showNameInput}
    />
  );
}

export default App;
