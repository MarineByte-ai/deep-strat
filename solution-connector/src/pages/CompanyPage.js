import React from 'react';
import { Link } from 'react-router-dom';

const CompanyPage = () => {
  // Team member data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      title: 'CEO & Founder',
      bio: 'With over 15 years of experience in technology consulting, Sarah founded Solution Connector to help businesses find the right solutions for their unique challenges.',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      name: 'Michael Chen',
      title: 'CTO',
      bio: 'Michael leads our technology team with a focus on innovative solutions and cutting-edge technologies that solve real business problems.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Jessica Williams',
      title: 'Director of Consulting',
      bio: 'Jessica has helped hundreds of businesses implement successful technology solutions throughout her 12-year consulting career.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      name: 'David Rodriguez',
      title: 'Head of Customer Success',
      bio: 'David ensures our clients receive exceptional support and achieve their desired outcomes with our solutions.',
      image: 'https://randomuser.me/api/portraits/men/46.jpg'
    }
  ];

  // Values data
  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from the solutions we recommend to the service we provide.',
      icon: '⭐'
    },
    {
      title: 'Innovation',
      description: 'We continuously seek innovative approaches to solve complex business challenges.',
      icon: '💡'
    },
    {
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical business practices in all our relationships.',
      icon: '🤝'
    },
    {
      title: 'Customer Focus',
      description: 'We put our customers at the center of everything we do, ensuring their success is our success.',
      icon: '👥'
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
              <Link to="/services" className="nav-link">Our services</Link>
            </div>
            <div className="nav-item">
              <span className="nav-link">Company</span>
              <div className="dropdown">
                <Link to="/company/about" className="dropdown-item">About Us</Link>
                <Link to="/company/team" className="dropdown-item">Our Team</Link>
                <Link to="/company/careers" className="dropdown-item">Careers</Link>
                <Link to="/company/contact" className="dropdown-item">Contact</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            About Our Company
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px' }}>
            Solution Connector is a leading technology consulting firm dedicated to
            helping businesses find and implement the right solutions for their unique challenges.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Story</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#4a5568', lineHeight: '1.7' }}>
                Founded in 2010, Solution Connector began with a simple mission: to help businesses 
                navigate the increasingly complex technology landscape and find solutions that truly 
                address their needs.
              </p>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#4a5568', lineHeight: '1.7' }}>
                Over the years, we've grown from a small team of consultants to a comprehensive 
                solution provider serving clients across multiple industries worldwide. Our success 
                comes from our commitment to understanding each client's unique challenges and 
                delivering tailored solutions that drive real business value.
              </p>
              <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.7' }}>
                Today, Solution Connector continues to innovate and expand our offerings, 
                always keeping our focus on what matters most—helping our clients succeed.
              </p>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ 
                width: '100%',
                height: '300px',
                backgroundColor: '#e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>
                  "Our mission is to bridge the gap between business challenges and technology solutions."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f7fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Our Values</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {values.map((value, index) => (
              <div key={index} style={{ 
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{value.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ color: '#4a5568' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Our Leadership Team</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {teamMembers.map((member, index) => (
              <div key={index} style={{ 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <img 
                  src={member.image} 
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{member.name}</h3>
                  <p style={{ fontSize: '1.1rem', color: '#4299e1', marginBottom: '1rem' }}>{member.title}</p>
                  <p style={{ color: '#4a5568' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
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
            Join Our Team
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            We're always looking for talented individuals who share our values and passion
            for helping businesses succeed with technology.
          </p>
          <Link 
            to="/careers"
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
            View Open Positions
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

export default CompanyPage; 