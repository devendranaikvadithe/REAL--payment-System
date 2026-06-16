import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function BankAccount() {
  const [bankData, setBankData] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Savings'
  });

  const [savedBank, setSavedBank] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchBankAccount = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5001/api/bank/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.data) {
        setSavedBank(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const handleChange = (e) => {
    setBankData({
      ...bankData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:5001/api/bank/add',
        bankData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(res.data.message);

      fetchBankAccount();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Failed to add bank account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Link Bank Account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="bankName"
            placeholder="Bank Name"
            value={bankData.bankName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="accountHolderName"
            placeholder="Account Holder Name"
            value={bankData.accountHolderName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="accountNumber"
            placeholder="Account Number"
            value={bankData.accountNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="ifscCode"
            placeholder="IFSC Code"
            value={bankData.ifscCode}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="accountType"
            value={bankData.accountType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Linking...' : 'Link Bank Account'}
          </button>
        </form>

        {savedBank && (
          <div style={styles.bankCard}>
            <h3>Linked Bank Account</h3>

            <p>
              <strong>Bank:</strong> {savedBank.bankName}
            </p>

            <p>
              <strong>Account Holder:</strong>{' '}
              {savedBank.accountHolderName}
            </p>

            <p>
              <strong>Account Number:</strong>{' '}
              XXXX{savedBank.accountNumber?.slice(-4)}
            </p>

            <p>
              <strong>IFSC:</strong> {savedBank.ifscCode}
            </p>

            <p>
              <strong>Type:</strong> {savedBank.accountType}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              {savedBank.verified
                ? '✅ Verified'
                : '🟡 Pending Verification'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '100px'
  },
  card: {
    maxWidth: '700px',
    margin: 'auto',
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  button: {
    background: '#6236FF',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  bankCard: {
    marginTop: '25px',
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '10px'
  }
};

export default BankAccount;