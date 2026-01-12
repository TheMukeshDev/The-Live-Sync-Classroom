# ⚡ Quick Start Guide

Get the Live Sync Classroom running in 2 minutes!

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org))
- **npm** (comes with Node.js)

## Installation

### Step 1: Install Dependencies

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Step 2: Start the Application

```bash
npm run dev
```

This starts both the backend server and frontend development server.

## 🎉 You're Done!

Open your browser and go to: **http://localhost:5173**

---

## First Use

1. **Enter your name** - Type your name in the input field
2. **Create a classroom** - Give it a fun name (e.g., "Biology 101")
3. **Join the classroom** - Click the "Join Classroom" button
4. **Start collaborating!**
   - Add sticky notes with different colors
   - Drag notes around the board
   - Create and vote on polls
   - See other users join in real-time

---

## Troubleshooting

### Port Already in Use

If you get an error about ports being in use:

```bash
# Kill process on port 3001 (server)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (client)
lsof -ti:5173 | xargs kill -9
```

### Clear Dependencies & Reinstall

```bash
rm -rf node_modules server/node_modules client/node_modules
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Check Node Version

```bash
node --version  # Should be v14+
npm --version   # Should be v6+
```

---

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the code in `client/src` and `server/`

---

## Tips

- **Multiple Users**: Open another browser tab/window with a different name
- **Real-Time**: Changes sync instantly to all connected users
- **Colors**: Each user gets a unique color for their notes
- **Voting**: Each user can vote once per poll

---

Happy collaborating! 🚀
