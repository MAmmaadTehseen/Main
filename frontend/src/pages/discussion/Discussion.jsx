import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, advisorAPI, discussionAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { MdSend } from 'react-icons/md';
import './Discussion.css';

const Discussion = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchProjectAndMessages = async () => {
      try {
        let projectsRes;
        if (user?.role === 'advisor') {
          projectsRes = await advisorAPI.getProjects();
        } else {
          projectsRes = await studentAPI.getProjects();
        }

        const projects = projectsRes.data;
        if (projects.length > 0) {
          // Check for project parameter in URL
          const urlProjectId = searchParams.get('project');
          let selectedProjectId = urlProjectId;

          // Verify the project exists in user's projects
          const selectedProject = projects.find(p => p._id === urlProjectId);
          if (!selectedProject) {
            selectedProjectId = projects[0]._id;
            setProjectName(projects[0].name);
          } else {
            setProjectName(selectedProject.name);
          }

          setProjectId(selectedProjectId);

          const messagesRes = await discussionAPI.getMessages(selectedProjectId);
          setMessages(messagesRes.data);
        }
      } catch (error) {
        console.error('Error fetching discussion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndMessages();
  }, [user?.role, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !projectId) return;

    setSending(true);
    try {
      await discussionAPI.postMessage(projectId, { message: newMessage });

      // Refresh messages
      const messagesRes = await discussionAPI.getMessages(projectId);
      setMessages(messagesRes.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getRoleColor = (role) => {
    return role === 'advisor' ? 'advisor' : 'student';
  };

  const getRoleLabel = (sender) => {
    const role = sender.role === 'advisor' ? 'Advisor' : 'Student';
    return `${role} (${sender.name})`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="discussion-page">
      <h1 className="page-title">Discussion Board{projectName && ` - ${projectName}`}</h1>

      <Card className="discussion-card">
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="message">
                <span className={`message-sender ${getRoleColor(msg.sender?.role)}`}>
                  {getRoleLabel(msg.sender)}
                </span>
                <p className="message-text">{msg.message}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending || !projectId}
          />
          <button type="submit" disabled={sending || !newMessage.trim() || !projectId}>
            <MdSend />
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Discussion;
