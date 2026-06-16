import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../services/api';
import TransactionCard from '../components/TransactionCard.jsx';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const res = await paymentAPI.getTransactions({ page, limit: 10 });
      setTransactions(res.data.data.transactions || []);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error('Failed to load transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchTransactions(newPage);
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card">
        <div style={styles.header}>
          <h2 style={styles.title}>Transaction History</h2>
          <p style={styles.subtitle}>
            View all your wallet transfers, bill payments, and recharges.
          </p>
        </div>

        {loading ? (
          <p style={styles.muted}>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p style={styles.muted}>No transactions found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.map((tx) => (
              <TransactionCard key={tx.transactionId} transaction={tx} />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: 24,
    paddingBottom: 32
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0F172A'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginTop: 4
  },
  muted: {
    fontSize: '14px',
    color: '#94A3B8'
  },
  pagination: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#64748B'
  }
};

export default Transactions;