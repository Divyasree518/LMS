import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import '../styles/books.css';

const Books = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookAPI.getAllBooks();
        setBooks(response.data.data);
        setFilteredBooks(response.data.data);
      } catch (err) {
        setError('Failed to load books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const categories = ['All', ...new Set(books.map(b => b.category))];

  const handleBorrow = async (bookId) => {
    if (!user) {
      alert('Please login to borrow books');
      return;
    }

    try {
      await bookAPI.borrowBook(bookId, user.id);
      alert('Book borrowed successfully! Return by 2 weeks.');
      // Refresh books
      const response = await bookAPI.getAllBooks();
      setBooks(response.data.data);
    } catch (err) {
      alert('Failed to borrow book');
    }
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>📚 Academic Catalog</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="books-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading">Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-icon">📖</div>
            <h3>{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            <p className="book-category">{book.category}</p>
            <p className="book-available">
              {book.available > 0 ? `${book.available} available` : 'Out of stock'}
            </p>
            <button
              className={`btn-borrow ${book.available === 0 ? 'disabled' : ''}`}
              onClick={() => handleBorrow(book.id)}
              disabled={book.available === 0}
            >
              {book.available > 0 ? 'Borrow' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && !loading && (
        <p className="no-results">No books found matching your criteria.</p>
      )}
    </div>
  );
};

export default Books;
