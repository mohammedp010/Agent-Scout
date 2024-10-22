import axios from 'axios';

// Create an Axios instance with default configurations
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add response interceptors (e.g., for handling global errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global response errors here if needed
    // For example, log errors or display notifications
    return Promise.reject(error);
  }
);

// Define CRUD methods

/**
 * GET request
 * @param {string} url - The endpoint URL (relative to baseURL)
 * @param {object} params - Query parameters
 */
const get = (url, params = {}) => {
  return apiClient.get(url, { params });
};

/**
 * POST request
 * @param {string} url - The endpoint URL (relative to baseURL)
 * @param {object} data - The request payload
 */
const post = (url, data) => {
  return apiClient.post(url, data);
};

/**
 * PUT request
 * @param {string} url - The endpoint URL (relative to baseURL)
 * @param {object} data - The request payload
 */
const put = (url, data) => {
  return apiClient.put(url, data);
};

/**
 * PATCH request
 * @param {string} url - The endpoint URL (relative to baseURL)
 * @param {object} data - The request payload
 */
const patch = (url, data) => {
  return apiClient.patch(url, data);
};

/**
 * DELETE request
 * @param {string} url - The endpoint URL (relative to baseURL)
 * @param {object} params - Query parameters
 */
const _delete = (url, params = {}) => {
  return apiClient.delete(url, { params });
};

// Export all methods as ApiService
const ApiService = {
  get,
  post,
  put,
  patch,
  delete: _delete,
};

export default ApiService;
