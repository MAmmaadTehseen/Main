/**
 * Discussion Component
 * Project discussion board for collaboration between students and advisors
 * Allows real-time messaging within project contexts
 */

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, advisorAPI, discussionAPI } from "../../services/api";
import Card from "../../components/common/Card";
import { MdSend } from "react-icons/md";
import "./Discussion.css";

/**
 * Discussion - React component for project discussion board
 *
 * State:
 * - messages: Array of message objects with sender and timestamp
 * - newMessage: String for message input field
 * - projectId: Current selected project ID
 * - projectName: Name of current selected project
 * - loading: Boolean flag for data loading state
 * - sending: Boolean flag for message sending state
 * - messagesEndRef: Ref for auto-scroll to bottom
 *
 * Effects:
 * - Fetches project and messages on mount and when URL params change
 * - Auto-scrolls to bottom when new messages arrive
 */
const Discussion = () => {
  // Get current authenticated user from context
  const { user } = useAuth();

  // Get URL search parameters (project ID if provided)
  const [searchParams, setSearchParams] = useSearchParams();

  // State for projects list
  const [projects, setProjects] = useState([]);

  // State for messages list
  const [messages, setMessages] = useState([]);

  // State for message input
  const [newMessage, setNewMessage] = useState("");

  // State for selected project
  const [projectId, setProjectId] = useState(null);

  // State for selected project name
  const [projectName, setProjectName] = useState("");

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // State for message sending indicator
  const [sending, setSending] = useState(false);

  // Ref to last message element for auto-scroll
  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to bottom of messages container
   * Called whenever messages are updated
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Fetch projects and messages on component mount or when params change
   * Selects first project or URL-specified project
   */
  useEffect(() => {
    const fetchProjectAndMessages = async () => {
      try {
        // Fetch user's projects based on role
        let projectsRes;
        if (user?.role === "advisor") {
          projectsRes = await advisorAPI.getProjects();
        } else {
          projectsRes = await studentAPI.getProjects();
        }

        const projectsData = projectsRes.data;
        setProjects(projectsData);

        if (projectsData.length > 0) {
          // Check for project parameter in URL
          const urlProjectId = searchParams.get("project");
          let selectedProjectId = urlProjectId;

          // Verify the project exists in user's projects
          const selectedProject = projectsData.find(
            (p) => p._id === urlProjectId
          );

          if (!selectedProject) {
            // Default to first project if URL project not found
            selectedProjectId = projectsData[0]._id;
            setProjectName(projectsData[0].name);
            // Update URL to reflect default
            if (!urlProjectId) {
               // We don't force push to URL here to avoid infinite loop implications if not careful,
               // but we could. For now just setting state is enough.
            }
          } else {
            setProjectName(selectedProject.name);
          }

          setProjectId(selectedProjectId);

          // Fetch messages for selected project
          const messagesRes = await discussionAPI.getMessages(
            selectedProjectId
          );
          setMessages(messagesRes.data);
        }
      } catch (error) {
        console.error("Error fetching discussion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndMessages();
  }, [user?.role, searchParams]); // Keep logic simple: refetch if URL changes.

  /**
   * Auto-scroll to bottom whenever messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProjectChange = (newProjectId) => {
    // Update URL which will trigger the useEffect to refetch messages
    setSearchParams({ project: newProjectId });
  };

  /**
   * Handle sending a new message
   * @param {Event} e - Form submit event
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !projectId) return;

    // Mark as sending
    setSending(true);
    try {
      // Post message to API
      await discussionAPI.postMessage(projectId, { message: newMessage });

      // Refresh messages list
      const messagesRes = await discussionAPI.getMessages(projectId);
      setMessages(messagesRes.data);

      // Clear input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      // Mark as not sending
      setSending(false);
    }
  };

  /**
   * Get CSS class for role-based message styling
   * @param {string} role - User role (advisor or student)
   * @returns {string} CSS class name
   */
  const getRoleColor = (role) => {
    return role === "advisor" ? "advisor" : "student";
  };

  /**
   * Get formatted role label with user name
   * @param {Object} sender - Sender object with role and name
   * @returns {string} Formatted label (e.g., "Advisor (John Doe)")
   */
  const getRoleLabel = (sender) => {
    const role = sender.role === "advisor" ? "Advisor" : "Student";
    return `${role} (${sender.name})`;
  };

  // Show loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="discussion-page">
      {/* Page header with title and selector */}
      <div className="page-header">
        <h1 className="page-title">Discussion Board</h1>
        
        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="project-selector-container">
            <select
              value={projectId || ""}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="project-select"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Discussion card with messages and input */}
      <Card className="discussion-card">
        {/* Messages container */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="no-messages">
              No messages yet. Start the conversation in <strong>{projectName}</strong>!
            </p>
          ) : (
            // Messages list
            messages.map((msg) => (
              <div key={msg._id} className="message">
                {/* Message sender label (styled by role) */}
                <span
                  className={`message-sender ${getRoleColor(msg.sender?.role)}`}
                >
                  {getRoleLabel(msg.sender)}
                </span>
                {/* Message text content */}
                <p className="message-text">{msg.message}</p>
              </div>
            ))
          )}
          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input form */}
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={`Message in ${projectName}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending || !projectId}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim() || !projectId}
          >
            <MdSend />
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Discussion;
