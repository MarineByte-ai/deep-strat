import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiBriefcase } from 'react-icons/fi';

// Minimal solution data
const solutionData = {
  'finance': { 
    name: 'Finance',
    description: 'Financial planning, reporting, and management systems',
    keyFeatures: ['Budgeting', 'Financial reporting', 'Expense management', 'Revenue forecasting']
  },
  'hr': { 
    name: 'HR',
    description: 'Human resources and talent management solutions',
    keyFeatures: ['Talent acquisition', 'Performance management', 'Benefits administration', 'Employee engagement']
  },
  'networking': { 
    name: 'Networking',
    description: 'Secure and scalable network infrastructure services',
    keyFeatures: ['Network monitoring', 'Infrastructure management', 'Bandwidth optimization', 'Network security']
  },
  'cyber-security': { 
    name: 'Cyber Security',
    description: 'Advanced threat protection and security systems',
    keyFeatures: ['Threat detection', 'Vulnerability management', 'Compliance monitoring', 'Data protection']
  },
  'ai-productivity': { 
    name: 'AI Productivity',
    description: 'Intelligent automation and workflow optimization',
    keyFeatures: ['Workflow automation', 'Predictive analytics', 'Document processing', 'Decision support']
  },
  'creative-design': { 
    name: 'Creative & Design',
    description: 'Digital asset management and creative workflows',
    keyFeatures: ['Asset management', 'Collaboration tools', 'Version control', 'Creative production']
  }
};

// Industries by solution
const industriesBySolution = {
  'finance': ['financial-services', 'manufacturing', 'construction'],
  'hr': ['healthcare', 'construction', 'manufacturing'],
  'networking': ['financial-services', 'healthcare', 'high-tech', 'oil-gas'],
  'cyber-security': ['financial-services', 'healthcare', 'legal-services', 'oil-gas'],
  'ai-productivity': ['financial-services', 'legal-services', 'pharmaceutical', 'high-tech'],
  'creative-design': ['high-tech', 'pharmaceutical', 'manufacturing']
};

// Industry names
const industryNames = {
  'financial-services': 'Financial Services',
  'healthcare': 'Healthcare',
  'legal-services': 'Legal Services',
  'high-tech': 'High Tech',
  'pharmaceutical': 'Pharmaceutical',
  'manufacturing': 'Manufacturing',
  'construction': 'Construction',
  'oil-gas': 'Oil & Gas'
};

const SolutionDetailPage = () => {
  const { solutionSlug } = useParams();
  const solution = solutionData[solutionSlug] || {
    name: 'Solution Not Found',
    description: '',
    keyFeatures: []
  };
  const industries = industriesBySolution[solutionSlug] || [];

  if (!solutionData[solutionSlug]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Solution Not Found</h1>
          <p className="text-gray-500 mb-6">The requested solution page could not be found.</p>
          <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Consistent Simplified Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-lg font-bold text-indigo-700 hover:text-indigo-800">
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

      {/* Refined Hero section (Indigo theme) */}
      <div className="bg-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight mb-3">{solution.name}</h1>
          <p className="text-indigo-100 text-xl max-w-2xl mx-auto">{solution.description}</p>
        </div>
      </div>

      {/* Main content - Two Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Key Capabilities, Use Cases & CTA */}
          <div className="lg:col-span-1 space-y-8">
            {/* Key Capabilities section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Key Capabilities</h2>
              <div className="bg-white rounded-lg shadow p-6 space-y-3">
                {solution.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Use case section */}
             <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Common Use Cases</h2>
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-1">Enterprise Implementation</h3>
                    <p className="text-gray-600 text-sm">Full-scale solutions for large organizations with complex requirements and integrations.</p>
                  </div>
                   <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-1">Department-Level Deployment</h3>
                    <p className="text-gray-600 text-sm">Targeted implementation for specific teams or departments with focused functionality.</p>
                  </div>
                </div>
            </section>

            {/* CTA section - Integrated */}
            <section className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Ready to implement {solution.name}?</h2>
              <p className="text-indigo-100 text-sm mb-4">Contact our team for a personalized demonstration.</p>
              <Link
                to="/" // Assuming demo request goes to home for now
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                Request Demo <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Right Column: Industries */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Industries Using This Solution</h2>
              {industries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {industries.map(industrySlug => {
                    const industryName = industryNames[industrySlug];
                    if (!industryName) return null;
                    return (
                      <Link
                        key={industrySlug}
                        to={`/industries/${industrySlug}`}
                        className="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex items-center p-5 border border-gray-100"
                      >
                         <FiBriefcase className="w-6 h-6 text-indigo-500 mr-4 flex-shrink-0" />
                         <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{industryName}</h3>
                          <div className="text-indigo-600 font-medium flex items-center text-sm mt-1 group-hover:underline">
                              View Industry Details
                              <FiArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                         </div>
                      </Link>
                    );
                  })}
                </div>
               ) : (
                 <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No specific industries listed for this solution yet.
                 </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Consistent Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">© {new Date().getFullYear()} Solution Connector. All rights reserved.</p>
            <Link to="/" className="text-sm text-indigo-600 hover:underline">Back to Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SolutionDetailPage; 