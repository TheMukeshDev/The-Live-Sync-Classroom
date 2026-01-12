import React from 'react';
import '../styles/UserList.css';

function UserList({ users, currentUser }) {
  return (
    <div className="user-list">
      <h3>👥 Active Users ({users.length})</h3>
      <div className="users">
        {users.map((user) => (
          <div key={user.userId} className="user-item">
            <div
              className="user-avatar"
              style={{ backgroundColor: user.color }}
              title={user.userName}
            >
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">
              {user.userName}
              {user.userName === currentUser && (
                <span className="current-badge">(You)</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
