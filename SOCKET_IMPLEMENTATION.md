# Socket.IO Implementation for Discussion Board

## Overview
Real-time communication has been implemented in the discussion board using Socket.IO. This enables instant message delivery without requiring page refreshes.

## Features
✅ **Real-time messaging** - Messages appear instantly for all users in the same project
✅ **Project-specific rooms** - Each project has its own chat room
✅ **Automatic reconnection** - Connection is restored automatically if dropped
✅ **Optimistic updates** - Messages appear immediately for the sender
✅ **Connection status** - Console logs show connection status for debugging

## How It Works

### Backend (Socket.IO Server)
1. **Server Setup** (`Backend/server.js`)
   - Creates HTTP server with Express
   - Initializes Socket.IO with CORS configuration
   - Listens on the same port as Express (default: 5000)

2. **Socket Events** (`Backend/server.js`)
   - `connection` - User connects to server
   - `joinProject` - User joins a project-specific room
   - `leaveProject` - User leaves a project room
   - `newMessage` - Broadcasts message to all users in room
   - `disconnect` - User disconnects from server

3. **Controller Integration** (`Backend/controllers/discussionController.js`)
   - When a message is posted via API, it also emits a socket event
   - All users in the project room receive the message instantly

### Frontend (Socket.IO Client)
1. **Socket Service** (`frontend/src/services/socket.js`)
   - Singleton pattern ensures single connection
   - Provides methods for joining/leaving rooms
   - Handles connection, disconnection, and reconnection

2. **Discussion Component** (`frontend/src/pages/discussion/Discussion.jsx`)
   - Initializes socket connection on mount
   - Joins current project room
   - Listens for incoming messages
   - Automatically leaves room on unmount or project switch

## Environment Variables

### Backend (.env)
```
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_SERVER_URL=http://localhost:5000
```

## Testing Real-time Functionality

1. **Open the app in two different browser windows/tabs**
2. **Login as different users** in each window
3. **Navigate to the Discussion Board** and select the same project
4. **Send a message in one window**
5. **The message should appear instantly in the other window** ✨

## Console Messages

When Socket.IO is working correctly, you'll see:
- `✅ Socket connected: [socket-id]` - Connection established
- `Joined project room: [project-id]` - Joined project room
- `📨 New message received: [message]` - Received real-time message
- `❌ Socket disconnected: [reason]` - Connection lost
- `🔄 Socket reconnected after X attempts` - Reconnected

## Troubleshooting

### Messages not appearing in real-time
- Check browser console for socket connection errors
- Verify CORS settings allow your frontend URL
- Ensure both backend and frontend are running
- Check that FRONTEND_URL and VITE_SERVER_URL are set correctly

### Connection errors
- Make sure backend is running on port 5000
- Check firewall settings
- Verify Socket.IO versions match (installed v4.8.1)

### Messages duplicate
- This shouldn't happen, but if it does, check that socket listeners are properly cleaned up in useEffect

## Technical Details

### Socket.IO Transports
1. **WebSocket** - Primary transport (fastest)
2. **Polling** - Fallback if WebSocket unavailable

### Room Architecture
- Each project has a unique room identified by projectId
- Users only receive messages from projects they've joined
- Prevents cross-project message leakage

### Message Flow
1. User types message and clicks send
2. Message sent to REST API (`POST /api/discussions/:projectId`)
3. Controller saves to database and emits socket event
4. Socket.IO broadcasts to all users in project room
5. Other users receive message via socket and update UI
6. Sender sees message immediately (optimistic update)

## Files Modified/Created

### Backend
- ✏️ `Backend/server.js` - Added Socket.IO initialization and events
- ✏️ `Backend/controllers/discussionController.js` - Added socket emit on message post

### Frontend
- ✨ `frontend/src/services/socket.js` - New socket service (created)
- ✏️ `frontend/src/pages/discussion/Discussion.jsx` - Integrated real-time updates

## Performance Considerations

- Socket connection is reused across the app (singleton pattern)
- Only relevant project rooms are joined
- Cleanup properly removes listeners to prevent memory leaks
- Optimistic updates show messages immediately for better UX

## Future Enhancements

Potential improvements:
- [ ] Typing indicators ("User is typing...")
- [ ] Read receipts (show who has seen messages)
- [ ] Online/offline user status
- [ ] Message edit/delete with real-time sync
- [ ] File sharing via  socket
- [ ] Push notifications for new messages
