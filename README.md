# 🎓 Live Sync Classroom

A real-time collaborative tool for instant updates across multiple users without refreshing. Features a shared digital sticky notes wall and live classroom polls powered by WebSockets.

## ✨ Features

- **🎯 Real-Time Synchronization** - Instant updates across all connected users using WebSockets (Socket.io)
- **📌 Sticky Notes Wall** - Collaborative digital notes that users can create, edit, drag, and delete
- **🗳️ Live Polls** - Create instant polls with multiple options and real-time vote counting
- **👥 User Presence** - See who's currently in the classroom with live user list
- **🎨 Beautiful UI** - Modern, responsive design with smooth animations
- **📡 WebSocket Communication** - Efficient real-time messaging between server and clients

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: React + CSS3
- **Communication**: WebSocket (Socket.io)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install
cd ..

# Install client dependencies
cd client && npm install
cd ..
```

### 2. Start the Application

**Option 1: Run both server and client together**
```bash
npm run dev
```

**Option 2: Run server and client separately**

Terminal 1 - Start the server:
```bash
npm run dev:server
```

Terminal 2 - Start the client:
```bash
npm run dev:client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📚 How to Use

### Creating a Classroom
1. Start the application
2. Enter your name in the input field
3. Click "Create" to create a new classroom or select an existing one
4. Click "Join Classroom" to enter

### Using Sticky Notes
1. Once in a classroom, navigate to the "📌 Sticky Notes" tab
2. Type your note content in the textarea
3. Choose a color from the color palette
4. Click "Add Note" to create the note
5. **Drag notes** around the board to reposition them
6. **Edit notes** by clicking the ✏️ button
7. **Delete notes** by clicking the 🗑️ button
- All changes sync in real-time to other users!

### Using Live Polls
1. Navigate to the "🗳️ Live Polls" tab
2. Enter your poll question
3. Add poll options (minimum 2 required)
4. Click "Create Poll"
5. Users can click options to vote
6. Vote counts update in real-time
7. Delete polls using the trash icon

## 🏗️ Project Structure

```
The-Live-Sync-Classroom/
├── server/
│   └── index.js                 # Express + Socket.io server
├── client/
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── package.json            # Client dependencies
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Main app component
│       ├── index.css           # Global styles
│       ├── components/
│       │   ├── ClassroomList.jsx    # Classroom selection
│       │   ├── ClassroomView.jsx    # Main classroom view
│       │   ├── StickyNoteBoard.jsx  # Notes board
│       │   ├── StickyNote.jsx       # Individual note
│       │   ├── PollManager.jsx      # Poll creation & display
│       │   ├── Poll.jsx             # Individual poll
│       │   └── UserList.jsx         # Active users display
│       └── styles/             # Component styles
├── package.json                # Root dependencies
└── README.md                   # This file
```

## 🔌 WebSocket Events

### Client → Server
- `join-classroom` - Join a specific classroom
- `add-note` - Create a new sticky note
- `update-note` - Modify a sticky note position or content
- `delete-note` - Remove a sticky note
- `create-poll` - Create a new poll
- `vote-poll` - Submit a vote for a poll option
- `delete-poll` - Remove a poll

### Server → Client
- `classroom-state` - Initial state when joining
- `note-added` - New note created
- `note-updated` - Note modified
- `note-deleted` - Note removed
- `poll-created` - New poll created
- `poll-updated` - Poll vote count updated
- `poll-deleted` - Poll removed
- `user-joined` - User joined classroom
- `user-left` - User left classroom

## 🎯 Features in Detail

### Real-Time Collaboration
- Multiple users can join the same classroom
- All changes (notes, polls, votes) sync instantly
- Drag-and-drop sticky notes with live position sync
- User presence indicators with custom colors

### Sticky Notes
- Create notes with custom colors
- Drag notes to organize on the board
- Edit note content in-place
- Delete notes with confirmation
- Timestamp tracking for each note

### Live Polling
- Create polls with unlimited options
- Real-time vote counting
- Visual progress bars for vote distribution
- Prevent duplicate voting by the same user

## 🔧 API Endpoints

### GET /api/classrooms
Get list of all classrooms

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Biology 101",
    "userCount": 5,
    "noteCount": 12,
    "pollCount": 2
  }
]
```

### POST /api/classrooms
Create a new classroom

**Request:**
```json
{
  "name": "Physics 201"
}
```

### GET /api/classrooms/:id
Get specific classroom with all notes and polls

## 🚀 Building for Production

```bash
# Build the client
npm run build

# Start the server (production)
npm start
```

## 📝 Future Enhancements

- [ ] Database persistence (MongoDB, PostgreSQL)
- [ ] User authentication & authorization
- [ ] Classroom access control (passwords, invites)
- [ ] Rich text editor for notes
- [ ] Image/attachment support
- [ ] Chat functionality
- [ ] Recording & playback of classroom sessions
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Email notifications

## 🐛 Known Issues

- Notes may overlap when created simultaneously
- No persistence between server restarts (in-memory only)
- Limited to single server (no clustering support yet)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for real-time collaboration in education**
