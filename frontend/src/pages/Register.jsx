import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

function Register() {
  const { register: formRegister, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    await authAPI.register(data);

    toast.success('OTP sent to your email');

    navigate('/verify-email', {
      state: {
        email: data.email
      }
    });

  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Registration failed'
    );
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Wallet size={40} color="#6236FF" />
          <h2>Create Account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <input
            placeholder="Name"
            {...formRegister('name', { required: true })}
            style={styles.input}
          />

          <input
            placeholder="Email"
            type="email"
            {...formRegister('email', { required: true })}
            style={styles.input}
          />

          <input
            placeholder="Password"
            type="password"
            {...formRegister('password', { required: true })}
            style={styles.input}
          />

          <input
            placeholder="Phone"
            {...formRegister('phone')}
            style={styles.input}
          />

          <button disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5'
  },
  card: {
    width: '350px',
    padding: '30px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
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
    padding: '10px',
    background: '#6236FF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  footer: {
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '14px'
  }
};

export default Register;