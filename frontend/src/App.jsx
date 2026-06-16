import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Payment from './pages/Payment.jsx';
import Transactions from './pages/Transactions.jsx';
import Register from './pages/Register.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import './App.css';
import VerifyEmail from './pages/VerifyEmail.jsx';
import KYC from './pages/KYC';
import BankAccount from './pages/BankAccount';


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Header />}
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email"element={<VerifyEmail />}/>
          <Route path="/kyc" element={<KYC />} />
          <Route path="/bank" element={<BankAccount />} />

        </Routes>
      </main>
    </div>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--background)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default App;