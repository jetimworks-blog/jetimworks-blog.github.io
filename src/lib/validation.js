export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  return { valid: true, message: '' };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  if (checks.length) strength += 1;
  if (checks.lowercase) strength += 1;
  if (checks.uppercase) strength += 1;
  if (checks.number) strength += 1;
  if (checks.special) strength += 1;

  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Perfect'];
  const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'green'];

  return {
    strength,
    checks,
    label: labels[Math.min(strength, 5)],
    color: colors[Math.min(strength, 5)],
  };
};
