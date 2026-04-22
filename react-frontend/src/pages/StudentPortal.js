import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import '../styles/student-portal.css';

const StudentPortal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('borrow');
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const booksRes = await bookAPI.getAllBooks();
        setBooks(booksRes.data.data);
        // Simulate borrowed books (in real app, would come from backend)
        setBorrowedBooks(booksRes.data.data.slice(0, 2));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      await bookAPI.returnBook(bookId);
      setBorrowedBooks(borrowedBooks.filter(b => b.id !== bookId));
      alert('Book returned successfully!');
    } catch (err) {
      alert('Failed to return book');
    }
  };

  return (
    <div className="student-portal">
      <div className="portal-header">
        <h1>👨‍🎓 Student Portal</h1>
        <p>Welcome, {user?.name}!</p>
      </div>

      <div className="portal-tabs">
        <button
          className={`tab-btn ${activeTab === 'borrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrow')}
        >
          Borrow Books
        </button>
        <button
          className={`tab-btn ${activeTab === 'borrowed' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrowed')}
        >
          My Books ({borrowedBooks.length})
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {activeTab === 'borrow' && (
        <div className="borrow-section">
          <h2>Available Books</h2>
          <div className="books-grid-student">
            {books.filter(b => b.available > 0).map(book => (
              <div key={book.id} className="book-item-student">
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <p className="available">{book.available} in stock</p>
                <button className="btn-borrow">Borrow</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'borrowed' && (
        <div className="borrowed-section">
          <h2>Books You're Currently Borrowing</h2>
          {borrowedBooks.length === 0 ? (
            <p>You haven't borrowed any books yet.</p>
          ) : (
            <table className="borrowed-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-return"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
