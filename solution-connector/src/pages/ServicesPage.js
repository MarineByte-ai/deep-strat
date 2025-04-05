import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  // Services data
  const services = [
    {
      id: 'tech-stack',
      title: 'Tech Stack Evaluation',
      description: 'Comprehensive assessment of your technology stack to identify gaps and opportunities for optimization.',
      icon: '🔍'
    },
    {
      id: 'survey',
      title: 'Survey',
      description: 'Customized surveys to gather insights from your customers, employees, or stakeholders.',
      icon: '📊'
    },
    {
      id: 'deployment',
      title: 'Deployment Consultancy',
      description: 'Expert guidance on deploying new systems and solutions within your organization.',
      icon: '🚀'
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
              <Link to="/solutions" className="nav-link">Solutions</Link>
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
            Our Services
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
            We provide expert consultancy and support services to ensure successful implementation 
            and ongoing optimization of your business solutions.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          {services.map((service, index) => (
            <div 
              key={service.id}
              style={{ 
                marginBottom: index !== services.length - 1 ? '3rem' : 0,
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  flex: '1 1 300px',
                  padding: '3rem',
                  backgroundColor: index % 2 === 0 ? '#f0f4f8' : '#fff'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {service.icon}
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    {service.title}
                  </h2>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#4a5568' }}>
                    {service.description}
                  </p>
                  <Link 
                    to={`/services/${service.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#4299e1',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    Learn More
                  </Link>
                </div>
                <div style={{ 
                  flex: '1 1 300px',
                  minHeight: '300px',
                  backgroundColor: index % 2 === 0 ? '#e2e8f0' : '#f0f4f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem'
                }}>
                  <p style={{ 
                    fontSize: '1.2rem', 
                    fontStyle: 'italic',
                    color: '#4a5568',
                    textAlign: 'center',
                    maxWidth: '400px'
                  }}>
                    "Our {service.title.toLowerCase()} service has helped businesses 
                    achieve significant improvements in their operations and performance."
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 0',
        backgroundColor: '#2d3748',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
            Ready to transform your business?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Contact us today to learn how our services can help you overcome challenges 
            and achieve your business goals.
          </p>
          <Link 
            to="/contact"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#4299e1',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.3s'
            }}
          >
            Get in Touch
          </Link>
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

export default ServicesPage; 