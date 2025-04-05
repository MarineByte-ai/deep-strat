import React from 'react';
import { Link } from 'react-router-dom';

const IndustriesPage = () => {
  // Industry card data
  const industries = [
    {
      id: 'financial-services',
      title: 'Financial Services',
      description: 'Transformative solutions for banks, investment firms, and insurance companies.',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Innovative technology for hospitals, clinics, and healthcare providers.',
      image: 'https://images.unsplash.com/photo-1581093458791-9d15482ee6b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'technology',
      title: 'Technology',
      description: 'Cutting-edge solutions for tech companies and startups.',
      image: 'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'legal',
      title: 'Legal',
      description: 'Specialized tools for law firms and legal departments.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'retail',
      title: 'Retail',
      description: 'Solutions to transform the retail experience and operations.',
      image: 'https://images.unsplash.com/photo-1513784395104-1df92ae0dc23?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      description: 'Optimize production and supply chain for manufacturing businesses.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
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
              <span className="nav-link">Industries</span>
              <div className="dropdown">
                <Link to="/industries/financial-services" className="dropdown-item">Financial services</Link>
                <Link to="/industries/healthcare" className="dropdown-item">Healthcare</Link>
                <Link to="/industries/technology" className="dropdown-item">Technology</Link>
                <Link to="/industries/legal" className="dropdown-item">Legal</Link>
                <Link to="/industries/retail" className="dropdown-item">Retail</Link>
                <Link to="/industries/manufacturing" className="dropdown-item">Manufacturing</Link>
              </div>
            </div>
            <div className="nav-item">
              <Link to="/solutions" className="nav-link">Solutions</Link>
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
            Industries We Serve
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
            We understand the unique challenges faced by different industries.
            Our tailored solutions address the specific needs of each sector.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {industries.map(industry => (
              <div 
                key={industry.id}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                className="industry-card"
              >
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${industry.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{industry.title}</h3>
                  <p style={{ color: '#4a5568', marginBottom: '1rem' }}>{industry.description}</p>
                  <Link 
                    to={`/industries/${industry.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
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

export default IndustriesPage; 