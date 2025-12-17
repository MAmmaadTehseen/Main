import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { MdAdd } from 'react-icons/md';
import './Chatbot.css';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  const quickActions = [
    'Show ongoing and completed projects',
    'Show advisor workload and availability',
    'Frequently Asked Questions',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    setConversation(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await chatbotAPI.ask({ question: userMessage });
      setConversation(prev => [...prev, {
        type: 'bot',
        text: response.data.answer,
        pdf: response.data.pdf || null
      }]);
    } catch (error) {
      console.error('Error asking chatbot:', error);
      setConversation(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setQuery(action);
  };

  return (
    <div className="chatbot-page">
      <h1 className="page-title">Chatbot Assistant</h1>

      <Card className="chatbot-card">
        {conversation.length > 0 && (
          <div className="conversation">
            {conversation.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <p>{msg.text}</p>
                {msg.pdf && (
                  <a
                    href={msg.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    📄 View Related Document
                  </a>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <p className="typing">Typing...</p>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        )}

        <div className="chatbot-input-area">
          <form onSubmit={handleSubmit} className="chatbot-form">
            <input
              type="text"
              placeholder="Ask anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              <MdAdd />
            </button>
          </form>
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action)}
              disabled={loading}
            >
              {action}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;
