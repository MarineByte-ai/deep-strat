import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">Solution Connector</div>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/industries" className="hover:underline">Industries</Link></li>
          <li><Link to="/solutions" className="hover:underline">Solutions</Link></li>
          <li><Link to="/services" className="hover:underline">Our Services</Link></li>
          <li><Link to="/company" className="hover:underline">Company</Link></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header; 