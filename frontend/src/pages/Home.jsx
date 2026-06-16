import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI, paymentAPI } from '../services/api';
import WalletBalance from '../components/WalletBalance.jsx';
import TransactionCard from '../components/TransactionCard.jsx';

function Home() {
  const { user, updateUser } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    const fetchWalletAndTransactions = async () => {
      try {
        // refresh user wallet
        const meRes = await authAPI.getMe();
        updateUser(meRes.data.data.user);

        // get latest 5 transactions
        const txRes = await paymentAPI.getTransactions({ page: 1, limit: 5 });
        setRecentTransactions(txRes.data.data.transactions || []);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchWalletAndTransactions();
  }, [updateUser]);

  return (
    <div className="container" style={styles.container}>
      <div className="grid grid-2">
        <div>
          <WalletBalance balance={user?.walletBalance || 0} />

          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.actions}>
              <Link to="/payment" className="btn btn-primary">
                <Receipt size={18} />
                <span>Make a Payment</span>
              </Link>
              <Link to="/transactions" className="btn btn-secondary">
                <ArrowRight size={18} />
                <span>View All Transactions</span>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={styles.sectionTitle}>Recent Transactions</h2>
            {loadingTransactions ? (
              <p style={styles.muted}>Loading transactions...</p>
            ) : recentTransactions.length === 0 ? (
              <p style={styles.muted}>
                No transactions yet. Start by making your first payment.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentTransactions.map((tx) => (
                  <TransactionCard key={tx.transactionId} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: 24,
    paddingBottom: 32
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: 16,
    color: '#0F172A'
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12
  },
  muted: {
    fontSize: '14px',
    color: '#64748B'
  }
};

export default Home;