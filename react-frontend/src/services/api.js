import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (username, password) => 
    apiClient.post('/auth/login', { username, password }),
  signup: (username, password, email, name, role) =>
    apiClient.post('/auth/signup', { username, password, email, name, role }),
  logout: () =>
    apiClient.post('/auth/logout', { token: localStorage.getItem('authToken') }),
  validateToken: () =>
    apiClient.get('/auth/validate')
};

// User endpoints
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/users/${id}`)
};

// Book endpoints
export const bookAPI = {
  getAllBooks: () => apiClient.get('/books'),
  getBookById: (id) => apiClient.get(`/books/${id}`),
  getBooksByCategory: (category) => apiClient.get(`/books/category/${category}`),
  createBook: (bookData) => apiClient.post('/books', bookData),
  updateBook: (id, bookData) => apiClient.put(`/books/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
  borrowBook: (id, userId) => apiClient.post(`/books/${id}/borrow`, { userId }),
  returnBook: (id) => apiClient.post(`/books/${id}/return`, {})
};

// Report endpoints
export const reportAPI = {
  getAllReports: () => apiClient.get('/reports'),
  getSummary: () => apiClient.get('/reports/summary'),
  getCirculationReport: () => apiClient.get('/reports/circulation'),
  generateReport: (reportData) => apiClient.post('/reports', reportData)
};

export default apiClient;
