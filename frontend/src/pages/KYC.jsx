import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function KYC() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchKYCStatus = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5001/api/kyc/status',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setKyc(res.data.kyc);

      if (res.data.kyc) {
        setAadhaarNumber(res.data.kyc.aadhaarNumber || '');
        setPanNumber(res.data.kyc.panNumber || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:5001/api/kyc/submit',
        {
          aadhaarNumber,
          panNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(res.data.message);

      fetchKYCStatus();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to submit KYC'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.card}>
        <h2>KYC Verification</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="PAN Number"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>

        {kyc && (
          <div style={styles.statusBox}>
            <h3>KYC Status</h3>

            <p>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  color:
                    kyc.kycStatus === 'verified'
                      ? 'green'
                      : 'orange'
                }}
              >
                {kyc.kycStatus}
              </span>
            </p>

            <p>
              <strong>PAN:</strong> {kyc.panNumber}
            </p>

            <p>
              <strong>Aadhaar:</strong> {kyc.aadhaarNumber}
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
    maxWidth: '600px',
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
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    background: '#6236FF',
    color: '#fff',
    cursor: 'pointer'
  },
  statusBox: {
    marginTop: '20px',
    padding: '15px',
    background: '#F8FAFC',
    borderRadius: '10px'
  }
};

export default KYC;