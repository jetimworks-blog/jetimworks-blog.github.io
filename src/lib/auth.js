const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Token management
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setStoredRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// User management
export const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Combined auth state
export const getAuthState = () => ({
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  user: getStoredUser(),
  isAuthenticated: !!getStoredToken(),
});

export const setAuthState = ({ token, refreshToken, user }) => {
  if (token) setStoredToken(token);
  if (refreshToken) setStoredRefreshToken(refreshToken);
  if (user) setStoredUser(user);
};

export const clearAuthState = () => {
  clearStoredToken();
  clearStoredUser();
};

// JWT parsing (for expiry check)
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};
