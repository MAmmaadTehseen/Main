import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import Card from '../../components/common/Card';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all users
        const usersRes = await adminAPI.getUsers();
        const users = usersRes.data || [];

        // Fetch all projects
        const projectsRes = await adminAPI.getProjects();
        const projects = projectsRes.data || [];

        setStats({
          totalUsers: users.length,
          activeProjects: projects.length,
        });
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
    <div className="admin-dashboard">
      <h1 className="page-title">Welcome, {user?.name || 'Admin'}</h1>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <h3 className="stat-label">Total Users</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </Card>

        <Card className="stat-card">
          <h3 className="stat-label">Active Projects</h3>
          <p className="stat-value">{stats.activeProjects}</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
