import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, SERVER_URL } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import './Submissions.css';

const Submissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // First get projects, then get tasks for each project
        const projectsRes = await studentAPI.getProjects();
        const projects = projectsRes.data;

        const allSubmissions = [];

        for (const project of projects) {
          try {
            const tasksRes = await studentAPI.getProjectTasks(project._id);
            const tasks = tasksRes.data;

            for (const task of tasks) {
              // Only show tasks that have been submitted
              if (task.mySubmission) {
                allSubmissions.push({
                  ...task.mySubmission,
                  taskId: task._id,
                  taskName: task.name,
                  projectName: project.name,
                  deadline: task.dueDate,
                  isCompleted: task.isCompleted,
                });
              }
            }
          } catch (err) {
            console.error('Error fetching tasks for project:', err);
          }
        }

        setSubmissions(allSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusText = (submission) => {
    if (submission.isCompleted) return 'Completed';
    if (submission.status === 'evaluated') return 'Graded';
    if (submission.status === 'submitted') return 'Submitted';
    return 'Pending';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="submissions-page">
      <h1 className="page-title">Submissions</h1>

      <Card className="submissions-table-card">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>File</th>
              <th>Submitted</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No submissions yet. Submit tasks from the Tasks page.</td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
                <tr key={submission._id || index}>
                  <td className="submission-name">{submission.taskName}</td>
                  <td className="project-name">{submission.projectName}</td>
                  <td>
                    <a href={`${SERVER_URL}${submission.fileUrl}`} target="_blank" rel="noopener noreferrer" className="file-link">
                      {submission.fileUrl.split('/').pop()}
                    </a>
                  </td>
                  <td className="submitted-date">{formatDate(submission.createdAt)}</td>
                  <td className="marks">{submission.marks !== null ? submission.marks : '-'}</td>
                  <td>
                    <StatusBadge status={getStatusText(submission)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Submissions;
