# 📖 Features & Documentation

## 🎯 Core Features

### 1. Real-Time Synchronization 📡

**How it works:**
- All user actions are transmitted instantly via WebSocket (Socket.io)
- Updates reach all connected clients in milliseconds
- No page refresh needed - everything happens live

**Benefits:**
- Seamless collaboration
- Instant feedback
- True real-time experience

---

## 2. Sticky Notes 📌

### Creating Notes

```
Input → Color Selection → Add Note
```

**Steps:**
1. Type your note content in the textarea (max 255 characters)
2. Select a color from the palette (8 color options)
3. Click "Add Note" or press Ctrl+Enter
4. Note appears randomly on the board

**Note Features:**
- **Drag & Drop**: Click and drag notes to reposition
- **Edit**: Click ✏️ button to edit content
- **Delete**: Click 🗑️ button to remove (confirmation required)
- **Timestamps**: Shows when note was last updated
- **Author Tag**: Shows who created each note

### Note Colors

| Color | Hex Code | Use Case |
|-------|----------|----------|
| Gold | #FFD700 | Important/Urgent |
| Red | #FF6B6B | Errors/Issues |
| Teal | #4ECDC4 | Ideas |
| Mint | #95E1D3 | Tasks |
| Yellow | #F7DC6F | Reminders |
| Purple | #BB8FCE | Questions |
| Blue | #85C1E2 | Information |
| Orange | #F8B88B | Action Items |

### Real-Time Updates

When any user updates a note:
- Position changes sync to all users
- Content edits appear instantly
- Deletions remove from all boards

---

## 3. Live Polls 🗳️

### Creating Polls

```
Question → Add Options → Create Poll
```

**Steps:**
1. Enter your poll question
2. Add at least 2 options
3. Click "Create Poll"
4. Poll appears in the polls section

### Voting

**How voting works:**
- Click any option to vote
- Your vote is recorded instantly
- Vote counts update in real-time
- Progress bar shows percentage
- One vote per user per poll

**Vote Display:**
```
Option Name
[████████░░] 80% (8 votes)
✓ You voted
```

### Poll Management

- **View Results**: See live vote counts and percentages
- **Delete**: Creator can delete polls
- **Real-Time Updates**: Votes sync instantly to all users

---

## 4. User Management 👥

### User Presence

**Sidebar shows:**
- Total active users in classroom
- User names with color avatars
- "(You)" badge for current user

**User Avatars:**
- First letter of user name
- Unique color per user
- Updates when users join/leave

### Join/Leave

**Joining:**
1. Enter your name
2. Select classroom
3. Click "Join Classroom"
4. Your user appears for all connected users

**Leaving:**
1. Click "Leave Classroom"
2. You're removed from active users
3. All your notes/votes remain

---

## 5. Classroom Management 🏫

### Creating Classrooms

**Classroom Creation:**
1. Enter classroom name
2. Click "Create" button
3. New classroom appears in list

**Classroom Display:**
- Shows total users
- Shows total sticky notes
- Shows total polls
- One-click join button

### Multiple Classrooms

- Each classroom is independent
- Users can join different classrooms
- Each classroom maintains its own notes and polls
- Leave one classroom to join another

---

## 🔧 Technical Details

### WebSocket Events

#### Client Emits
```javascript
// Join classroom
socket.emit('join-classroom', { classroomId, userName })

// Sticky notes
socket.emit('add-note', { content, color, x, y })
socket.emit('update-note', { noteId, content, x, y, color })
socket.emit('delete-note', { noteId })

// Polls
socket.emit('create-poll', { question, options })
socket.emit('vote-poll', { pollId, optionId })
socket.emit('delete-poll', { pollId })
```

#### Server Broadcasts
```javascript
// User events
socket.to(`classroom-${id}`).emit('user-joined', userData)
socket.to(`classroom-${id}`).emit('user-left', userData)

// Note events
socket.to(`classroom-${id}`).emit('note-added', noteData)
socket.to(`classroom-${id}`).emit('note-updated', noteData)
socket.to(`classroom-${id}`).emit('note-deleted', { noteId })

// Poll events
socket.to(`classroom-${id}`).emit('poll-created', pollData)
socket.to(`classroom-${id}`).emit('poll-updated', pollData)
socket.to(`classroom-${id}`).emit('poll-deleted', { pollId })

// Initial state
socket.emit('classroom-state', { notes, polls, users })
```

### Data Structures

**Note Object:**
```javascript
{
  id: "uuid",
  content: "Note text",
  color: "#FFD700",
  x: 100,              // pixel position
  y: 200,              // pixel position
  userId: "socket-id",
  userName: "John",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

**Poll Object:**
```javascript
{
  id: "uuid",
  question: "What's your favorite?",
  options: ["Option 1", "Option 2", "Option 3"],
  userId: "socket-id",
  userName: "Jane",
  responses: {
    "user-id-1": 0,    // voted for option index 0
    "user-id-2": 1     // voted for option index 1
  },
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

**User Object:**
```javascript
{
  userId: "socket-id",
  userName: "Alex",
  color: "hsl(45, 70%, 60%)",
  joinedAt: 1234567890
}
```

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Touch-friendly buttons

### Visual Feedback
- Hover effects on buttons
- Active state indicators
- Loading states
- Smooth animations

### Accessibility
- Clear labels and instructions
- Keyboard shortcuts (Ctrl+Enter to add note)
- Color indicators for user identity
- Readable font sizes

---

## ⚡ Performance Optimizations

### Frontend
- Efficient state management with React hooks
- Minimal re-renders
- CSS animations instead of JavaScript
- Lazy loading for components

### Backend
- In-memory data structure for speed
- Efficient socket.io broadcasts
- Connection pooling
- Event batching where applicable

---

## 🔐 Data Handling

### What's Stored (Session Only)
- Sticky notes content
- Poll questions and responses
- User names and connection info

### What's NOT Stored
- User credentials (no authentication yet)
- Permanent data (lost on server restart)

### Privacy
- No data persistence between sessions
- All data is classroom-specific
- No user tracking or analytics

---

## 🐛 Known Limitations

1. **No Persistence**: Data lost when server restarts
2. **No Authentication**: Anyone can join any classroom
3. **Single Server**: No scaling/clustering support
4. **In-Memory**: Not suitable for very large datasets
5. **No Access Control**: No password protection on classrooms

---

## 🚀 Future Features

### Planned Enhancements

**Short Term:**
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Classroom passwords
- [ ] Export notes to PDF

**Medium Term:**
- [ ] Rich text editor for notes
- [ ] Image uploads
- [ ] Chat functionality
- [ ] Archive classrooms
- [ ] User roles (teacher/student)

**Long Term:**
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Presentation mode
- [ ] Recorded sessions
- [ ] Analytics dashboard

---

## 💡 Usage Tips

### For Teachers
1. Create classroom at start of lesson
2. Use polls to assess understanding
3. Use sticky notes for collaborative brainstorming
4. Monitor active users in sidebar

### For Students
1. Add questions as sticky notes
2. Participate in polls
3. Collaborate on group assignments
4. Take notes in real-time

### Best Practices
- Use clear, concise note text
- Color-code notes by topic
- Create meaningful poll questions
- Check user list to see who's active
- Leave classroom when done (to sync data)

---

## 📞 Support

For issues or feature requests, check:
1. [README.md](README.md) - General documentation
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment help
3. [QUICKSTART.md](QUICKSTART.md) - Getting started

---

**Version**: 1.0.0
**Last Updated**: January 2026
**License**: MIT
