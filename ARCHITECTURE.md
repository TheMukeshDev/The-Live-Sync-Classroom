# 🏗️ Architecture & System Design

Visual and detailed explanation of the Live Sync Classroom architecture.

---

## 🔌 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / NETWORK                       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
        ┌───────────▼───────────┐  ┌─────▼──────────────┐
        │   CLIENT / BROWSER    │  │   CLIENT / BROWSER │
        │   (User A)            │  │   (User B)         │
        │                       │  │                    │
        │  ┌─────────────────┐  │  │ ┌────────────────┐ │
        │  │   React App     │  │  │ │  React App     │ │
        │  │  Components     │  │  │ │  Components    │ │
        │  │  State/Hooks    │  │  │ │  State/Hooks   │ │
        │  └────────┬────────┘  │  │ └────────┬───────┘ │
        │           │           │  │          │         │
        │  ┌────────▼────────┐  │  │ ┌────────▼───────┐ │
        │  │ Socket.io-      │  │  │ │ Socket.io-     │ │
        │  │ client          │  │  │ │ client         │ │
        │  │ (WebSocket)     │  │  │ │ (WebSocket)    │ │
        │  └────────┬────────┘  │  │ └────────┬───────┘ │
        └───────────┼───────────┘  └──────────┼─────────┘
                    │                         │
                    │    WebSocket Connections
                    │    (Persistent, Bidirectional)
                    │    
                    ├─────────────┬───────────┤
                    │             │           │
        ┌───────────▼─────────────▼───────────▼──────────┐
        │          NODE.JS EXPRESS SERVER                │
        │          (Backend)                             │
        │                                                 │
        │  ┌────────────────────────────────────────┐   │
        │  │  Socket.io Server                      │   │
        │  │                                        │   │
        │  │  Event Handlers:                       │   │
        │  │  - join-classroom                      │   │
        │  │  - add-note                            │   │
        │  │  - update-note                         │   │
        │  │  - delete-note                         │   │
        │  │  - create-poll                         │   │
        │  │  - vote-poll                           │   │
        │  │  - delete-poll                         │   │
        │  └────────────────────────────────────────┘   │
        │                    ▲                           │
        │                    │                           │
        │  ┌─────────────────┴────────────────────┐    │
        │  │   In-Memory Data Store               │    │
        │  │                                      │    │
        │  │  classrooms {                        │    │
        │  │    id: Classroom {                   │    │
        │  │      notes: Map<id, Note>            │    │
        │  │      polls: Map<id, Poll>            │    │
        │  │      users: Map<id, User>            │    │
        │  │    }                                 │    │
        │  │  }                                   │    │
        │  │                                      │    │
        │  │  userSessions {                      │    │
        │  │    socketId: {classroomId, userName} │    │
        │  │  }                                   │    │
        │  └──────────────────────────────────────┘    │
        │                                                 │
        │  ┌────────────────────────────────────────┐   │
        │  │  REST API Endpoints                    │   │
        │  │  - GET /api/classrooms                 │   │
        │  │  - POST /api/classrooms                │   │
        │  │  - GET /api/classrooms/:id             │   │
        │  └────────────────────────────────────────┘   │
        └──────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Creating a Sticky Note

```
USER INPUT (Browser)
        │
        ▼
   ┌─────────────────┐
   │ Add Note Event  │
   │ - content       │
   │ - color         │
   │ - x, y position │
   └────────┬────────┘
            │
            ▼ (WebSocket)
   ┌─────────────────────────────────┐
   │ Server Receives emit event      │
   │ 'add-note'                      │
   └────────┬────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────┐
   │ Validate & Create Note Object   │
   │ - Assign ID (UUID)              │
   │ - Assign userId, userName       │
   │ - Add timestamps                │
   └────────┬────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────┐
   │ Store in Classroom.notes Map    │
   │ notes.set(noteId, note)         │
   └────────┬────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────┐
   │ Broadcast to All Users in Classroom     │
   │ io.to(`classroom-${id}`).emit(...)      │
   │ ('note-added', noteData)                │
   └────┬───────────────┬──────────────┬─────┘
        │               │              │
        ▼               ▼              ▼ (WebSocket)
    CLIENT A        CLIENT B        CLIENT C
        │               │              │
        ▼               ▼              ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │Receive  │   │Receive  │   │Receive  │
   │event    │   │event    │   │event    │
   └────┬────┘   └────┬────┘   └────┬────┘
        │             │             │
        ▼             ▼             ▼
   ┌──────────────────────────────────────┐
   │ Update React State                   │
   │ setNotes(prev => [...prev, note])    │
   └────┬─────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────┐
   │ React Re-renders UI                  │
   │ Component uses new state             │
   └────┬─────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────┐
   │ Browser Displays Updated Board       │
   │ New Note Appears!                    │
   └──────────────────────────────────────┘
```

### Voting on a Poll

```
USER CLICKS OPTION
        │
        ▼
   ┌──────────────────────┐
   │ Vote Poll Event      │
   │ - pollId             │
   │ - optionId (index)   │
   └────────┬─────────────┘
            │
            ▼ (WebSocket)
   ┌──────────────────────────────────────┐
   │ Server Receives 'vote-poll' event    │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │ Find Poll in Classroom.polls         │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │ Record Vote                          │
   │ poll.responses[userId] = optionId    │
   │ poll.updatedAt = now                 │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────┐
   │ Broadcast Updated Poll                   │
   │ io.to(`classroom-${id}`).emit(...)       │
   │ ('poll-updated', pollData)               │
   └────┬───────────────┬──────────────┬──────┘
        │               │              │
        ▼               ▼              ▼ (WebSocket)
    All Clients Receive Updated Poll
        │
        ▼
   ┌────────────────────────────────────────┐
   │ All Clients Update State               │
   │ Recalculate vote counts & percentages  │
   └────────┬───────────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────────┐
   │ UI Updates in Real-Time                │
   │ - Vote counts change                   │
   │ - Progress bars update                 │
   │ - Percentages recalculate              │
   └────────────────────────────────────────┘
```

---

## 🔄 State Management

### Client State (React)

```javascript
// ClassroomView.jsx
const [notes, setNotes] = useState([]);        // All notes in classroom
const [polls, setPolls] = useState([]);        // All polls in classroom
const [users, setUsers] = useState([]);        // All users in classroom

// Updates from WebSocket events:
socket.on('note-added', (note) => {
  setNotes(prev => [...prev, note]);           // Add note
});

socket.on('note-updated', (updatedNote) => {
  setNotes(prev => 
    prev.map(n => n.id === updatedNote.id ? updatedNote : n)
  );
});

socket.on('note-deleted', (data) => {
  setNotes(prev => prev.filter(n => n.id !== data.noteId));
});
```

### Server State (In-Memory)

```javascript
// In-memory data structures
const classrooms = new Map();          // All classrooms
const userSessions = new Map();        // Active user connections

// Classroom structure
{
  id: 'uuid-123',
  name: 'Biology 101',
  notes: Map {
    'note-id-1': {
      id: 'note-id-1',
      content: 'Photosynthesis...',
      color: '#FFD700',
      x: 100, y: 200,
      userId: 'socket-123',
      userName: 'Alice',
      createdAt: 1234567890,
      updatedAt: 1234567890
    },
    // ... more notes
  },
  polls: Map { ... },
  users: Map { ... }
}
```

---

## 🌐 WebSocket Event Flow

### Emit → Server → Broadcast Pattern

```
CLIENT BROWSER              SERVER                  OTHER CLIENTS
     │                        │                          │
     │─ socket.emit ────────→│                          │
     │   'event-name'         │                          │
     │   {data}               │                          │
     │                        │─ Process ─┐             │
     │                        │           │             │
     │                        │ Validate  │             │
     │                        │ Update    │             │
     │                        │ Storage   │             │
     │                        │           │             │
     │                        │ Broadcast ┤──→ socket.on ─→│
     │                        │   io.to() │    'event'     │
     │                        │           │    {newData}   │
     │◄─ socket.on ──────────┼───────────┘               │
     │   'event'              │                    Update │
     │   {newData}            │                    State  │
     │                        │                      │   │
     │                        │                    Render│
     │   Update State         │                      │   │
     │   Rerender            │                    ◄──┘   │
     │   Display Changes      │         Display Changes  │
     │         │              │                │         │
     ▼         ▼              ▼                ▼         ▼
```

---

## 🎯 Component Hierarchy

```
App
├── [CLIENT STATE]
│   ├── socket (WebSocket connection)
│   ├── currentClassroom
│   ├── userName
│
├── ROUTE: ClassroomList
│   ├── [LOCAL STATE]
│   │   ├── classrooms
│   │   ├── newClassroomName
│   │   └── userName
│   │
│   └── ACTIONS
│       ├── fetchClassrooms() → REST API
│       ├── handleCreateClassroom() → REST API
│       └── handleJoinClassroom() → emit 'join-classroom'
│
└── ROUTE: ClassroomView
    ├── [LOCAL STATE]
    │   ├── notes
    │   ├── polls
    │   ├── users
    │   └── activeTab
    │
    ├── Sidebar
    │   └── UserList
    │       └── Shows active users
    │
    └── Main Content
        ├── Tabs (Notes/Polls)
        │
        ├── TAB: Notes
        │   ├── StickyNoteBoard
        │   │   ├── Note Creation Form
        │   │   │   ├── Textarea (content)
        │   │   │   ├── Color Picker
        │   │   │   └── Add Button
        │   │   │
        │   │   └── Notes Container
        │   │       └── [MULTIPLE] StickyNote
        │   │           ├── Content Display
        │   │           ├── Edit Button
        │   │           ├── Delete Button
        │   │           └── Drag Handler
        │   │
        │   └── WEBSOCKET EVENTS
        │       ├── emit: 'add-note'
        │       ├── emit: 'update-note'
        │       ├── emit: 'delete-note'
        │       ├── listen: 'note-added'
        │       ├── listen: 'note-updated'
        │       └── listen: 'note-deleted'
        │
        └── TAB: Polls
            ├── PollManager
            │   ├── Poll Creation Form
            │   │   ├── Question Input
            │   │   ├── Options List
            │   │   ├── Add Option Button
            │   │   └── Create Poll Button
            │   │
            │   └── Polls Container
            │       └── [MULTIPLE] Poll
            │           ├── Question Display
            │           ├── Options (Votable)
            │           ├── Vote Counts
            │           ├── Progress Bars
            │           └── Delete Button
            │
            └── WEBSOCKET EVENTS
                ├── emit: 'create-poll'
                ├── emit: 'vote-poll'
                ├── emit: 'delete-poll'
                ├── listen: 'poll-created'
                ├── listen: 'poll-updated'
                └── listen: 'poll-deleted'
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│   CURRENT IMPLEMENTATION (Minimal)       │
└─────────────────────────────────────────┘
        │
        ├─ No Authentication Required
        ├─ No HTTPS/SSL
        ├─ No Input Validation
        ├─ No Rate Limiting
        └─ In-Memory Storage (No Persistence)

┌─────────────────────────────────────────┐
│   RECOMMENDED FOR PRODUCTION             │
└─────────────────────────────────────────┘
        │
        ├─ JWT Authentication
        ├─ HTTPS/SSL Encryption
        ├─ Input Validation & Sanitization
        ├─ Rate Limiting
        ├─ Database Persistence
        ├─ CORS Configuration
        ├─ Helmet.js (Security Headers)
        └─ Role-Based Access Control
```

---

## 📈 Scaling Architecture

### Current (Single Server)

```
All Browsers ──WebSocket──> Single Node.js Server
                            ├─ Memory (Classrooms)
                            └─ Runs on :3001
```

### Recommended (Multi-Server)

```
Browsers ──HTTP──> Load Balancer ──→ Multiple Node.js Servers
                        │                   ├─ Server 1
                        │                   ├─ Server 2
                        └────────────────→  └─ Server 3
                                                 ↓
                                        ┌─────────────────┐
                                        │  Redis Adapter  │
                                        │  (Socket.io)    │
                                        └─────────────────┘
                                                 ↓
                                        ┌─────────────────┐
                                        │   Database      │
                                        │   PostgreSQL    │
                                        │   or MongoDB    │
                                        └─────────────────┘
```

---

## 🔌 API Endpoints

```
REST API (HTTP)
└── http://localhost:3001/api

    ├── GET /classrooms
    │   Returns: [{id, name, userCount, noteCount, pollCount}]
    │   Uses: For ClassroomList display
    │
    ├── POST /classrooms
    │   Input: {name}
    │   Returns: {id, name}
    │   Uses: Creating new classroom
    │
    └── GET /classrooms/:id
        Returns: {id, name, notes[], polls[], users[]}
        Uses: Full classroom state retrieval

WebSocket Events (Socket.io)
└── ws://localhost:3001/socket.io

    ├── CLIENT → SERVER
    │   ├── join-classroom {classroomId, userName}
    │   ├── add-note {content, color, x, y}
    │   ├── update-note {noteId, content, x, y, color}
    │   ├── delete-note {noteId}
    │   ├── create-poll {question, options}
    │   ├── vote-poll {pollId, optionId}
    │   └── delete-poll {pollId}
    │
    └── SERVER → CLIENT
        ├── classroom-state {notes, polls, users}
        ├── note-added {note}
        ├── note-updated {note}
        ├── note-deleted {noteId}
        ├── poll-created {poll}
        ├── poll-updated {poll}
        ├── poll-deleted {pollId}
        ├── user-joined {userId, userName, color, userCount}
        └── user-left {userId, userName, userCount}
```

---

## 📊 Deployment Architecture Options

### Option 1: Single Server (Development)

```
Browser
  │
  ├─HTTP─→ Frontend (Static Files)
  │
  └─WebSocket─→ Backend (Node.js + Express + Socket.io)
```

### Option 2: Separate Frontend & Backend (Production)

```
Browser → CDN (Frontend Static)
       ↓
       WebSocket
       ↓
Backend Server (Node.js)
       ↓
Database
```

### Option 3: Containerized (Docker)

```
Docker Container
├─ Node.js
├─ Express
├─ Socket.io
└─ Node Modules
    ↓
Docker Network
    ↓
Database Container / External DB
```

---

## 🧪 Testing Architecture

```
Unit Tests
├── React Components
│   ├── ClassroomList.test.js
│   ├── StickyNote.test.js
│   └── Poll.test.js
│
└── Server Functions
    ├── Classroom.test.js
    └── Note.test.js

Integration Tests
├── WebSocket Events
│   ├── Note Creation Flow
│   ├── Poll Voting Flow
│   └── User Join/Leave
│
└── API Endpoints
    ├── GET /classrooms
    ├── POST /classrooms
    └── GET /classrooms/:id

E2E Tests
├── Multi-User Scenarios
├── Real-Time Sync
└── Error Handling
```

---

**Architecture Version:** 1.0.0  
**Last Updated:** January 2026

*For questions, see the main [README.md](README.md) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)*
