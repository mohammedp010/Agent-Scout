import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Import the corresponding CSS

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Replace "MyApp" with your application's name or logo */}
        <NavLink to="/" className="navbar-brand">Agent Scout</NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/players" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          >
            Players
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
