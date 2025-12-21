/**
 * Main Layout Component
 * Provides the overall page structure with sidebar, header, and main content area
 * Used as a wrapper for authenticated pages
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

/**
 * LAYOUT COMPONENT
 * Creates responsive main layout with collapsible sidebar
 * Renders page-specific content via <Outlet /> from React Router
 */
const Layout = () => {
  // State to track if sidebar is open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Toggle sidebar open/closed state
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Close the sidebar
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Navigation sidebar with links */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Overlay that appears behind sidebar on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main content wrapper */}
      <div className="main-wrapper">
        {/* Top header with menu button and user info */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content rendered here (Dashboard, Projects, etc.) */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
