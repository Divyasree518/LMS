import React, { useState, useEffect } from 'react';
import '../styles/ai-assistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('vemuChatHistory');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('vemuChatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const userMessage = { type: 'user', text: input, timestamp: new Date() };
      setMessages([...messages, userMessage]);
      
      // Simple AI response (mock)
      setTimeout(() => {
        const aiResponse = {
          type: 'ai',
          text: `I understood: "${input}". How can I help you further?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
      
      setInput('');
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('vemuChatHistory');
  };

  return (
    <>
      {/* AI Chat Button */}
      <button 
        className="ai-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
        aria-label="Open AI Assistant"
      >
        🤖
      </button>

      {/* AI Chat Panel */}
      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span>🤖 Vemu AI Helper</span>
            <button 
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-messages">
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <p>Hello! I'm here to help. Ask me anything about the library system.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`ai-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything... (English/Telugu)"
              maxLength="500"
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleClearHistory} className="ai-clear-btn">Clear</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
