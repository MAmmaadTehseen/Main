/**
 * AdvisorDashboard Component
 * Advisor dashboard displaying project management and student tracking
 * Shows student count, pending reviews, project progress, and recent activities
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { advisorAPI, progressAPI } from "../../services/api";
import Card from "../../components/common/Card";
import ProgressCircle from "../../components/common/ProgressCircle";
import { MdUpload, MdCheck, MdMessage, MdAssignment } from "react-icons/md";
import "./AdvisorDashboard.css";

/**
 * AdvisorDashboard - React component for advisor oversight
 *
 * State:
 * - stats: Object with totalStudents, pendingReviews, activeProjects, latestSubmission
 * - projectsProgress: Breakdown of completed/in-progress/not-started projects
 * - recentActivities: Array of recent submissions and activities
 * - loading: Boolean flag for data loading state
 *
 * Effects:
 * - Fetches advisor's projects and their tasks on mount
 * - Calculates project progress and pending reviews
 * - Compiles recent activities timeline
 */
const AdvisorDashboard = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalStudents: 0, // Total students across all advisor's projects
    pendingReviews: 0, // Number of submissions awaiting grading
    activeProjects: 0, // Number of projects advisor manages
    latestSubmission: null, // Date of most recent submission
  });

  // State for project progress breakdown
  const [projectsProgress, setProjectsProgress] = useState({
    completed: 0, // Completed projects (100% tasks done)
    inProgress: 0, // In-progress projects (0-99% tasks done)
    notStarted: 0, // Not started projects (0% tasks done)
  });

  // State for recent activities timeline
  const [recentActivities, setRecentActivities] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dashboard data on component mount
   * Retrieves advisor's projects, tasks, submissions and calculates metrics
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all projects assigned to this advisor
        const projectsRes = await advisorAPI.getProjects();
        const projects = projectsRes.data;

        // Initialize counters for statistics
        let totalStudents = 0;
        let pendingReviews = 0;
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;
        const activities = [];

        // Iterate through each project to calculate stats
        for (const project of projects) {
          // Count unique students across projects
          totalStudents += project.students?.length || 0;

          // Get tasks for each project
          try {
            const tasksRes = await advisorAPI.getProjectTasks(project._id);
            const tasks = tasksRes.data;

            // Process each task
            for (const task of tasks) {
              // Get submissions for each task
              try {
                const submissionsRes = await advisorAPI.getTaskSubmissions(
                  task._id
                );
                const submissions = submissionsRes.data;

                // Count pending reviews (submitted but not graded)
                submissions.forEach((sub) => {
                  if (
                    sub.status === "submitted" ||
                    (sub.status !== "evaluated" && sub.marks === null)
                  ) {
                    pendingReviews++;
                  }
                });

                // Add recent submissions to activities
                submissions.forEach((sub) => {
                  if (sub.createdAt) {
                    activities.push({
                      type: "submission",
                      message: `${sub.studentId?.name || "Student"} submitted ${
                        task.name
                      }`,
                      date: new Date(sub.createdAt),
                      icon: "upload",
                    });
                  }
                });
              } catch (err) {
                console.error("Error fetching submissions:", err);
              }
            }

            // Calculate project progress percentage
            const progressRes = await progressAPI.getProjectProgress(
              project._id
            );
            const percentage = progressRes.data.completionPercentage || 0;

            // Categorize project by completion percentage
            if (percentage === 100) {
              completed++;
            } else if (percentage > 0) {
              inProgress++;
            } else {
              notStarted++;
            }
          } catch (err) {
            console.error("Error fetching tasks:", err);
            notStarted++;
          }
        }

        // Sort activities by date and get 5 most recent
        activities.sort((a, b) => b.date - a.date);
        const recentActs = activities.slice(0, 5).map((act) => ({
          ...act,
          formattedDate: formatActivityDate(act.date),
        }));

        // Update statistics state
        setStats({
          totalStudents,
          pendingReviews,
          activeProjects: projects.length,
          latestSubmission:
            activities.length > 0 ? formatDate(activities[0].date) : null,
        });

        // Update project progress breakdown
        setProjectsProgress({
          completed,
          inProgress,
          notStarted,
        });

        // Update recent activities
        setRecentActivities(recentActs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /**
   * Format date for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string (MM/DD/YYYY)
   */
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Format activity date with relative time
   * @param {Date} date - Date object to format
   * @returns {string} Relative or absolute date string
   */
  const formatActivityDate = (date) => {
    if (!date) return "";
    const now = new Date();
    const actDate = new Date(date);
    const diffDays = Math.floor((now - actDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${actDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${actDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      return actDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  /**
   * Get appropriate icon for activity type
   * @param {string} type - Activity type (submission, approval, message, task)
   * @returns {JSX.Element} React icon component
   */
  const getActivityIcon = (type) => {
    switch (type) {
      case "submission":
        return <MdUpload className="activity-icon upload" />;
      case "approval":
        return <MdCheck className="activity-icon approval" />;
      case "message":
        return <MdMessage className="activity-icon message" />;
      case "task":
        return <MdAssignment className="activity-icon task" />;
      default:
        return <MdAssignment className="activity-icon" />;
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate percentages for progress visualization
  const totalProjects =
    projectsProgress.completed +
    projectsProgress.inProgress +
    projectsProgress.notStarted;
  const completedPercentage =
    totalProjects > 0
      ? Math.round((projectsProgress.completed / totalProjects) * 100)
      : 0;
  const inProgressPercentage =
    totalProjects > 0
      ? Math.round((projectsProgress.inProgress / totalProjects) * 100)
      : 0;

  return (
    <div className="advisor-dashboard">
      {/* Page heading with advisor name */}
      <h1 className="page-title">Welcome, {user?.name || "Advisor"}</h1>

      {/* Statistics cards row */}
      <div className="dashboard-stats-row">
        {/* Total Students Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Total Students</h3>
          <p className="stat-value">{stats.totalStudents}</p>
        </Card>

        {/* Pending Reviews Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Pending Reviews</h3>
          <p className="stat-value">{stats.pendingReviews}</p>
        </Card>

        {/* Active Projects Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Active Projects</h3>
          <p className="stat-value">{stats.activeProjects}</p>
        </Card>

        {/* Latest Submission Date Card */}
        <Card className="stat-card">
          <h3 className="stat-label">Latest Submission</h3>
          <p className="stat-value date">{stats.latestSubmission || "N/A"}</p>
        </Card>
      </div>

      {/* Main content area with progress and activities */}
      <div className="dashboard-main">
        {/* Project Progress Section */}
        <Card className="progress-section">
          <h3 className="section-title">Projects Progress</h3>
          <div className="progress-content">
            {/* Donut chart showing project status distribution */}
            <div className="donut-chart">
              <svg viewBox="0 0 100 100" className="donut">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                {/* Completed segment (green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={`${completedPercentage * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* In Progress segment (blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1B4965"
                  strokeWidth="12"
                  strokeDasharray={`${inProgressPercentage * 2.51} 251`}
                  strokeDashoffset={`${-completedPercentage * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            {/* Progress legend */}
            <div className="progress-legend">
              <div className="legend-item">
                <span className="legend-color completed"></span>
                <span className="legend-text">Completed</span>
              </div>
              <div className="legend-item">
                <span className="legend-color in-progress"></span>
                <span className="legend-text">In-Progress</span>
              </div>
              <div className="legend-item">
                <span className="legend-color not-started"></span>
                <span className="legend-text">Not Started</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activities Section */}
        <Card className="activities-section">
          <h3 className="section-title">Recent Activities</h3>
          <div className="activities-list">
            {recentActivities.length === 0 ? (
              <p className="no-activities">No recent activities</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  {getActivityIcon(activity.type)}
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-date">
                      {activity.formattedDate}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
