/**
 * Socket Service
 * Manages Socket.IO client connection for real-time communication
 * Provides singleton instance to ensure single connection across the app
 */

import { io } from "socket.io-client";

// Get backend URL from environment or use default
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/**
 * Socket.IO client instance
 * Will be initialized when initializeSocket is called
 */
let socket = null;

/**
 * Initialize Socket.IO connection
 * @returns {Socket} Socket.IO client instance
 */
export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true, // Auto-reconnect on disconnect
      reconnectionDelay: 1000, // Wait 1s before reconnecting
      reconnectionAttempts: 5, // Try up to 5 times
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });
  }

  return socket;
};

/**
 * Get the socket instance
 * @returns {Socket|null} Socket instance or null if not initialized
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected and cleaned up");
  }
};

/**
 * Join a project room for receiving messages
 * @param {string} projectId - The project ID to join
 */
export const joinProjectRoom = (projectId) => {
  if (socket && projectId) {
    socket.emit("joinProject", projectId);
    console.log(`Joined project room: ${projectId}`);
  }
};

/**
 * Leave a project room
 * @param {string} projectId - The project ID to leave
 */
export const leaveProjectRoom = (projectId) => {
  if (socket && projectId) {
    socket.emit("leaveProject", projectId);
    console.log(`Left project room: ${projectId}`);
  }
};

/**
 * Send a new message to a project room
 * @param {string} projectId - The project ID
 * @param {Object} message - The message object
 */
export const sendMessage = (projectId, message) => {
  if (socket && projectId && message) {
    socket.emit("newMessage", { projectId, message });
  }
};

/**
 * Listen for new messages
 * @param {Function} callback - Callback function to handle received messages
 * @returns {Function} Cleanup function to remove this specific listener
 */
export const onMessageReceived = (callback) => {
  if (socket) {
    // Remove any existing listeners first to prevent duplicates
    socket.off("messageReceived");
    // Add the new listener
    socket.on("messageReceived", callback);
    console.log("🎧 Socket listener registered for messageReceived");
    
    // Return cleanup function
    return () => {
      socket.off("messageReceived", callback);
      console.log("🔇 Socket listener removed for messageReceived");
    };
  }
  return () => {}; // No-op if no socket
};

/**
 * Remove message listener
 * @param {Function} callback - Optional specific callback to remove
 */
export const offMessageReceived = (callback) => {
  if (socket) {
    if (callback) {
      socket.off("messageReceived", callback);
    } else {
      socket.off("messageReceived");
    }
    console.log("🔇 Socket listener removed");
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinProjectRoom,
  leaveProjectRoom,
  sendMessage,
  onMessageReceived,
  offMessageReceived,
};
