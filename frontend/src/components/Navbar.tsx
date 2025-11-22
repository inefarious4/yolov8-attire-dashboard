import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav className="navbar">
    <div className="brand">
      <Link to="/" className="brand-link">YOLOv8 Attire</Link>
    </div>
    <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/add-dataset" className="nav-link">Dataset</Link>
    </div>
  </nav>
);

export default Navbar;