
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          HealthTracker
        </Link>
        
        {user ? (
          <>
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/dashboard" 
                  className={isActive('/dashboard') ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/appointments" 
                  className={isActive('/appointments') ? 'active' : ''}
                >
                  Appointments
                </Link>
              </li>
              <li>
                <Link 
                  to="/prescriptions" 
                  className={isActive('/prescriptions') ? 'active' : ''}
                >
                  Prescriptions
                </Link>
              </li>
            </ul>
            
            <div className="navbar-user">
              <span>Welcome, {user.firstName}!</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/login" 
                className={isActive('/login') ? 'active' : ''}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className={isActive('/register') ? 'active' : ''}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
