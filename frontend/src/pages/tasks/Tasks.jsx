import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, advisorAPI, SERVER_URL } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { MdPictureAsPdf, MdInsertDriveFile, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const fileInputRefs = useRef({});

  const fetchTasks = async () => {
    try {
      let projectsRes;
      if (user?.role === 'advisor') {
        projectsRes = await advisorAPI.getProjects();
      } else {
        projectsRes = await studentAPI.getProjects();
      }

      const projects = projectsRes.data;
      const allTasks = [];

      for (const project of projects) {
        try {
          let tasksRes;
          if (user?.role === 'advisor') {
            tasksRes = await advisorAPI.getProjectTasks(project._id);
          } else {
            tasksRes = await studentAPI.getProjectTasks(project._id);
          }

          const projectTasks = tasksRes.data.map(task => ({
            ...task,
            projectName: project.name,
            advisorName: project.advisors?.map(a => a.name).join(', ') || 'N/A',
          }));

          allTasks.push(...projectTasks);
        } catch (err) {
          console.error('Error fetching tasks for project:', err);
        }
      }

      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?.role]);

  const handleFileSelect = (taskId, file) => {
    setSelectedFiles(prev => ({ ...prev, [taskId]: file }));
  };

  const handleSubmitTask = async (taskId) => {
    const file = selectedFiles[taskId];
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(taskId);
    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('file', file);

      await studentAPI.submitTask(formData);

      // Clear the selected file and refresh tasks
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[taskId];
        return newFiles;
      });

      await fetchTasks();
      alert('Task submitted successfully!');
    } catch (error) {
      console.error('Error submitting task:', error);
      alert(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setUploading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusText = (task) => {
    if (task.isCompleted) return 'Completed';
    if (task.mySubmission) return 'Submitted';
    if (task.isDone) return 'Approve';
    return 'Pending';
  };

  const isStudent = user?.role === 'student';

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <MdPictureAsPdf />;
    return <MdInsertDriveFile />;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tasks-page">
      <h1 className="page-title">Tasks</h1>

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="no-data">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="task-card">
              <div className="task-header">
                <div className="task-info">
                  <h2 className="task-title">{task.name}</h2>
                  <p className="task-description">{task.instructions}</p>
                  <p className="task-advisor">Advisor: {task.advisorName}</p>
                </div>
                {task.fileUrl && (
                  <a href={`${SERVER_URL}${task.fileUrl}`} target="_blank" rel="noopener noreferrer" className="task-file">
                    {getFileIcon(task.fileUrl)}
                    <span>{task.fileUrl.split('/').pop() || 'instructions.pdf'}</span>
                  </a>
                )}
              </div>

              {/* Student File Upload Section */}
              {isStudent && !task.isCompleted && (
                <div className="task-upload-section">
                  {task.mySubmission ? (
                    <div className="submission-info">
                      <MdCheckCircle className="submitted-icon" />
                      <span>Submitted: {task.mySubmission.fileUrl?.split('/').pop() || 'File'}</span>
                      <a
                        href={`${SERVER_URL}${task.mySubmission.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-submission-link"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="upload-controls">
                      <input
                        type="file"
                        id={`file-${task._id}`}
                        ref={el => fileInputRefs.current[task._id] = el}
                        onChange={(e) => handleFileSelect(task._id, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <button
                        className="select-file-btn"
                        onClick={() => fileInputRefs.current[task._id]?.click()}
                        disabled={uploading === task._id}
                      >
                        <MdCloudUpload />
                        {selectedFiles[task._id] ? selectedFiles[task._id].name : 'Select File'}
                      </button>
                      <button
                        className="submit-btn"
                        onClick={() => handleSubmitTask(task._id)}
                        disabled={!selectedFiles[task._id] || uploading === task._id}
                      >
                        {uploading === task._id ? 'Uploading...' : 'Submit'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="task-footer">
                <div className="task-dates">
                  <div className="date-item">
                    <span className="date-label">Assigned</span>
                    <span className="date-value">{formatDate(task.createdAt)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Due</span>
                    <span className="date-value">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
                <div className="task-status">
                  <span className="status-label">Status</span>
                  <StatusBadge status={getStatusText(task)} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
