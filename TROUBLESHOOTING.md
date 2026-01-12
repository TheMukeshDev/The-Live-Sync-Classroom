# 🔧 Troubleshooting Guide

Having issues? This guide covers common problems and solutions.

## Installation Issues

### Issue: "npm command not found"

**Solution:**
1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Choose LTS (Long Term Support) version
3. Verify installation:
```bash
node --version
npm --version
```

### Issue: "Port 3001 already in use"

**Windows PowerShell:**
```powershell
# Find process on port 3001
Get-NetTCPConnection -LocalPort 3001

# Kill the process (replace PID)
Stop-Process -Id <PID> -Force
```

**Mac/Linux:**
```bash
# Find process on port 3001
lsof -i :3001

# Kill the process (replace PID)
kill -9 <PID>
```

### Issue: "Port 5173 already in use"

Same as above but use port 5173:
```powershell
# Windows
Get-NetTCPConnection -LocalPort 5173
Stop-Process -Id <PID> -Force

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Issue: "npm install fails"

Try these steps:
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and lock files
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install
```

---

## Runtime Issues

### Issue: "Cannot find module 'socket.io'"

**Solution:**
```bash
# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Issue: "Server won't start"

**Check:**
1. Port 3001 is available
2. Node.js is properly installed
3. All dependencies installed

**Try:**
```bash
# From root directory
node --version  # Should show v14+

# Try starting server directly
node server/index.js
```

### Issue: "WebSocket connection refused"

**Causes:**
- Server not running
- Wrong URL in client
- Firewall blocking

**Solution:**
1. Verify server is running: `npm run dev:server`
2. Check frontend is connecting to `http://localhost:3001`
3. Check firewall/antivirus isn't blocking

### Issue: "CORS error"

**If seeing:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify server CORS is configured
2. Check client URL matches allowed origins
3. Restart both server and client

---

## Browser Issues

### Issue: "Page not loading"

**Try:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try different browser
4. Check console for errors (F12)

### Issue: "WebSocket not connecting"

**Check browser console (F12):**
1. Look for connection errors
2. Verify server is running
3. Check network tab for WebSocket upgrade

### Issue: "Sticky notes not dragging"

**Try:**
1. Clear browser cache
2. Disable browser extensions
3. Try different browser
4. Check if JavaScript is enabled

---

## Functionality Issues

### Issue: "Notes not appearing for other users"

**Troubleshooting:**
1. Check both users are in same classroom
2. Verify WebSocket connection is active (browser DevTools)
3. Check browser console for errors
4. Restart both clients

### Issue: "Polls not updating in real-time"

**Solution:**
1. Check server is receiving votes (server console)
2. Verify broadcast is working
3. Restart server: `npm run dev:server`
4. Clear client browser cache

### Issue: "Users not showing in list"

**Check:**
1. Users are joined to same classroom
2. Socket connection is active
3. Check browser DevTools Network tab

---

## Development Issues

### Issue: "Hot reload not working"

**Solution:**
1. Restart Vite dev server: Stop and `npm run dev:client`
2. Check if file was actually saved
3. Try full page refresh (F5)

### Issue: "React components not updating"

**Check:**
1. Using correct hook (useState, useEffect)
2. Dependencies array is correct (useEffect)
3. Not mutating state directly
4. Key prop set for list items

### Issue: "Socket events not firing"

**Debug:**
```javascript
// Add logging
socket.on('connect', () => console.log('Connected!'));
socket.on('note-added', (data) => console.log('Note:', data));
```

### Issue: "Memory leaks in development"

**Solution:**
1. Clean up listeners in useEffect cleanup
2. Close connections properly
3. Stop Node process between restarts

---

## Performance Issues

### Issue: "App running slowly"

**Try:**
1. Close unnecessary browser tabs
2. Reduce number of sticky notes
3. Check browser DevTools Performance tab
4. Restart dev servers

### Issue: "Dragging notes is laggy"

**Solution:**
1. Reduce browser tabs/extensions
2. Ensure server is running locally (low latency)
3. Try different browser
4. Check CPU usage

---

## Data Issues

### Issue: "Lost notes/polls after server restart"

**Expected behavior:** In-memory data is not persistent

**Solution:**
- Add database persistence (See DEPLOYMENT.md)
- Don't rely on data staying after restart
- Export data if needed

### Issue: "Notes appearing in wrong classroom"

**Cause:** Server/client state mismatch

**Solution:**
1. Leave and rejoin classroom
2. Restart both server and client
3. Clear browser cache

---

## Connection Issues

### Issue: "Frequent disconnections"

**Check:**
1. Internet connection stability
2. Server uptime
3. Browser console for error messages

**Try:**
1. Restart WiFi router
2. Use wired connection if possible
3. Check firewall settings

### Issue: "Timeout errors"

**Increase timeout:**
In `server/index.js`:
```javascript
const io = new Server(server, {
  pingInterval: 25000,
  pingTimeout: 60000,  // Increase this
  cors: { origin: 'http://localhost:5173' }
});
```

---

## OS-Specific Issues

### Windows

**Issue:** "npm command not recognized"

**Solution:**
1. Restart terminal/PowerShell
2. Add Node to PATH manually if needed
3. Use Git Bash instead

### Mac

**Issue:** "Permission denied" errors

**Solution:**
```bash
# Use sudo for global installs
sudo npm install -g package-name
```

### Linux

**Issue:** "Port permission denied"

**Solution:**
```bash
# For ports < 1024, use sudo
sudo npm run dev
```

---

## Git Issues

### Issue: "Cannot push to repository"

**Solution:**
1. Check git is installed: `git --version`
2. Configure git:
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### Issue: "Merge conflicts"

**Try:**
1. Learn about git merge resolution
2. Use GUI tool like GitHub Desktop
3. Ask for help from team

---

## Advanced Debugging

### Enable Debug Mode

**Server:**
```javascript
// Add to server/index.js
const debug = require('debug')('app');
debug('Starting server...');
```

**Client (React):**
```javascript
// Enable React DevTools browser extension
// Check console warnings and errors
```

### Check Network Traffic

**In Browser DevTools:**
1. Open Network tab (F12)
2. Filter by "WS" to see WebSocket
3. Check request/response headers

### Monitor Server

**Windows PowerShell:**
```powershell
# Check Node process
Get-Process node

# Monitor CPU/Memory
Get-Process node | Select-Object ProcessName,CPU,Memory
```

---

## Getting Help

If you're still stuck:

1. **Check Logs**
   - Browser console (F12)
   - Server terminal output
   - Network tab in DevTools

2. **Search Existing Issues**
   - GitHub Issues
   - Stack Overflow
   - Socket.io documentation

3. **Ask for Help**
   - Create an issue with:
     - Error message
     - Steps to reproduce
     - OS and browser version
     - Screenshots

4. **Common Resources**
   - [Node.js Docs](https://nodejs.org/docs)
   - [Express Docs](https://expressjs.com)
   - [Socket.io Docs](https://socket.io/docs)
   - [React Docs](https://react.dev)

---

## Quick Checklist

If things aren't working:

- [ ] Node.js v14+ installed
- [ ] All npm packages installed
- [ ] Ports 3001 and 5173 are free
- [ ] Server is running
- [ ] Client is running
- [ ] No errors in browser console (F12)
- [ ] WebSocket showing in Network tab
- [ ] Multiple users in same classroom
- [ ] Browser cache cleared
- [ ] Firewall not blocking

---

## Still Need Help?

1. Check [README.md](README.md) for documentation
2. Review [QUICKSTART.md](QUICKSTART.md) for setup
3. See [FEATURES.md](FEATURES.md) for feature details
4. Check [CONTRIBUTE.md](CONTRIBUTE.md) for development

---

**Version:** 1.0.0
**Last Updated:** January 2026

*Remember: Most issues are solved by restarting! 🔄*
