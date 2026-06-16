import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

function WalletBalance({ balance, currency = '₹' }) {
  const formattedBalance = balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          <Wallet size={24} color="#6236FF" />
        </div>
        <span style={styles.label}>Wallet Balance</span>
      </div>
      <div style={styles.balanceContainer}>
        <span style={styles.currency}>{currency}</span>
        <span style={styles.balance}>{formattedBalance}</span>
      </div>
      <div style={styles.meta}>
        <TrendingUp size={16} color="#10B981" />
        <span style={styles.metaText}>Available for transactions</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'linear-gradient(135deg, #6236FF 0%, #4A2ED9 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 10px 25px -5px rgba(98, 54, 255, 0.4)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    fontSize: '14px',
    opacity: 0.9
  },
  iconContainer: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '8px'
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },
  currency: {
    fontSize: '24px',
    fontWeight: '600'
  },
  balance: {
    fontSize: '40px',
    fontWeight: '700'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
    fontSize: '14px',
    opacity: 0.9
  },
  metaText: {
    fontSize: '13px'
  }
};

export default WalletBalance;