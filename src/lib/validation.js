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
  const feedback = [];

  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('A lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('An uppercase letter');
  }

  if (/[0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('A number');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push('A special character');
  }

  return {
    strength, // 0-5
    feedback,
    label: ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(strength, 5)],
    color: ['red', 'orange', 'yellow', 'lime', 'green'][Math.min(strength, 5)],
  };
};
