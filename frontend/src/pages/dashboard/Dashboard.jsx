import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, progressAPI } from '../../services/api';
import Card from '../../components/common/Card';
import ProgressCircle from '../../components/common/ProgressCircle';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tasksDue: 0,
    advisorMessages: 0,
    lastSubmission: null,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsRes = await studentAPI.getProjects();
        const projects = projectsRes.data;

        if (projects.length > 0) {
          const progressRes = await progressAPI.getProjectProgress(projects[0]._id);
          setStats(prev => ({
            ...prev,
            progress: progressRes.data.completionPercentage || 0,
          }));
        }

        // Mock data for now - can be expanded based on actual API
        setStats(prev => ({
          ...prev,
          tasksDue: 1,
          advisorMessages: 1,
          lastSubmission: '5/20/2025',
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Welcome, {user?.name || 'User'}</h1>

      <div className="dashboard-grid">
        <div className="dashboard-stats">
          <Card className="stat-card">
            <h3 className="stat-label">Tasks Due</h3>
            <p className="stat-value">{stats.tasksDue}</p>
          </Card>

          <Card className="stat-card">
            <h3 className="stat-label">Advisor Messages</h3>
            <p className="stat-value">{stats.advisorMessages}</p>
          </Card>

          <Card className="stat-card">
            <h3 className="stat-label">Last Submission</h3>
            <p className="stat-value date">{stats.lastSubmission || 'N/A'}</p>
          </Card>
        </div>

        <Card className="progress-card">
          <h3 className="progress-label">Progress</h3>
          <ProgressCircle percentage={stats.progress} size={180} strokeWidth={14} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
