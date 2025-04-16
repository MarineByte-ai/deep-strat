import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message.trim();
    if (!userMessage) return;

    // Add user message immediately
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setMessage('');
    setIsLoading(true);

    // --- Replace Simulation with API Call ---
    try {
      const response = await fetch('http://localhost:5000/api/rag/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.answer || "Sorry, I couldn't find an answer.";

      // Add AI response
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Add more specific error message to chat
      const displayError = error.message || "An unknown error occurred. Check the console.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: `Error: ${displayError}` }]);
    } finally {
      setIsLoading(false);
    }
    // --- End API Call ---
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">Solution Connector</div>
          <nav className="nav">
            <div className="nav-item">
              <span className="nav-link">Industries</span>
              <div className="dropdown">
                <Link to="/industries/financial-services" className="dropdown-item">Financial Services</Link>
                <Link to="/industries/healthcare" className="dropdown-item">Healthcare</Link>
                <Link to="/industries/legal-services" className="dropdown-item">Legal Services</Link>
                <Link to="/industries/high-tech" className="dropdown-item">High Tech</Link>
                <Link to="/industries/pharmaceutical" className="dropdown-item">Pharmaceutical</Link>
                <Link to="/industries/manufacturing" className="dropdown-item">Manufacturing</Link>
                <Link to="/industries/construction" className="dropdown-item">Construction</Link>
                <Link to="/industries/oil-gas" className="dropdown-item">Oil & Gas</Link>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link">Solutions</span>
              <div className="dropdown">
                <Link to="/solutions/finance" className="dropdown-item">Finance</Link>
                <Link to="/solutions/hr" className="dropdown-item">HR</Link>
                <Link to="/solutions/networking" className="dropdown-item">Networking</Link>
                <Link to="/solutions/cyber-security" className="dropdown-item">Cyber Security</Link>
                <Link to="/solutions/ai-productivity" className="dropdown-item">AI Productivity</Link>
                <Link to="/solutions/creative-design" className="dropdown-item">Creative & Design</Link>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link">Our services</span>
              <div className="dropdown">
                <Link to="/services/tech-stack" className="dropdown-item">Tech stack evaluation</Link>
                <Link to="/services/survey" className="dropdown-item">Survey</Link>
                <Link to="/services/deployment" className="dropdown-item">Deployment consultancy</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link to="/company" className="nav-link">Company</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Solutions for Your Business Challenges
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
            We help businesses connect with the right solutions for their unique challenges. 
            Our expert team specializes in matching problems with innovative solutions.
          </p>
        </div>
      </section>

      {/* Chat Container */}
      <section className="chat-container">
        <div className="container">
          <h2 style={{ marginBottom: '1.5rem' }}>AI Chat Interface</h2>
          <p style={{ marginBottom: '2rem' }}>
            Use our AI chat box to interact with the RAG database and find solutions for your business.
          </p>
          
          <div className="chat-box">
            <div className="chat-header">
              Solution Connector AI Assistant
            </div>
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div style={{ padding: '1rem', color: '#718096', textAlign: 'center' }}>
                  Ask a question to get started!
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    style={{
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                      margin: '0.5rem 0',
                      padding: '0.5rem 1rem',
                      backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#f0f4f8',
                      borderRadius: '8px',
                      maxWidth: '80%',
                      marginLeft: msg.sender === 'user' ? 'auto' : '0',
                      marginRight: msg.sender === 'user' ? '0' : 'auto',
                    }}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              {isLoading && (
                <div style={{ padding: '0.5rem 1rem', textAlign: 'left', color: '#718096' }}>
                  <i>Thinking...</i>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-column">
            <h3>About Us</h3>
            <Link to="/about" className="footer-link">Our Story</Link>
            <Link to="/team" className="footer-link">Our Team</Link>
            <Link to="/careers" className="footer-link">Careers</Link>
          </div>
          <div className="footer-column">
            <h3>Industries</h3>
            <Link to="/industries/financial-services" className="footer-link">Financial Services</Link>
            <Link to="/industries/healthcare" className="footer-link">Healthcare</Link>
            <Link to="/industries/technology" className="footer-link">Technology</Link>
          </div>
          <div className="footer-column">
            <h3>Solutions</h3>
            <Link to="/solutions/finance" className="footer-link">Finance Planning</Link>
            <Link to="/solutions/hr" className="footer-link">HR</Link>
            <Link to="/solutions/cybersecurity" className="footer-link">Cybersecurity</Link>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <Link to="/contact" className="footer-link">Support</Link>
            <Link to="/sales" className="footer-link">Sales</Link>
            <Link to="/locations" className="footer-link">Locations</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Solution Connector. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 