import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { advisorAPI, progressAPI } from '../../services/api';
import Card from '../../components/common/Card';
import ProgressCircle from '../../components/common/ProgressCircle';
import { MdUpload, MdCheck, MdMessage, MdAssignment } from 'react-icons/md';
import './AdvisorDashboard.css';

const AdvisorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingReviews: 0,
    activeProjects: 0,
    latestSubmission: null,
  });
  const [projectsProgress, setProjectsProgress] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsRes = await advisorAPI.getProjects();
        const projects = projectsRes.data;

        // Calculate stats
        let totalStudents = 0;
        let pendingReviews = 0;
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;
        const activities = [];

        for (const project of projects) {
          totalStudents += project.students?.length || 0;

          // Get tasks for each project
          try {
            const tasksRes = await advisorAPI.getProjectTasks(project._id);
            const tasks = tasksRes.data;

            for (const task of tasks) {
              // Get submissions for each task
              try {
                const submissionsRes = await advisorAPI.getTaskSubmissions(task._id);
                const submissions = submissionsRes.data;

                // Count pending reviews (submitted but not evaluated)
                submissions.forEach(sub => {
                  if (sub.status === 'submitted' || (sub.status !== 'evaluated' && sub.marks === null)) {
                    pendingReviews++;
                  }
                });

                // Add recent submissions to activities
                submissions.forEach(sub => {
                  if (sub.createdAt) {
                    activities.push({
                      type: 'submission',
                      message: `${sub.studentId?.name || 'Student'} submitted ${task.name}`,
                      date: new Date(sub.createdAt),
                      icon: 'upload',
                    });
                  }
                });
              } catch (err) {
                console.error('Error fetching submissions:', err);
              }
            }

            // Calculate project progress
            const progressRes = await progressAPI.getProjectProgress(project._id);
            const percentage = progressRes.data.completionPercentage || 0;

            if (percentage === 100) {
              completed++;
            } else if (percentage > 0) {
              inProgress++;
            } else {
              notStarted++;
            }
          } catch (err) {
            console.error('Error fetching tasks:', err);
            notStarted++;
          }
        }

        // Sort activities by date and take recent ones
        activities.sort((a, b) => b.date - a.date);
        const recentActs = activities.slice(0, 5).map(act => ({
          ...act,
          formattedDate: formatActivityDate(act.date),
        }));

        setStats({
          totalStudents,
          pendingReviews,
          activeProjects: projects.length,
          latestSubmission: activities.length > 0 ? formatDate(activities[0].date) : null,
        });

        setProjectsProgress({
          completed,
          inProgress,
          notStarted,
        });

        setRecentActivities(recentActs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatActivityDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const actDate = new Date(date);
    const diffDays = Math.floor((now - actDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${actDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${actDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return actDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'submission':
        return <MdUpload className="activity-icon upload" />;
      case 'approval':
        return <MdCheck className="activity-icon approval" />;
      case 'message':
        return <MdMessage className="activity-icon message" />;
      case 'task':
        return <MdAssignment className="activity-icon task" />;
      default:
        return <MdAssignment className="activity-icon" />;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const totalProjects = projectsProgress.completed + projectsProgress.inProgress + projectsProgress.notStarted;
  const completedPercentage = totalProjects > 0 ? Math.round((projectsProgress.completed / totalProjects) * 100) : 0;
  const inProgressPercentage = totalProjects > 0 ? Math.round((projectsProgress.inProgress / totalProjects) * 100) : 0;

  return (
    <div className="advisor-dashboard">
      <h1 className="page-title">Welcome, {user?.name || 'Advisor'}</h1>

      <div className="dashboard-stats-row">
        <Card className="stat-card">
          <h3 className="stat-label">Total Students</h3>
          <p className="stat-value">{stats.totalStudents}</p>
        </Card>

        <Card className="stat-card">
          <h3 className="stat-label">Pending Reviews</h3>
          <p className="stat-value">{stats.pendingReviews}</p>
        </Card>

        <Card className="stat-card">
          <h3 className="stat-label">Active Projects</h3>
          <p className="stat-value">{stats.activeProjects}</p>
        </Card>

        <Card className="stat-card">
          <h3 className="stat-label">Latest Submission</h3>
          <p className="stat-value date">{stats.latestSubmission || 'N/A'}</p>
        </Card>
      </div>

      <div className="dashboard-main">
        <Card className="progress-section">
          <h3 className="section-title">Projects Progress</h3>
          <div className="progress-content">
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
                {/* Completed segment */}
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
                {/* In Progress segment */}
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
                    <span className="activity-date">{activity.formattedDate}</span>
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
