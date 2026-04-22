/**
 * API Service for VEMU Library Management System
 * Handles communication with the MongoDB-backed Express server.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
    // Helper for fetch requests
    async request(endpoint, method = 'GET', data = null, requiresAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (requiresAuth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const config = {
            method,
            headers
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Something went wrong');
            }

            return result;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    // Auth methods
    auth: {
        async login(credentials) {
            const result = await apiService.request('/auth/login', 'POST', credentials, false);
            if (result.success && result.token) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('currentUser', JSON.stringify(result.user));
            }
            return result;
        },

        async signup(userData) {
            return await apiService.request('/auth/signup', 'POST', userData, false);
        },

        logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = '/login.html';
        },

        getCurrentUser() {
            const userStr = localStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        },

        isAuthenticated() {
            return !!localStorage.getItem('authToken');
        }
    },

    // Book methods
    books: {
        async getAll() {
            return await apiService.request('/books');
        },

        async getById(id) {
            return await apiService.request(`/books/${id}`);
        },

        async borrow(bookId, userId) {
            return await apiService.request(`/books/${bookId}/borrow`, 'POST', { userId });
        },

        async return(bookId, borrowRecordId) {
            return await apiService.request(`/books/${bookId}/return`, 'POST', { borrowRecordId });
        },

        async create(bookData) {
            return await apiService.request('/books', 'POST', bookData);
        },

        async update(id, bookData) {
            return await apiService.request(`/books/${id}`, 'PUT', bookData);
        },

        async delete(id) {
            return await apiService.request(`/books/${id}`, 'DELETE');
        }
    },

    // User methods
    users: {
        async getProfile() {
            return await apiService.request('/users/profile');
        },

        async getAll() {
            return await apiService.request('/users');
        }
    }
};

// Export for use in HTML files
window.apiService = apiService;
