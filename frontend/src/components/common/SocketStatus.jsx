/**
 * Socket Status Indicator
 * Visual indicator showing Socket.IO connection status
 * Helpful for debugging and user awareness
 */

import { useState, useEffect } from "react";
import { getSocket } from "../../services/socket";
import "./SocketStatus.css";

const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      setShowStatus(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setShowStatus(true);
    };

    // Set initial state
    setIsConnected(socket.connected);

    // Listen to events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Don't render if not showing
  if (!showStatus) return null;

  return (
    <div className={`socket-status ${isConnected ? "connected" : "disconnected"}`}>
      <span className="status-dot"></span>
      <span className="status-text">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

export default SocketStatus;
