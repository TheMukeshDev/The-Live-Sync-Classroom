# 🤝 Contributing Guide

Thank you for your interest in contributing to Live Sync Classroom! This guide will help you get started.

## Getting Started

### Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/The-Live-Sync-Classroom.git
cd The-Live-Sync-Classroom

# Add upstream remote
git remote add upstream https://github.com/original-owner/The-Live-Sync-Classroom.git
```

### Setup Development Environment

```bash
# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start development
npm run dev
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `chore/` - Code cleanup, dependencies
- `refactor/` - Code restructuring

### 2. Make Your Changes

Follow the existing code style:
- Use ES6+ syntax
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### 3. Test Your Changes

```bash
# Test manually
npm run dev

# Test with multiple users
# Open multiple browser tabs/windows
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: description of your feature"
```

**Commit message format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code reorganization
- `test:` - Tests
- `chore:` - Dependencies, build

### 5. Push & Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
```

**PR Description Template:**
```markdown
## Description
Brief description of your changes

## Motivation
Why is this change needed?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed my changes
- [ ] No new warnings generated
- [ ] Added necessary comments
```

---

## Code Style Guide

### JavaScript/React

**Naming:**
```javascript
// Components
function ClassroomList() { }
const UserProfile = () => { }

// Functions
const handleAddNote = () => { }
const fetchClassrooms = async () => { }

// Variables
const isLoading = false;
const userName = 'John';
const MAX_NOTES = 100;
```

**Formatting:**
```javascript
// Use arrow functions
const doSomething = () => { }

// Destructuring
const { userName, userId } = user;

// Template literals
const message = `Hello, ${name}!`;

// Async/await instead of .then()
const data = await fetchData();
```

**Comments:**
```javascript
// Simple explanations
const result = calculateSum(a, b);

// Complex logic needs comments
// Iterate through array and filter items > 10
const filtered = items.filter(item => item > 10);

// TODO for future work
// TODO: Optimize this loop for large datasets
```

### CSS

```css
/* Use meaningful class names */
.sticky-note-board { }
.poll-card { }
.user-avatar { }

/* Group related properties */
.button {
  padding: 10px 20px;
  background: #667eea;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Use CSS variables for colors */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4caf50;
  --danger-color: #ff6b6b;
}

.button {
  background: var(--primary-color);
}
```

---

## Architecture

### Frontend Structure

```
client/src/
├── App.jsx              # Main component
├── components/          # React components
│   ├── ClassroomList.jsx
│   ├── ClassroomView.jsx
│   ├── StickyNoteBoard.jsx
│   ├── StickyNote.jsx
│   ├── PollManager.jsx
│   ├── Poll.jsx
│   └── UserList.jsx
├── styles/              # CSS files
│   ├── ClassroomList.css
│   ├── ClassroomView.css
│   └── ...
└── index.css            # Global styles
```

### Backend Structure

```
server/
└── index.js             # Express + Socket.io server
    ├── Middleware
    ├── Routes
    ├── Classes (Classroom, etc)
    ├── Socket handlers
    └── Error handling
```

---

## Common Patterns

### Socket.io Emit/Listen Pattern

**Server:**
```javascript
// Listen for event
socket.on('add-note', (data) => {
  // Process data
  // Broadcast to others
  io.to(`classroom-${classroomId}`).emit('note-added', note);
});
```

**Client:**
```javascript
// Emit event
socket.emit('add-note', { content, color, x, y });

// Listen for response
socket.on('note-added', (note) => {
  setNotes(prev => [...prev, note]);
});
```

### React State Update Pattern

```javascript
// Adding items
setNotes(prev => [...prev, newNote]);

// Updating items
setNotes(prev => 
  prev.map(note => note.id === id ? updatedNote : note)
);

// Removing items
setNotes(prev => prev.filter(note => note.id !== id));
```

---

## Adding New Features

### Example: Add Tagging to Notes

**1. Update data structure:**
```javascript
// server/index.js
const note = {
  id: noteId,
  content: data.content,
  tags: data.tags || [],  // New field
  // ... other fields
};
```

**2. Update component:**
```javascript
// client/src/components/StickyNote.jsx
function StickyNote({ note, socket }) {
  // Add tag display
  return (
    <div className="sticky-note">
      {note.tags.map(tag => (
        <span key={tag} className="tag">{tag}</span>
      ))}
      {/* ... rest of component */}
    </div>
  );
}
```

**3. Update styles:**
```css
/* client/src/styles/StickyNote.css */
.tag {
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  margin-right: 5px;
}
```

**4. Test:**
```bash
npm run dev
# Test with multiple users
```

---

## Testing

### Manual Testing Checklist

- [ ] Single user flow works
- [ ] Multiple users sync correctly
- [ ] Drag/drop sticky notes
- [ ] Edit notes
- [ ] Create/vote on polls
- [ ] Leave/join classroom
- [ ] WebSocket reconnection
- [ ] Error handling

### Browser Testing

Test on:
- Chrome/Chromium
- Firefox
- Safari
- Edge

### Device Testing

- Desktop
- Tablet
- Mobile (if responsive)

---

## Documentation

### When to Document

- New features
- API changes
- Configuration options
- Non-obvious code

### Where to Document

- **README.md** - Project overview
- **FEATURES.md** - Feature details
- **Code comments** - Complex logic
- **Commit messages** - What & why

---

## Performance Considerations

### Frontend

```javascript
// ✓ Good: Memoize expensive operations
const memoizedValue = useMemo(() => 
  expensiveCalculation(a, b),
  [a, b]
);

// ✗ Avoid: Recreating functions in render
const handleClick = () => { }  // BAD
const handleClick = useCallback(() => { }, [])  // GOOD
```

### Backend

```javascript
// ✓ Good: Broadcast only to relevant clients
io.to(`classroom-${classroomId}`).emit('event', data);

// ✗ Avoid: Broadcasting to everyone
io.emit('event', data);
```

---

## Security Considerations

### Input Validation

```javascript
// Validate on server
if (!data.content || data.content.trim().length === 0) {
  socket.emit('error', { message: 'Invalid content' });
  return;
}

// Sanitize if storing in database
const sanitized = sanitizeHtml(data.content);
```

### Rate Limiting

```javascript
// Prevent spam
const rateLimiter = {};

socket.on('add-note', (data) => {
  const userId = socket.id;
  if (rateLimiter[userId]?.count > 10) {
    socket.emit('error', { message: 'Rate limited' });
    return;
  }
});
```

---

## Need Help?

- **Questions?** Open an issue with `[QUESTION]` tag
- **Bug Report?** Use the bug report template
- **Feature Request?** Describe your use case
- **Documentation?** Let us know what's unclear

---

## License

By contributing, you agree your changes will be licensed under the MIT License.

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

---

**Happy coding! 🚀**

Thank you for making Live Sync Classroom better!
