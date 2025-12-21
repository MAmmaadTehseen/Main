/**
 * AdminDashboard Component
 * System administrator dashboard displaying key metrics
 * Shows total user count and active projects in the system
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";
import Card from "../../components/common/Card";
import "./AdminDashboard.css";

/**
 * AdminDashboard - React component for admin system overview
 *
 * State:
 * - stats: Object containing totalUsers and activeProjects counts
 * - loading: Boolean flag for data loading state
 *
 * Effects:
 * - Fetches all users and projects on component mount
 * - Updates stats with counts
 * - Handles loading and error states
 */
const AdminDashboard = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalUsers: 0, // Total number of users in system
    activeProjects: 0, // Total number of active projects
  });

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dashboard data on component mount
   * Retrieves all users and projects to calculate statistics
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all users from the system
        const usersRes = await adminAPI.getUsers();
        const users = usersRes.data || [];

        // Fetch all projects from the system
        const projectsRes = await adminAPI.getProjects();
        const projects = projectsRes.data || [];

        // Update statistics with counts
        setStats({
          totalUsers: users.length,
          activeProjects: projects.length,
        });
      } catch (error) {
        // Log error to console but continue rendering
        console.error("Error fetching dashboard data:", error);
      } finally {
        // Mark loading as complete
        setLoading(false);
      }
    };

    // Execute data fetch
    fetchDashboardData();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Page heading with admin name */}
      <h1 className="page-title">Welcome, {user?.name || "Admin"}</h1>

      {/* Dashboard statistics cards */}
      <div className="dashboard-stats">
        {/* Total Users Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Total Users</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </Card>

        {/* Active Projects Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Active Projects</h3>
          <p className="stat-value">{stats.activeProjects}</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
