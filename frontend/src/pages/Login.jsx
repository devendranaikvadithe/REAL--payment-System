import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Wallet size={40} color="#6236FF" />
        <h2>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <input
            placeholder="Email"
            {...register('email', { required: true })}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            style={styles.input}
          />

          <button disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.text}>
          New user? <Link to="/register">Create account</Link>
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
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px'
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
  text: {
    marginTop: '10px',
    fontSize: '14px'
  }
};

export default Login;