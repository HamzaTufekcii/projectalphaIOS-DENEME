/**
 * Authentication Service
 * Handles all API calls related to authentication
 */
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Send verification code to email for registration
 * @param {string} email - User's email address
 * @returns {Promise} Response from the API
 */
export const sendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-verification-code`, { email: email.trim() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Error sending verification code';
  }
};

/**
 * Verify the code sent to user's email
 * @param {string} email - User's email address
 * @param {string} token - Verification code/token
 * @returns {Promise} Response from the API with token and user ID
 */
export const verifyCode = async (email, token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-verification-code`, { 
      email: email.trim(), 
      token: token.trim() 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Error verifying code';
  }
};

/**
 * Update user with password and role
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} role - User's role (user, owner, etc.)
 * @returns {Promise} Response from the API
 */
export const updateUser = async (email, password, role = 'user') => {
  try {
    const response = await axios.post(`${API_URL}/update-user`, { 
      email: email.trim(), 
      password: password,
      role: role 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Error setting password';
  }
};

/**
 * Login with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} Response from the API with tokens and user info
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { 
      email: email.trim(), 
      password: password 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Error logging in';
  }
};

/**
 * Save authentication data to local storage
 * @param {Object} authData - Auth data with tokens and user info
 */
export const saveAuthData = (authData) => {
  localStorage.setItem('token', authData.access_token);
  localStorage.setItem('refreshToken', authData.refresh_token);
  localStorage.setItem('user', JSON.stringify(authData.user));
};

/**
 * Get authentication data from local storage
 * @returns {Object} Auth data with token and user info
 */
export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return { token, refreshToken, user };
};

/**
 * Clear authentication data from local storage (logout)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}; 