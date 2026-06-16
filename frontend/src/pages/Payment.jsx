import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import WalletBalance from '../components/WalletBalance.jsx';
import PaymentForm from '../components/PaymentForm.jsx';
import { paymentAPI, authAPI } from '../services/api';

function Payment() {
  const { user, updateUser } = useAuth();
  const [currentTx, setCurrentTx] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePaymentInitiated = async (transaction) => {
    setCurrentTx(transaction);
    setProcessing(true);

    try {
      // Start processing on backend
      await paymentAPI.process(transaction.transactionId);
      toast.success('Payment processing started');

      // Simple polling after a short delay
      setTimeout(async () => {
        try {
          const statusRes = await paymentAPI.getStatus(transaction.transactionId);
          const updatedTx = statusRes.data.data.transaction;

          if (updatedTx.status === 'completed') {
            toast.success('Payment completed successfully');

            // Refresh wallet balance
            const meRes = await authAPI.getMe();
            updateUser(meRes.data.data.user);
          } else if (updatedTx.status === 'failed') {
            toast.error('Payment failed: ' + (updatedTx.failureReason || 'Unknown reason'));
          }

          setCurrentTx(updatedTx);
        } catch (err) {
          console.error('Failed to fetch transaction status', err);
        } finally {
          setProcessing(false);
        }
      }, 2500);
    } catch (error) {
      setProcessing(false);
      const message =
        error.response?.data?.message || 'Failed to start payment processing';
      toast.error(message);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div className="grid grid-2">
        <div>
          <WalletBalance balance={user?.walletBalance || 0} />
          <div className="card" style={{ marginTop: 24 }}>
            <h2 style={styles.sectionTitle}>New Payment</h2>
            <p style={styles.description}>
              Simulate different payment flows such as wallet transfers, bill payments, and recharges.
            </p>
            <PaymentForm onSuccess={handlePaymentInitiated} />
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={styles.sectionTitle}>Payment Status</h2>
            {!currentTx ? (
              <p style={styles.muted}>
                Initiate a payment to see live status and transaction details here.
              </p>
            ) : (
              <div>
                <p style={styles.label}>Transaction ID</p>
                <p style={styles.value}>{currentTx.transactionId}</p>

                <p style={styles.label}>Status</p>
                <p style={styles.value}>
                  {currentTx.status.charAt(0).toUpperCase() + currentTx.status.slice(1)}
                </p>

                {currentTx.failureReason && (
                  <>
                    <p style={styles.label}>Failure Reason</p>
                    <p style={{ ...styles.value, color: '#EF4444' }}>
                      {currentTx.failureReason}
                    </p>
                  </>
                )}

                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate('/transactions')}
                >
                  View in Transactions
                </button>
              </div>
            )}
            {processing && (
              <p style={{ ...styles.muted, marginTop: 12 }}>
                Processing payment... please wait.
              </p>
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
    marginBottom: 8,
    color: '#0F172A'
  },
  description: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: 16
  },
  muted: {
    fontSize: '13px',
    color: '#94A3B8'
  },
  label: {
    fontSize: '13px',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginTop: 12
  },
  value: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#0F172A'
  }
};

export default Payment;