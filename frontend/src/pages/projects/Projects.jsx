import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, advisorAPI, progressAPI } from '../../services/api';
import Card from '../../components/common/Card';
import ProgressCircle from '../../components/common/ProgressCircle';
import './Projects.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response;
        if (user?.role === 'advisor') {
          response = await advisorAPI.getProjects();
        } else {
          response = await studentAPI.getProjects();
        }

        const projectsData = response.data;

        // Fetch progress for each project
        const projectsWithProgress = await Promise.all(
          projectsData.map(async (project) => {
            try {
              const progressRes = await progressAPI.getProjectProgress(project._id);
              return {
                ...project,
                progress: progressRes.data.completionPercentage || 0,
              };
            } catch {
              return { ...project, progress: 0 };
            }
          })
        );

        setProjects(projectsWithProgress);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.role]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="projects-page">
      <h1 className="page-title">Projects</h1>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-data">No projects found.</p>
        ) : (
          projects.map((project) => (
            <Card key={project._id} className="project-card">
              <div className="project-header">
                <h2 className="project-title">{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <p className="project-advisor">
                  Advisor: {project.advisors?.map(a => a.name).join(', ') || 'N/A'}
                </p>
              </div>
              <div className="project-footer">
                <div className="project-info">
                  <div className="info-item">
                    <span className="info-label">Batch</span>
                    <span className="info-value">{project.batch || '23'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Department</span>
                    <span className="info-value">{project.department || 'Computer Science'}</span>
                  </div>
                </div>
                <div className="project-progress">
                  <ProgressCircle percentage={project.progress} size={80} strokeWidth={8} />
                  <span className="progress-text">Progress</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
