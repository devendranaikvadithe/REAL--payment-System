export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};