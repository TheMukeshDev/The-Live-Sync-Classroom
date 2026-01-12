import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
const classrooms = new Map();
const userSessions = new Map();

// Data structures
class Classroom {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.notes = new Map();
        this.polls = new Map();
        this.users = new Map();
    }

    addNote(note) {
        this.notes.set(note.id, note);
        return note;
    }

    updateNote(noteId, updates) {
        const note = this.notes.get(noteId);
        if (note) {
            Object.assign(note, updates, { updatedAt: Date.now() });
            return note;
        }
        return null;
    }

    deleteNote(noteId) {
        return this.notes.delete(noteId);
    }

    createPoll(poll) {
        this.polls.set(poll.id, poll);
        return poll;
    }

    addPollResponse(pollId, userId, optionId) {
        const poll = this.polls.get(pollId);
        if (poll) {
            poll.responses[userId] = optionId;
            poll.updatedAt = Date.now();
            return poll;
        }
        return null;
    }

    deletePoll(pollId) {
        return this.polls.delete(pollId);
    }

    addUser(userId, userName, color) {
        const user = { userId, userName, color, joinedAt: Date.now() };
        this.users.set(userId, user);
        return user;
    }

    removeUser(userId) {
        return this.users.delete(userId);
    }
}

// REST API endpoints
app.get('/api/classrooms', (req, res) => {
    const classroomList = Array.from(classrooms.values()).map((cls) => ({
        id: cls.id,
        name: cls.name,
        userCount: cls.users.size,
        noteCount: cls.notes.size,
        pollCount: cls.polls.size,
    }));
    res.json(classroomList);
});

app.post('/api/classrooms', (req, res) => {
    const { name } = req.body;
    const id = uuidv4();
    const classroom = new Classroom(id, name);
    classrooms.set(id, classroom);
    res.json({ id, name });
});

app.get('/api/classrooms/:id', (req, res) => {
    const classroom = classrooms.get(req.params.id);
    if (!classroom) return res.status(404).json({ error: 'Classroom not found' });

    res.json({
        id: classroom.id,
        name: classroom.name,
        notes: Array.from(classroom.notes.values()),
        polls: Array.from(classroom.polls.values()),
        users: Array.from(classroom.users.values()),
    });
});

// WebSocket event handlers
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join classroom
    socket.on('join-classroom', (data) => {
        const { classroomId, userName } = data;
        const classroom = classrooms.get(classroomId);

        if (!classroom) {
            socket.emit('error', { message: 'Classroom not found' });
            return;
        }

        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        classroom.addUser(socket.id, userName, color);
        userSessions.set(socket.id, { classroomId, userName });

        socket.join(`classroom-${classroomId}`);
        io.to(`classroom-${classroomId}`).emit('user-joined', {
            userId: socket.id,
            userName,
            color,
            userCount: classroom.users.size,
        });

        // Send current state to joined user
        socket.emit('classroom-state', {
            notes: Array.from(classroom.notes.values()),
            polls: Array.from(classroom.polls.values()),
            users: Array.from(classroom.users.values()),
        });
    });

    // Add sticky note
    socket.on('add-note', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        const noteId = uuidv4();
        const note = {
            id: noteId,
            content: data.content,
            color: data.color,
            userId: socket.id,
            userName: session.userName,
            x: data.x,
            y: data.y,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        classroom.addNote(note);
        io.to(`classroom-${session.classroomId}`).emit('note-added', note);
    });

    // Update sticky note
    socket.on('update-note', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        const updatedNote = classroom.updateNote(data.noteId, {
            content: data.content,
            x: data.x,
            y: data.y,
            color: data.color,
        });

        if (updatedNote) {
            io.to(`classroom-${session.classroomId}`).emit('note-updated', updatedNote);
        }
    });

    // Delete sticky note
    socket.on('delete-note', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        classroom.deleteNote(data.noteId);
        io.to(`classroom-${session.classroomId}`).emit('note-deleted', { noteId: data.noteId });
    });

    // Create poll
    socket.on('create-poll', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        const pollId = uuidv4();
        const poll = {
            id: pollId,
            question: data.question,
            options: data.options,
            userId: socket.id,
            userName: session.userName,
            responses: {},
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        classroom.createPoll(poll);
        io.to(`classroom-${session.classroomId}`).emit('poll-created', poll);
    });

    // Vote on poll
    socket.on('vote-poll', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        const updatedPoll = classroom.addPollResponse(data.pollId, socket.id, data.optionId);

        if (updatedPoll) {
            io.to(`classroom-${session.classroomId}`).emit('poll-updated', updatedPoll);
        }
    });

    // Delete poll
    socket.on('delete-poll', (data) => {
        const session = userSessions.get(socket.id);
        if (!session) return;

        const classroom = classrooms.get(session.classroomId);
        classroom.deletePoll(data.pollId);
        io.to(`classroom-${session.classroomId}`).emit('poll-deleted', { pollId: data.pollId });
    });

    // Disconnect
    socket.on('disconnect', () => {
        const session = userSessions.get(socket.id);
        if (session) {
            const classroom = classrooms.get(session.classroomId);
            if (classroom) {
                classroom.removeUser(socket.id);
                io.to(`classroom-${session.classroomId}`).emit('user-left', {
                    userId: socket.id,
                    userName: session.userName,
                    userCount: classroom.users.size,
                });
            }
            userSessions.delete(socket.id);
        }
        console.log(`User disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket server ready for connections`);
});
