import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { advisorAPI, SERVER_URL } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { MdVisibility, MdEdit, MdAdd, MdSearch, MdClose, MdDelete } from 'react-icons/md';
import './AdvisorTasks.css';

const AdvisorTasks = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [creating, setCreating] = useState(false);
  const [grading, setGrading] = useState(null);
  const [filterProjectId, setFilterProjectId] = useState(null);
  const [filterProjectName, setFilterProjectName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    projectId: '',
    file: null,
  });

  useEffect(() => {
    const projectId = searchParams.get('project');
    setFilterProjectId(projectId);
    fetchData(projectId);
  }, [searchParams]);

  const fetchData = async (filterProjectId) => {
    try {
      const projectsRes = await advisorAPI.getProjects();
      const projectsData = projectsRes.data;
      setProjects(projectsData);

      // If filtering by project, get the project name
      if (filterProjectId) {
        const filteredProject = projectsData.find(p => p._id === filterProjectId);
        if (filteredProject) {
          setFilterProjectName(filteredProject.name);
        }
      } else {
        setFilterProjectName('');
      }

      // Fetch tasks for projects (filtered or all)
      const projectsToFetch = filterProjectId
        ? projectsData.filter(p => p._id === filterProjectId)
        : projectsData;

      const allTasks = [];
      for (const project of projectsToFetch) {
        try {
          const tasksRes = await advisorAPI.getProjectTasks(project._id);
          const projectTasks = tasksRes.data.map(task => ({
            ...task,
            projectName: project.name,
            students: project.students,
          }));
          allTasks.push(...projectTasks);
        } catch (err) {
          console.error('Error fetching tasks:', err);
        }
      }

      // Get submission counts for each task
      const tasksWithSubmissions = await Promise.all(
        allTasks.map(async (task) => {
          try {
            const submissionsRes = await advisorAPI.getTaskSubmissions(task._id);
            const submissions = submissionsRes.data;
            const evaluated = submissions.filter(s => s.evaluated || s.status === 'evaluated').length;
            return {
              ...task,
              submissionCount: submissions.length,
              evaluatedCount: evaluated,
            };
          } catch {
            return { ...task, submissionCount: 0, evaluatedCount: 0 };
          }
        })
      );

      setTasks(tasksWithSubmissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.projectId) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('instructions', formData.instructions);
      data.append('projectId', formData.projectId);
      if (formData.file) {
        data.append('file', formData.file);
      }

      await advisorAPI.createTask(data);
      await fetchData();
      setShowCreateModal(false);
      setFormData({ name: '', instructions: '', projectId: '', file: null });
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTaskStatus = (task) => {
    if (task.isCompleted) return 'Completed';
    if (task.isDone) return 'In Progress';
    if (task.evaluatedCount === task.students?.length && task.students?.length > 0) return 'Completed';
    if (task.submissionCount > 0) return 'In Progress';
    return 'Pending';
  };

  const getAssignedTo = (task) => {
    if (task.students?.length > 0) {
      if (task.students.length === 1) {
        return task.students[0].name;
      }
      return `${task.students[0].name} +${task.students.length - 1}`;
    }
    return 'No students';
  };

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.name?.toLowerCase().includes(searchLower) ||
      task.projectName?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewSubmissions = async (task) => {
    setSelectedTask(task);
    try {
      const res = await advisorAPI.getTaskSubmissions(task._id);
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    }
    setShowViewModal(true);
  };

  const handleGradeSubmission = async (submissionId, marks) => {
    if (marks === '' || marks === null) {
      alert('Please enter marks');
      return;
    }

    setGrading(submissionId);
    try {
      await advisorAPI.gradeSubmission(submissionId, { marks: Number(marks) });
      // Refresh submissions
      const res = await advisorAPI.getTaskSubmissions(selectedTask._id);
      setSubmissions(res.data);
      await fetchData(filterProjectId);
    } catch (error) {
      console.error('Error grading submission:', error);
      alert(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(null);
    }
  };

  const handleDeleteTask = async (taskId, taskName) => {
    if (!window.confirm(`Are you sure you want to delete "${taskName}"? This will also delete all submissions.`)) {
      return;
    }

    try {
      await advisorAPI.deleteTask(taskId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await advisorAPI.completeTask(taskId);
      await fetchData();
    } catch (error) {
      console.error('Error completing task:', error);
      alert(error.response?.data?.message || 'Failed to mark task as complete');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="advisor-tasks-page">
      <div className="page-header">
        <h1 className="page-title">Tasks{filterProjectName && ` - ${filterProjectName}`}</h1>
        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Tasks...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <button className="add-btn" onClick={() => setShowCreateModal(true)}>
        <MdAdd /> Add New Task
      </button>

      <Card className="tasks-table-card">
        <h2 className="table-title">Task Management</h2>
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No tasks found.</td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="task-name">{task.name}</td>
                  <td className="assigned-to">{getAssignedTo(task)}</td>
                  <td className="due-date">{formatDate(task.dueDate || task.createdAt)}</td>
                  <td>
                    <StatusBadge status={getTaskStatus(task)} />
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      title="View Submissions"
                      onClick={() => handleViewSubmissions(task)}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Mark Complete"
                      onClick={() => handleCompleteTask(task._id)}
                      disabled={getTaskStatus(task) === 'Completed'}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Task"
                      onClick={() => handleDeleteTask(task._id, task.name)}
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

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Task Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter task name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Project *</label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Enter task instructions"
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Attachment (Optional)</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleInputChange}
                    className="file-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {showViewModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal submissions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submissions for: {selectedTask.name}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <MdClose />
              </button>
            </div>
            <div className="modal-body">
              {submissions.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No submissions yet.</p>
              ) : (
                <div className="submissions-list">
                  {submissions.map((sub) => (
                    <div key={sub._id} className="submission-item">
                      <div className="submission-header">
                        <div className="student-name">
                          {sub.studentId?.name || 'Unknown Student'}
                        </div>
                        <div className={`submission-status ${sub.status === 'evaluated' ? 'graded' : 'pending'}`}>
                          {sub.status === 'evaluated' ? 'Graded' : 'Pending'}
                        </div>
                      </div>
                      <div className="submission-details">
                        <span>Submitted: {new Date(sub.createdAt).toLocaleString()}</span>
                        {sub.fileUrl && (
                          <a
                            href={`${SERVER_URL}${sub.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-file-link"
                          >
                            View File
                          </a>
                        )}
                      </div>
                      <div className="grading-section">
                        <label>Marks:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={sub.marks ?? ''}
                          id={`marks-${sub._id}`}
                          disabled={grading === sub._id}
                        />
                        <button
                          className="grade-btn"
                          onClick={() => {
                            const input = document.getElementById(`marks-${sub._id}`);
                            handleGradeSubmission(sub._id, input.value);
                          }}
                          disabled={grading === sub._id}
                        >
                          {grading === sub._id ? 'Saving...' : (sub.status === 'evaluated' ? 'Update' : 'Grade')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorTasks;
