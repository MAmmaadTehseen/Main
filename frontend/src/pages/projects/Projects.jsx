/**
 * Projects Component
 * Displays a list of all projects (student or advisor views)
 * Shows project details, assigned advisor, and progress tracking
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, advisorAPI, progressAPI } from "../../services/api";
import Card from "../../components/common/Card";
import ProgressCircle from "../../components/common/ProgressCircle";
import "./Projects.css";

/**
 * Projects - React component for displaying projects
 *
 * State:
 * - projects: Array of project objects with progress
 * - loading: Boolean flag for data loading state
 *
 * Effects:
 * - Fetches projects based on user role (student or advisor)
 * - Calculates progress percentage for each project
 */
const Projects = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // State for projects list with progress data
  const [projects, setProjects] = useState([]);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  /**
   * Fetch projects on component mount or when user role changes
   * Retrieves projects based on user role and fetches progress for each
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects based on user role
        let response;
        if (user?.role === "advisor") {
          // Advisors see their assigned projects
          response = await advisorAPI.getProjects();
        } else {
          // Students see projects they're enrolled in
          response = await studentAPI.getProjects();
        }

        const projectsData = response.data;

        // Fetch and calculate progress for each project
        const projectsWithProgress = await Promise.all(
          projectsData.map(async (project) => {
            try {
              // Get progress percentage for the project
              const progressRes = await progressAPI.getProjectProgress(
                project._id
              );
              return {
                ...project,
                progress: progressRes.data.completionPercentage || 0,
              };
            } catch {
              // Default to 0% progress if fetch fails
              return { ...project, progress: 0 };
            }
          })
        );

        // Update projects state with progress data
        setProjects(projectsWithProgress);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch projects when component mounts or user role changes
    fetchProjects();
  }, [user?.role]);

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="projects-page">
      {/* Page title */}
      <h1 className="page-title">Projects</h1>

      {/* Projects grid or empty message */}
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-data">No projects found.</p>
        ) : (
          projects.map((project) => (
            <Card key={project._id} className="project-card">
              {/* Project header with title and description */}
              <div className="project-header">
                <h2 className="project-title">{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <p className="project-advisor">
                  Advisor:{" "}
                  {project.advisors?.map((a) => a.name).join(", ") || "N/A"}
                </p>
              </div>

              {/* Project footer with info and progress circle */}
              <div className="project-footer">
                {/* Project information */}
                <div className="project-info">
                  <div className="info-item">
                    <span className="info-label">Batch</span>
                    <span className="info-value">{project.batch || "23"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Department</span>
                    <span className="info-value">
                      {project.department || "Computer Science"}
                    </span>
                  </div>
                </div>

                {/* Progress visualization */}
                <div className="project-progress">
                  <ProgressCircle
                    percentage={project.progress}
                    size={80}
                    strokeWidth={8}
                  />
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
