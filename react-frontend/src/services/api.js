import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://lms-uk7j.onrender.com';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (username, password, role) => 
    apiClient.post(`${API_URL}/api/auth/login`, { username, password, role }),
  signup: (username, password, email, name, role) =>
    apiClient.post(`${API_URL}/api/auth/signup`, { username, password, email, name, role }),
  logout: () =>
    apiClient.post(`${API_URL}/api/auth/logout`, { token: localStorage.getItem('authToken') || localStorage.getItem('token') }),
  validateToken: () =>
    apiClient.get(`${API_URL}/api/auth/validate`)
};

// User endpoints
export const userAPI = {
  getAllUsers: () => apiClient.get(`${API_URL}/api/users`),
  getUserById: (id) => apiClient.get(`${API_URL}/api/users/${id}`),
  createUser: (userData) => apiClient.post(`${API_URL}/api/users`, userData),
  updateUser: (id, userData) => apiClient.put(`${API_URL}/api/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`${API_URL}/api/users/${id}`)
};

// Book endpoints
export const bookAPI = {
  getAllBooks: () => apiClient.get(`${API_URL}/api/books`),
  getAllBorrowRecords: () => apiClient.get(`${API_URL}/api/books/records`),
  getBookById: (id) => apiClient.get(`${API_URL}/api/books/${id}`),
  getBooksByCategory: (category) => apiClient.get(`${API_URL}/api/books/category/${category}`),
  createBook: (bookData) => apiClient.post(`${API_URL}/api/books`, bookData),
  updateBook: (id, bookData) => apiClient.put(`${API_URL}/api/books/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`${API_URL}/api/books/${id}`),
  borrowBook: (id, userId) => apiClient.post(`${API_URL}/api/books/${id}/borrow`, { userId }),
  returnBook: (id, borrowRecordId) => apiClient.post(`${API_URL}/api/books/${id}/return`, { borrowRecordId }),
  getBorrowedByUser: (userId) => apiClient.get(`${API_URL}/api/books/borrowed/${userId}`)
};

// Report endpoints
export const reportAPI = {
  getAllReports: () => apiClient.get(`${API_URL}/api/reports`),
  getSummary: () => apiClient.get(`${API_URL}/api/reports/summary`),
  getCirculationReport: () => apiClient.get(`${API_URL}/api/reports/circulation`),
  generateReport: (reportData) => apiClient.post(`${API_URL}/api/reports`, reportData)
};

export default apiClient;
