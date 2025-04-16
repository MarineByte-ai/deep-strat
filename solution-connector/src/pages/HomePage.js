import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const eventSourceRef = useRef(null);
  
  // Style for typing indicator
  const typingIndicatorStyle = {
    display: 'inline-block',
    marginLeft: '3px',
    animation: 'blink 1s infinite',
  };
  
  // CSS keyframes for blinking animation
  useEffect(() => {
    // Add keyframe animation to head if it doesn't exist
    if (!document.querySelector('#typing-animation')) {
      const style = document.createElement('style');
      style.id = 'typing-animation';
      style.innerHTML = `
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message.trim();
    if (!userMessage) return;

    // Add user message immediately
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setMessage('');
    setIsLoading(true);
    setStreamingResponse('');

    // Add initial empty AI message that will be updated during streaming
    setChatMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    // Clean up previous event source if it exists
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Make a POST request with the correct content type
      const response = await fetch('http://localhost:5000/api/rag/ask/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Set up streaming with ReadableStream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Function to process chunks of data
      const processStream = async () => {
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            // Stream is complete
            setIsLoading(false);
            break;
          }
          
          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          const messages = buffer.split('\n\n');
          buffer = messages.pop() || ''; // Keep the last incomplete chunk in the buffer
          
          for (const message of messages) {
            if (message.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(message.substring(6));
                
                // Update the streaming response
                setStreamingResponse(jsonData.answer);
                
                // Update the last message in the chat
                setChatMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { 
                    sender: 'ai', 
                    text: jsonData.answer 
                  };
                  return newMessages;
                });
                
                // If finished, mark as not loading
                if (jsonData.finished) {
                  setIsLoading(false);
                }
              } catch (error) {
                console.error("Error parsing SSE data:", error, message);
              }
            }
          }
        }
      };
      
      // Start processing the stream
      processStream().catch(error => {
        console.error("Error processing stream:", error);
        setIsLoading(false);
        
        // Update the AI message with an error
        setChatMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          // Only update if it's empty (no partial response was received)
          if (lastMessage.sender === 'ai' && !lastMessage.text) {
            newMessages[newMessages.length - 1] = { 
              sender: 'ai', 
              text: 'Error: Problem processing the response stream.' 
            };
          }
          return newMessages;
        });
      });
      
    } catch (error) {
      console.error("Error setting up streaming:", error);
      // Add more specific error message to chat
      const displayError = error.message || "An unknown error occurred. Check the console.";
      
      // Replace the empty AI message with an error message
      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          sender: 'ai', 
          text: `Error: ${displayError}` 
        };
        return newMessages;
      });
      
      setIsLoading(false);
    }
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
                    {msg.sender === 'ai' && isLoading && index === chatMessages.length - 1 && (
                      <span style={typingIndicatorStyle}>▌</span>
                    )}
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Send'}
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