import React from 'react';
import axios from 'axios';
import './App.css'; // Make sure the vignette CSS is included here

const Header = ({ user, setUser, darkMode, toggleDarkMode }) => {
  const handleLogout = () => {
    axios.get('https://to-do-backend-q9sw.onrender.com/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch(err => {
        console.error('Logout error:', err);
        window.location.reload();
      });
  };

  return (
    <div className="header-vignette" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      <h1>
        {user && (user.displayName || user.name)
          ? `${user.displayName || user.name}'s To-Do List`
          : 'To-Do List'}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {typeof toggleDarkMode === 'function' && (
          <button onClick={toggleDarkMode}>
            {darkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        )}
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <a href="https://to-do-backend-q9sw.onrender.com/auth/google">
            <button>Login with Google</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;