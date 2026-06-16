import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';
import { validateAmount, validateRequired, validatePhone } from '../utils/validators';

function PaymentForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const [paymentType, setPaymentType] = useState('wallet_transfer');

  const onSubmit = async (data) => {
    try {
      const paymentData = {
        type: paymentType,
        amount: parseFloat(data.amount),
        description: data.description
      };

      if (paymentType === 'wallet_transfer') {
        paymentData.recipient = data.recipient;
        paymentData.recipientName = data.recipientName;
      } else if (paymentType === 'bill_payment' || paymentType === 'utility') {
        paymentData.biller = data.biller;
      }

      const res = await paymentAPI.initiate(paymentData);
      
      toast.success('Payment initiated successfully!');
      
      if (onSuccess) {
        onSuccess(res.data.data.transaction);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(message);
    }
  };

  const paymentTypes = [
    { value: 'wallet_transfer', label: 'Wallet Transfer' },
    { value: 'bill_payment', label: 'Bill Payment' },
    { value: 'recharge', label: 'Mobile Recharge' },
    { value: 'utility', label: 'Utility Bill' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div className="form-group">
        <label className="form-label">Payment Type</label>
        <select
          {...register('type', { required: 'Payment type is required' })}
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="form-input"
          style={styles.select}
        >
          {paymentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>
          Amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Enter amount"
          {...register('amount', {
            required: 'Amount is required',
            validate: (value) => validateAmount(value) || 'Please enter a valid amount'
          })}
          className={`form-input ${errors.amount ? 'error' : ''}`}
          style={styles.amountInput}
        />
        {errors.amount && (
          <p className="form-error">{errors.amount.message}</p>
        )}
      </div>

      {paymentType === 'wallet_transfer' && (
        <>
          <div className="form-group">
            <label className="form-label">Recipient Phone *</label>
            <input
              type="tel"
              placeholder="9876543210"
              maxLength="10"
              {...register('recipient', {
                required: 'Recipient phone is required',
                validate: (value) => validatePhone(value) || 'Enter valid 10-digit Indian phone'
              })}
              className={`form-input ${errors.recipient ? 'error' : ''}`}
            />
            {errors.recipient && (
              <p className="form-error">{errors.recipient.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Name</label>
            <input
              type="text"
              placeholder="Enter name"
              {...register('recipientName')}
              className="form-input"
            />
          </div>
        </>
      )}

      {(paymentType === 'bill_payment' || paymentType === 'utility') && (
        <div className="form-group">
          <label className="form-label">Biller Name *</label>
          <input
            type="text"
            placeholder="e.g., TESCO, BSNL, G气"
            {...register('biller', {
              required: 'Biller name is required'
            })}
            className={`form-input ${errors.biller ? 'error' : ''}`}
          />
          {errors.biller && (
            <p className="form-error">{errors.biller.message}</p>
          )}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <textarea
          placeholder="Add a note (optional)"
          maxLength="200"
          rows="3"
          {...register('description')}
          className="form-input"
          style={styles.textarea}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isSubmitting}
        style={styles.submitBtn}
      >
        {isSubmitting ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  select: {
    cursor: 'pointer'
  },
  amountInput: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#6236FF'
  },
  textarea: {
    resize: 'vertical'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '16px'
  }
};

export default PaymentForm;