import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Receipt, Wallet, Zap } from 'lucide-react';

const typeConfig = {
  wallet_transfer: { icon: ArrowUpRight, color: '#6236FF', label: 'Transfer' },
  bill_payment: { icon: Receipt, color: '#F59E0B', label: 'Bill Payment' },
  recharge: { icon: Zap, color: '#10B981', label: 'Recharge' },
  utillity: { icon: Receipt, color: '#F59E0B', label: 'Utility' },
  merchant_payment: { icon: Wallet, color: '#6366F1', label: 'Merchant' }
};

const statusConfig = {
  pending: { color: '#F59E0B', bg: '#FEF3C7' },
  processing: { color: '#3B82F6', bg: '#DBEAFE' },
  completed: { color: '#10B981', bg: '#D1FAE5' },
  failed: { color: '#EF4444', bg: '#FEE2E2' },
  cancelled: { color: '#6B7280', bg: '#F3F4F6' }
};

function TransactionCard({ transaction }) {
  const config = typeConfig[transaction.type] || typeConfig.wallet_transfer;
  const statusStyle = statusConfig[transaction.status] || statusConfig.pending;
  const Icon = config.icon;

  const formattedAmount = transaction.amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedDate = format(new Date(transaction.createdAt), 'dd MMM yyyy, hh:mm a');

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ ...styles.iconContainer, background: `${statusStyle.bg}40` }}>
          <Icon size={20} color={config.color} />
        </div>
        <div style={styles.details}>
          <h4 style={styles.title}>{config.label}</h4>
          <p style={styles.date}>{formattedDate}</p>
        </div>
        <span style={{ ...styles.status, background: statusStyle.bg, color: statusStyle.color }}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>

      <div style={styles.footer}>
        <div>
          {transaction.recipientName && (
            <p style={styles.recipient}>{transaction.recipientName}</p>
          )}
          {transaction.description && (
            <p style={styles.description}>{transaction.description}</p>
          )}
          <p style={styles.transactionId}>ID: {transaction.transactionId}</p>
        </div>
        <span style={styles.amount}>- ₹{formattedAmount}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #E2E8F0'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  iconContainer: {
    padding: '10px',
    borderRadius: '10px'
  },
  details: {
    flex: 1
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '4px'
  },
  date: {
    fontSize: '13px',
    color: '#64748B'
  },
  status: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  recipient: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: '4px'
  },
  description: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '4px'
  },
  transactionId: {
    fontSize: '11px',
    color: '#94A3B8',
    fontFamily: 'monospace'
  },
  amount: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#EF4444'
  }
};

export default TransactionCard;