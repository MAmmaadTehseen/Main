# Testing Socket.IO Real-time Discussion Board

## Quick Test Guide

### Prerequisites
✅ Backend running (`npm run dev` in Backend folder)
✅ Frontend running (`npm run dev` in frontend folder)
✅ MongoDB connected
✅ At least one project with users (advisor or student)

### Test Steps

#### 1. Open Two Browser Windows
- **Window 1**: Open your app in Chrome (or your default browser)
- **Window 2**: Open your app in an Incognito/Private window (or different browser)

#### 2. Login as Different Users
- **Window 1**: Login as User A (e.g., a student)
- **Window 2**: Login as User B (e.g., an advisor or different student)

#### 3. Navigate to Discussion Board
- In both windows, navigate to the Discussion Board page
- Select the **same project** in both windows

#### 4. Test Real-time Messaging
1. In **Window 1**, type a message: `"Hello from User A!"`
2. Click Send or press Enter
3. **Expected Result**: The message should **instantly appear in Window 2** without refreshing! ✨

#### 5. Test Bidirectional Communication
1. In **Window 2**, type a message: `"Hi User A! I can see your message!"`
2. Click Send
3. **Expected Result**: Both messages visible in both windows in real-time

#### 6. Test Project Switching
1. Switch to a different project in **Window 1**
2. Send a message
3. **Expected Result**: Window 2 should NOT see this message (because they're in a different project)

### What to Look For

#### ✅ Success Indicators
- Messages appear **instantly** in other user's window
- No page refresh needed
- Messages are in correct order
- Console shows: `✅ Socket connected: [id]`
- Console shows: `📨 New message received: [message]`
- Console shows: `Joined project room: [project-id]`

#### ❌ Failure Indicators
- Messages don't appear until page refresh
- Console errors about socket connection
- `Socket.IO enabled for real-time communication` not in backend logs
- Connection refused errors

### Browser Console Checks

#### Backend Console (Terminal)
```
MongoDB connected
Server running on port 5000
Socket.IO enabled for real-time communication
User connected: [socket-id]
User [socket-id] joined project: [project-id]
Message sent to project [project-id]
```

#### Frontend Console (Browser DevTools)
```
✅ Socket connected: [socket-id]
Joined project room: [project-id]
📨 New message received: {sender: {...}, message: "...", ...}
```

### Common Issues & Solutions

#### Issue: "Socket not connecting"
**Solutions:**
1. Check if backend is running
2. Verify `FRONTEND_URL` in Backend/.env matches your frontend URL
3. Check `VITE_SERVER_URL` in frontend/.env matches your backend URL
4. Clear browser cache and reload

#### Issue: "Messages appear after refresh only"
**Solutions:**
1. Check browser console for socket errors
2. Verify both users are in the same project
3. Make sure Socket.IO connection shows as connected
4. Check backend terminal for socket event logs

#### Issue: "CORS errors"
**Solutions:**
1. Verify `FRONTEND_URL` in backend .env is correct
2. Make sure both servers are running on expected ports
3. Check Socket.IO CORS configuration in server.js

#### Issue: "Messages appearing twice"
**Solutions:**
1. This is a known edge case - check socket listener cleanup
2. Make sure useEffect cleanup is running properly

### Advanced Testing

#### Test Reconnection
1. Stop the backend server (`Ctrl+C`)
2. Check console: should show `❌ Socket disconnected`
3. Restart backend server
4. Check console: should show `🔄 Socket reconnected`
5. Send a message - should work normally

#### Test Multiple Users
1. Open 3+ browser windows
2. Login as different users in each
3. All navigate to same project discussion
4. Send messages from any window
5. All windows should receive messages instantly

#### Test Message Persistence
1. Send several messages
2. Refresh the page
3. All messages should still be visible (loaded from database)
4. New messages should still arrive in real-time

### Performance Check
- Messages should appear in < 100ms typically
- No lag or delay in real-time updates
- Smooth scrolling to bottom with new messages
- No memory leaks (check browser memory usage)

---

## Troubleshooting Commands

### Check if Socket.IO is running
```powershell
# Check if backend server is listening on port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
```

### View active Node processes
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

### Check environment variables (in code)
```javascript
// In browser console
console.log(import.meta.env.VITE_SERVER_URL);

// In backend
console.log(process.env.FRONTEND_URL);
```

---

## Need Help?

If Socket.IO is not working:

1. **Check Backend Logs**: Look for "Socket.IO enabled for real-time communication"
2. **Check Frontend Console**: Look for "✅ Socket connected"
3. **Verify Environment Variables**: Make sure URLs match
4. **Test Basic Connection**: Open browser DevTools → Network → WS (WebSocket) tab
5. **Check Firewall**: Ensure port 5000 is not blocked

---

**🎉 If you see messages appearing instantly without refresh, Socket.IO is working perfectly!**
