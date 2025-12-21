/**
 * Submissions Component
 * Displays student's task submissions with grading status
 * Shows submitted files, grades, and submission timeline
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, SERVER_URL } from "../../services/api";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import "./Submissions.css";

/**
 * Submissions - React component for viewing student submissions
 *
 * State:
 * - submissions: Array of submission objects with task and project details
 * - loading: Boolean flag for data loading state
 *
 * Effects:
 * - Fetches student's projects and all their tasks' submissions on mount
 * - Aggregates submissions across all projects
 */
const Submissions = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // State for all student submissions
  const [submissions, setSubmissions] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all student submissions
   * Retrieves projects, then tasks, then filters submitted tasks
   */
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Get all projects student is enrolled in
        const projectsRes = await studentAPI.getProjects();
        const projects = projectsRes.data;

        const allSubmissions = [];

        // Iterate through projects to find submissions
        for (const project of projects) {
          try {
            // Get all tasks for this project
            const tasksRes = await studentAPI.getProjectTasks(project._id);
            const tasks = tasksRes.data;

            // Collect submitted tasks only
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
            console.error("Error fetching tasks for project:", err);
          }
        }

        // Update submissions state
        setSubmissions(allSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    // Execute fetch on component mount
    fetchSubmissions();
  }, []);

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "15 Jan 2024")
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * Get status text for submission display
   * @param {Object} submission - Submission object
   * @returns {string} Status text
   */
  const getStatusText = (submission) => {
    if (submission.isCompleted) return "Completed";
    if (submission.status === "evaluated") return "Graded";
    if (submission.status === "submitted") return "Submitted";
    return "Pending";
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="submissions-page">
      {/* Page title */}
      <h1 className="page-title">Submissions</h1>

      {/* Submissions table */}
      <Card className="submissions-table-card">
        <table className="submissions-table">
          {/* Table header with column titles */}
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

          {/* Table body with submissions or empty message */}
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No submissions yet. Submit tasks from the Tasks page.
                </td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
                <tr key={submission._id || index}>
                  {/* Task Name Column */}
                  <td className="submission-name">{submission.taskName}</td>

                  {/* Project Name Column */}
                  <td className="project-name">{submission.projectName}</td>

                  {/* Submitted File Column with download link */}
                  <td>
                    <a
                      href={`${SERVER_URL}${submission.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {submission.fileUrl.split("/").pop()}
                    </a>
                  </td>

                  {/* Submission Date Column */}
                  <td className="submitted-date">
                    {formatDate(submission.createdAt)}
                  </td>

                  {/* Marks/Grade Column */}
                  <td className="marks">
                    {submission.marks !== null ? submission.marks : "-"}
                  </td>

                  {/* Status Badge Column */}
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
