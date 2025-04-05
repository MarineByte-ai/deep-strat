import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi'; // Import icons

// Minimal industry data
const industryData = {
  'financial-services': { 
    name: 'Financial Services',
    description: 'Enterprise solutions for banking, investment, insurance, and financial institutions',
    keyFeatures: ['Regulatory compliance', 'Risk management', 'Customer experience', 'Data security']
  },
  'healthcare': { 
    name: 'Healthcare',
    description: 'Solutions for hospitals, clinics, and healthcare providers',
    keyFeatures: ['Patient data management', 'Compliance', 'Operational efficiency', 'Care coordination']
  },
  'legal-services': { 
    name: 'Legal Services',
    description: 'Technology for law firms and legal departments',
    keyFeatures: ['Document management', 'Case workflow', 'Time tracking', 'Compliance']
  },
  'high-tech': { 
    name: 'High Tech',
    description: 'Solutions for software, hardware, and technology companies',
    keyFeatures: ['Product development', 'Innovation cycles', 'Technical integration', 'Scalability']
  },
  'pharmaceutical': { 
    name: 'Pharmaceutical',
    description: 'Solutions for drug development and manufacturing',
    keyFeatures: ['Research data management', 'Regulatory compliance', 'Supply chain', 'Quality control']
  },
  'manufacturing': { 
    name: 'Manufacturing',
    description: 'Systems for production and operations management',
    keyFeatures: ['Supply chain', 'Quality control', 'Production planning', 'Resource management']
  },
  'construction': { 
    name: 'Construction',
    description: 'Project and resource management for construction',
    keyFeatures: ['Project planning', 'Resource allocation', 'Cost estimation', 'Contractor management']
  },
  'oil-gas': { 
    name: 'Oil & Gas',
    description: 'Solutions for energy exploration and distribution',
    keyFeatures: ['Operations safety', 'Asset management', 'Compliance', 'Supply chain']
  }
};

// Solutions by industry
const solutionsByIndustry = {
  'financial-services': ['finance', 'cyber-security', 'ai-productivity'],
  'healthcare': ['networking', 'cyber-security', 'ai-productivity'],
  'legal-services': ['creative-design', 'ai-productivity'],
  'high-tech': ['networking', 'cyber-security', 'creative-design'],
  'pharmaceutical': ['ai-productivity', 'networking'],
  'manufacturing': ['ai-productivity', 'networking', 'finance'],
  'construction': ['finance', 'hr'],
  'oil-gas': ['cyber-security', 'networking', 'ai-productivity']
};

// Solution names and descriptions
const solutionData = {
  'finance': {
    name: 'Finance',
    description: 'Financial planning, reporting, and management systems'
  },
  'hr': {
    name: 'HR',
    description: 'Human resources and talent management solutions'
  },
  'networking': {
    name: 'Networking',
    description: 'Secure and scalable network infrastructure services'
  },
  'cyber-security': {
    name: 'Cyber Security',
    description: 'Advanced threat protection and security systems'
  },
  'ai-productivity': {
    name: 'AI Productivity',
    description: 'Intelligent automation and workflow optimization'
  },
  'creative-design': {
    name: 'Creative & Design',
    description: 'Digital asset management and creative workflows'
  }
};

const IndustryDetailPage = () => {
  const { industrySlug } = useParams();
  const industry = industryData[industrySlug] || {
    name: 'Industry Not Found',
    description: '',
    keyFeatures: []
  };
  const solutions = solutionsByIndustry[industrySlug] || [];

  if (!industryData[industrySlug]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Industry Not Found</h1>
          <p className="text-gray-500 mb-6">The requested industry page could not be found.</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simplified Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-lg font-bold text-blue-700 hover:text-blue-800">
              Solution Connector
            </Link>
            <nav>
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Refined Hero section */}
      <div className="bg-blue-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight mb-3">{industry.name}</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">{industry.description}</p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Key Features & CTA */}
          <div className="lg:col-span-1 space-y-8">
            {/* Key features section - Improved Layout */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Key Solution Areas</h2>
              <div className="bg-white rounded-lg shadow p-6 space-y-3">
                {industry.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA section - Integrated */}
            <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Looking for customized solutions?</h2>
              <p className="text-blue-100 text-sm mb-4">Contact our team to discuss your specific requirements.</p>
              <Link
                to="/" // Assuming contact goes to home for now
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                Contact Us <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Right Column: Solutions */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Relevant Enterprise Solutions</h2>
              {solutions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {solutions.map(solutionSlug => {
                    const solution = solutionData[solutionSlug];
                    if (!solution) return null; // Handle case where solution data might be missing
                    return (
                      <Link
                        key={solutionSlug}
                        to={`/solutions/${solutionSlug}`}
                        className="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-gray-100"
                      >
                        <div className="p-5 flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{solution.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{solution.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4 mt-auto border-t border-gray-100">
                           <div className="text-blue-600 font-medium flex items-center text-sm group-hover:underline">
                            Learn more
                            <FiArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                 <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No specific solutions listed for this industry yet.
                 </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">© {new Date().getFullYear()} Solution Connector. All rights reserved.</p>
            <Link to="/" className="text-sm text-blue-600 hover:underline">Back to Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndustryDetailPage; 