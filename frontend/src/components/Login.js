// components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simplified validation for demo
    if (email === 'user@example.com' && password === 'password123') {
      onLogin();
      navigate('/');
    } else {
      alert('Invalid credentials. Use user@example.com / password123');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f9fafb',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ color: '#1f2937', textAlign: 'center', marginBottom: '1.5rem' }}>
          Welcome Back 👋
        </h2>

        <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '15px',
            }}
          />
        </label>

        <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '15px',
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '10px',
            border: 'none',
            background: '#4f46e5',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Sign In
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;