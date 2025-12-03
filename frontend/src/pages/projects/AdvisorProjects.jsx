import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { advisorAPI, progressAPI } from '../../services/api';
import Card from '../../components/common/Card';
import ProgressCircle from '../../components/common/ProgressCircle';
import { MdVisibility, MdMessage, MdDelete, MdAdd, MdSearch, MdClose } from 'react-icons/md';
import './AdvisorProjects.css';

const AdvisorProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await advisorAPI.getProjects();
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a project name');
      return;
    }

    setCreating(true);
    try {
      await advisorAPI.createProject(formData);
      await fetchProjects();
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewProject = (projectId) => {
    navigate(`/tasks?project=${projectId}`);
  };

  const handleOpenDiscussion = (projectId) => {
    navigate(`/discussion?project=${projectId}`);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all tasks, submissions, and discussions related to this project.`)) {
      return;
    }

    setDeleting(projectId);
    try {
      await advisorAPI.deleteProject(projectId);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower)
    );
  });

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate avatar color based on name
  const getAvatarColor = (name, index) => {
    const colors = ['#1ABC9C', '#3498DB', '#9B59B6', '#E74C3C', '#F39C12', '#1B4965'];
    return colors[index % colors.length];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="advisor-projects-page">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <button className="add-btn" onClick={() => setShowCreateModal(true)}>
        <MdAdd /> Add New Project
      </button>

      <Card className="projects-table-card">
        <h2 className="table-title">Project List</h2>
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Assigned Students</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No projects found.</td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-desc">{project.description}</span>
                  </td>
                  <td className="students-cell">
                    <div className="student-avatars">
                      {project.students?.slice(0, 3).map((student, index) => (
                        <div
                          key={student._id}
                          className="student-avatar"
                          style={{ backgroundColor: getAvatarColor(student.name, index) }}
                          title={student.name}
                        >
                          {getInitials(student.name)}
                        </div>
                      ))}
                      {project.students?.length > 3 && (
                        <div className="student-avatar more">
                          +{project.students.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="progress-cell">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{project.progress}%</span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      title="View Tasks"
                      onClick={() => handleViewProject(project._id)}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className="action-btn message"
                      title="Discussion"
                      onClick={() => handleOpenDiscussion(project._id)}
                    >
                      <MdMessage />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Project"
                      onClick={() => handleDeleteProject(project._id, project.name)}
                      disabled={deleting === project._id}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    rows={4}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorProjects;
