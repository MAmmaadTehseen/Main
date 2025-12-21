/**
 * Student Dashboard Page
 * Main dashboard for students showing project progress and key statistics
 * Displays tasks due, messages, and overall progress
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, progressAPI } from "../../services/api";
import Card from "../../components/common/Card";
import ProgressCircle from "../../components/common/ProgressCircle";
import "./Dashboard.css";

/**
 * DASHBOARD COMPONENT
 * Displays student dashboard with statistics and progress
 * Fetches project data and progress information on mount
 */
const Dashboard = () => {
  const { user } = useAuth();

  // Dashboard statistics state
  const [stats, setStats] = useState({
    tasksDue: 0, // Number of tasks due
    advisorMessages: 0, // Unread advisor messages
    lastSubmission: null, // Date of last submission
    progress: 0, // Overall project progress percentage
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  /**
   * EFFECT: Fetch dashboard data on component mount
   * Retrieves student's projects and calculates progress
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get all projects for this student
        const projectsRes = await studentAPI.getProjects();
        const projects = projectsRes.data;

        // If student has projects, fetch progress for first project
        if (projects.length > 0) {
          const progressRes = await progressAPI.getProjectProgress(
            projects[0]._id
          );
          setStats((prev) => ({
            ...prev,
            progress: progressRes.data.completionPercentage || 0,
          }));
        }

        // Mock data for now - can be expanded based on actual API
        setStats((prev) => ({
          ...prev,
          tasksDue: 1,
          advisorMessages: 1,
          lastSubmission: "5/20/2025",
        }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Welcome heading with user's name */}
      <h1 className="page-title">Welcome, {user?.name || "User"}</h1>

      <div className="dashboard-grid">
        {/* Statistics cards row */}
        <div className="dashboard-stats">
          {/* Tasks due card */}
          <Card className="stat-card">
            <h3 className="stat-label">Tasks Due</h3>
            <p className="stat-value">{stats.tasksDue}</p>
          </Card>

          {/* Unread messages card */}
          <Card className="stat-card">
            <h3 className="stat-label">Advisor Messages</h3>
            <p className="stat-value">{stats.advisorMessages}</p>
          </Card>

          {/* Last submission card */}
          <Card className="stat-card">
            <h3 className="stat-label">Last Submission</h3>
            <p className="stat-value date">{stats.lastSubmission || "N/A"}</p>
          </Card>
        </div>

        {/* Progress circle card */}
        <Card className="progress-card">
          <h3 className="progress-label">Progress</h3>
          <ProgressCircle
            percentage={stats.progress}
            size={180}
            strokeWidth={14}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
