
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Generate', path: '/' },
    { name: 'History', path: '/history' },
    { name: 'Library', path: '/library' },
    { name: 'Upgrade', path: '/upgrade' },
  ];

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 0',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5' }}>
        AdGen AI
      </div>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === item.path ? '#4f46e5' : '#374151',
              fontWeight: location.pathname === item.path ? '700' : '500',
              padding: '0.5rem 0',
              borderBottom: location.pathname === item.path ? '3px solid #4f46e5' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <button
        onClick={onLogout}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          border: '1px solid #ef4444',
          background: '#fee2e2',
          color: '#ef4444',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        Sign Out
      </button>
    </header>
  );
};

export default Header;