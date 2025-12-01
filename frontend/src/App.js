
// date 12/11/2025
// ..............................................................................................................................................................
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; // New Component
import InputForm from './components/InputForm';
import ResultsPage from './components/ResultsPage';
import Login from './components/Login'; // New Component
import SignUp from './components/SignUp'; // New Component
import History from './components/History'; // New Component (Placeholder)
import Library from './components/Library'; // New Component (Placeholder)
import Upgrade from './components/Upgrade'; // New Component (Placeholder)

// Simple Auth placeholder for demo
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuth') === 'true'
  );

  const login = () => {
    localStorage.setItem('isAuth', 'true');
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('isAuth');
    setIsAuthenticated(false);
  };
  const signup = login; // Simplified for demo
  return { isAuthenticated, login, logout, signup };
};

// Layout Component for authenticated routes
const AuthenticatedLayout = ({ children, onLogout }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
    <Header onLogout={onLogout} />
    <main style={{ minHeight: '80vh', padding: '2rem 0' }}>{children}</main>
  </div>
);

function App() {
  const { isAuthenticated, login, logout, signup } = useAuth();
  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Private route wrapper
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/signup" element={<SignUp onSignUp={signup} />} />

      {/* Main Generation Page */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AuthenticatedLayout onLogout={logout}>
              <h1
                style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#4f46e5',
                }}
              >
                🎨 CreativeAI Ads – Image & Video Generation for Marketing
              </h1>

              {generatedData ? (
                <ResultsPage
                  data={generatedData}
                  reset={() => {
                    setGeneratedData(null);
                    setError(null);
                  }}
                />
              ) : (
                <InputForm
                  setGeneratedData={setGeneratedData}
                  setLoading={setLoading}
                  setError={setError}
                  loading={loading} // Pass loading state to InputForm
                  error={error} // Pass error state to InputForm
                />
              )}
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      
      {/* Additional Features (Placeholder Routes) */}
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <AuthenticatedLayout onLogout={logout}>
              <History />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/library"
        element={
          <PrivateRoute>
            <AuthenticatedLayout onLogout={logout}>
              <Library />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/upgrade"
        element={
          <PrivateRoute>
            <AuthenticatedLayout onLogout={logout}>
              <Upgrade />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;