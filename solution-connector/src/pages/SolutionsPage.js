import React from 'react';
import { Link } from 'react-router-dom';

const SolutionsPage = () => {
  // Solution card data
  const solutions = [
    {
      id: 'finance',
      title: 'Finance Planning',
      description: 'Strategic financial planning and management solutions for businesses of all sizes.',
      icon: '💰'
    },
    {
      id: 'hr',
      title: 'HR Solutions',
      description: 'Comprehensive human resources management systems and tools.',
      icon: '👥'
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Streamline and optimize your business operations for maximum efficiency.',
      icon: '⚙️'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Management',
      description: 'End-to-end enterprise resource planning and management systems.',
      icon: '🏢'
    },
    {
      id: 'accounting',
      title: 'Accounting',
      description: 'Advanced accounting software and financial reporting tools.',
      icon: '📊'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect your business with cutting-edge cybersecurity solutions.',
      icon: '🔒'
    },
    {
      id: 'networking',
      title: 'Networking',
      description: 'Robust networking infrastructure and management solutions.',
      icon: '🌐'
    }
  ];

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">Solution Connector</Link>
          <nav className="nav">
            <div className="nav-item">
              <Link to="/industries" className="nav-link">Industries</Link>
            </div>
            <div className="nav-item">
              <span className="nav-link">Solutions</span>
              <div className="dropdown">
                <Link to="/solutions/finance" className="dropdown-item">Finance planning</Link>
                <Link to="/solutions/hr" className="dropdown-item">HR</Link>
                <Link to="/solutions/operations" className="dropdown-item">Operations</Link>
                <Link to="/solutions/enterprise" className="dropdown-item">Enterprise Management</Link>
                <Link to="/solutions/accounting" className="dropdown-item">Accounting</Link>
                <Link to="/solutions/cybersecurity" className="dropdown-item">Cybersecurity</Link>
                <Link to="/solutions/networking" className="dropdown-item">Networking</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link to="/services" className="nav-link">Our services</Link>
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
            Our Solutions
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
            We offer a comprehensive suite of business solutions designed to address
            your unique challenges and help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {solutions.map(solution => (
              <div 
                key={solution.id}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '2rem',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                className="solution-card"
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {solution.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {solution.title}
                </h3>
                <p style={{ 
                  color: '#4a5568', 
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {solution.description}
                </p>
                <div style={{ textAlign: 'center' }}>
                  <Link 
                    to={`/solutions/${solution.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
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

export default SolutionsPage; 