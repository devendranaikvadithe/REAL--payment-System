import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
 Wallet,
 Home,
 Receipt,
 LogOut,
 User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.headerContent}>
        <Link to="/" style={styles.logo}>
          <Wallet size={28} color="#6236FF" />
          <span style={styles.logoText}>PayWallet</span>
        </Link>

        <nav style={styles.nav}>

          <Link to="/" style={styles.navLink}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link to="/payment" style={styles.navLink}>
            <Wallet size={20} />
            <span>Pay</span>
          </Link>

          <Link to="/transactions" style={styles.navLink}>
            <Receipt size={20} />
            <span>Transactions</span>
          </Link>
           
           <Link to="/bank" style={styles.navLink}>
             <Wallet size={20} />
             <span>Bank</span>
          </Link>

          <Link to="/kyc" style={styles.navLink}>
            <User size={20} />
            <span>KYC</span>
          </Link>

        </nav>

        <div style={styles.userMenu}>
          <div style={styles.userInfo}>
            <User size={20} color="#64748B" />
            <span style={styles.userName}>{user?.name}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: '#FFFFFF',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E293B'
  },
  logoText: {
    color: '#6236FF'
  },
  nav: {
    display: 'flex',
    gap: '8px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#64748B',
    fontWeight: '500',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userName: {
    fontWeight: '500',
    color: '#1E293B'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EF4444',
    transition: 'background 0.2s'
  }
};

export default Header;