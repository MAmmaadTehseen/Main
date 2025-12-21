/**
 * Tasks Component
 * Displays all tasks for student and advisor views
 * Students can upload task submissions; advisors can view all tasks
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, advisorAPI, SERVER_URL } from "../../services/api";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import {
  MdPictureAsPdf,
  MdInsertDriveFile,
  MdCloudUpload,
  MdCheckCircle,
} from "react-icons/md";
import "./Tasks.css";

/**
 * Tasks - React component for task management and submission
 *
 * State:
 * - tasks: Array of all task objects across projects
 * - loading: Boolean flag for data loading state
 * - uploading: Task ID currently being uploaded (null if none)
 * - selectedFiles: Object mapping taskId to selected File objects
 * - fileInputRefs: Ref to file input elements for triggering file dialog
 *
 * Effects:
 * - Fetches all tasks for user's projects on mount
 * - Fetches from advisor or student API based on user role
 */
const Tasks = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // State for all tasks from user's projects
  const [tasks, setTasks] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // State for currently uploading task (null if none)
  const [uploading, setUploading] = useState(null);

  // State for files selected but not yet uploaded
  const [selectedFiles, setSelectedFiles] = useState({});

  // Refs to hidden file input elements
  const fileInputRefs = useRef({});

  /**
   * Fetch all tasks across user's projects
   * Aggregates tasks from student or advisor endpoints
   */
  const fetchTasks = async () => {
    try {
      // Get projects based on user role
      let projectsRes;
      if (user?.role === "advisor") {
        projectsRes = await advisorAPI.getProjects();
      } else {
        projectsRes = await studentAPI.getProjects();
      }

      const projects = projectsRes.data;
      const allTasks = [];

      // Iterate through projects to fetch tasks
      for (const project of projects) {
        try {
          // Fetch tasks for this project
          let tasksRes;
          if (user?.role === "advisor") {
            tasksRes = await advisorAPI.getProjectTasks(project._id);
          } else {
            tasksRes = await studentAPI.getProjectTasks(project._id);
          }

          // Enrich tasks with project and advisor information
          const projectTasks = tasksRes.data.map((task) => ({
            ...task,
            projectName: project.name,
            advisorName:
              project.advisors?.map((a) => a.name).join(", ") || "N/A",
          }));

          allTasks.push(...projectTasks);
        } catch (err) {
          console.error("Error fetching tasks for project:", err);
        }
      }

      // Update tasks state with all aggregated tasks
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch tasks on component mount or when user role changes
   */
  useEffect(() => {
    fetchTasks();
  }, [user?.role]);

  /**
   * Handle file selection for a task
   * @param {string} taskId - ID of the task
   * @param {File} file - Selected file object
   */
  const handleFileSelect = (taskId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [taskId]: file }));
  };

  /**
   * Submit a task with uploaded file
   * @param {string} taskId - ID of the task to submit
   */
  const handleSubmitTask = async (taskId) => {
    // Validate file selection
    const file = selectedFiles[taskId];
    if (!file) {
      alert("Please select a file first");
      return;
    }

    // Mark task as uploading
    setUploading(taskId);
    try {
      // Prepare form data with file
      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("file", file);

      // Submit task via API
      await studentAPI.submitTask(formData);

      // Clear the selected file and refresh tasks
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[taskId];
        return newFiles;
      });

      // Refresh tasks list
      await fetchTasks();
      alert("Task submitted successfully!");
    } catch (error) {
      console.error("Error submitting task:", error);
      alert(error.response?.data?.message || "Failed to submit task");
    } finally {
      setUploading(null);
    }
  };

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "15 January 2024")
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /**
   * Get status text for task display
   * @param {Object} task - Task object
   * @returns {string} Status text
   */
  const getStatusText = (task) => {
    if (task.isCompleted) return "Completed";
    if (task.mySubmission) return "Submitted";
    if (task.isDone) return "Approve";
    return "Pending";
  };

  // Check if current user is a student
  const isStudent = user?.role === "student";

  /**
   * Get appropriate file icon based on file extension
   * @param {string} fileUrl - File URL path
   * @returns {JSX.Element} File icon component or null
   */
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    if (extension === "pdf") return <MdPictureAsPdf />;
    return <MdInsertDriveFile />;
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tasks-page">
      {/* Page title */}
      <h1 className="page-title">Tasks</h1>

      {/* Tasks grid or empty message */}
      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="no-data">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="task-card">
              {/* Task header with title and instructions */}
              <div className="task-header">
                <div className="task-info">
                  <h2 className="task-title">{task.name}</h2>
                  <p className="task-description">{task.instructions}</p>
                  <p className="task-advisor">Advisor: {task.advisorName}</p>
                </div>

                {/* Task attachment file (if provided) */}
                {task.fileUrl && (
                  <a
                    href={`${SERVER_URL}${task.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="task-file"
                  >
                    {getFileIcon(task.fileUrl)}
                    <span>
                      {task.fileUrl.split("/").pop() || "instructions.pdf"}
                    </span>
                  </a>
                )}
              </div>

              {/* Student File Upload Section (only for students and incomplete tasks) */}
              {isStudent && !task.isCompleted && (
                <div className="task-upload-section">
                  {task.mySubmission ? (
                    // Display already submitted file
                    <div className="submission-info">
                      <MdCheckCircle className="submitted-icon" />
                      <span>
                        Submitted:{" "}
                        {task.mySubmission.fileUrl?.split("/").pop() || "File"}
                      </span>
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
                    // File upload controls for new submission
                    <div className="upload-controls">
                      <input
                        type="file"
                        id={`file-${task._id}`}
                        ref={(el) => (fileInputRefs.current[task._id] = el)}
                        onChange={(e) =>
                          handleFileSelect(task._id, e.target.files[0])
                        }
                        style={{ display: "none" }}
                      />
                      <button
                        className="select-file-btn"
                        onClick={() => fileInputRefs.current[task._id]?.click()}
                        disabled={uploading === task._id}
                      >
                        <MdCloudUpload />
                        {selectedFiles[task._id]
                          ? selectedFiles[task._id].name
                          : "Select File"}
                      </button>
                      <button
                        className="submit-btn"
                        onClick={() => handleSubmitTask(task._id)}
                        disabled={
                          !selectedFiles[task._id] || uploading === task._id
                        }
                      >
                        {uploading === task._id ? "Uploading..." : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Task footer with dates and status */}
              <div className="task-footer">
                <div className="task-dates">
                  <div className="date-item">
                    <span className="date-label">Assigned</span>
                    <span className="date-value">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Due</span>
                    <span className="date-value">
                      {formatDate(task.dueDate)}
                    </span>
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
