import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        'http://localhost:5001/api/auth/verify-email',
        {
          email,
          otp: data.otp
        }
      );

      toast.success('Email verified successfully');

      navigate('/login');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Invalid OTP'
      );
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Verify Email</h2>

      <p>
        Enter OTP sent to:
        <br />
        <b>{email}</b>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Enter OTP"
          {...register('otp', { required: true })}
        />

        <button disabled={isSubmitting}>
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;