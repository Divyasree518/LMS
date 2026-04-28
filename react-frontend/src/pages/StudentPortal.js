import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import '../styles/student-portal.css';

const NOTIFS_KEY = 'vemu_student_notifications_v1';

const defaultNotifications = [
  {
    id: 'notif_1',
    type: 'info',
    title: 'Welcome to Vemu Library',
    message: 'Browse and borrow books from our collection. Your borrowed books appear in your profile.',
    createdAt: Date.now(),
    read: false
  },
  {
    id: 'notif_2',
    type: 'alert',
    title: 'Return Reminder',
    message: 'Books must be returned within 14 days to avoid overdue fines.',
    createdAt: Date.now() - 86400000,
    read: false
  },
  {
    id: 'notif_3',
    type: 'success',
    title: 'New Books Available',
    message: 'Check out the latest additions in Computer Science and Mathematics sections.',
    createdAt: Date.now() - 172800000,
    read: true
  }
];

const StudentPortal = ({ user }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (user) {
        // Fallback to localStorage for full user data (email may not be in token validation)
        let fullUser = user;
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.username === user.username) {
              fullUser = parsed;
            }
          }
        } catch (e) {
          // ignore parse error
        }
        setProfile({
          name: fullUser.name || fullUser.username,
          email: fullUser.email || 'N/A',
          id: fullUser.id || fullUser._id
        });
      }
      await loadBooks();
      setLoading(false);
    };
    init();
  }, [user]);

  // Load notifications
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        } else {
          setNotifications(defaultNotifications);
          localStorage.setItem(NOTIFS_KEY, JSON.stringify(defaultNotifications));
        }
      } else {
        setNotifications(defaultNotifications);
        localStorage.setItem(NOTIFS_KEY, JSON.stringify(defaultNotifications));
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
      setNotifications(defaultNotifications);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Load borrowed books when profile is ready or page changes to mybooks
  useEffect(() => {
    if (profile.id) {
      loadBorrowedBooks();
    }
  }, [profile.id]);

  const loadBooks = async () => {
    try {
      const res = await bookAPI.getAllBooks();
      setBooks(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadBorrowedBooks = async () => {
    try {
      const res = await bookAPI.getBorrowedByUser(profile.id);
      setBorrowedBooks(res.data.data || []);
    } catch (e) {
      console.error('Failed to load borrowed books', e);
    }
  };

  const showPopup = (title, message, icon) => {
    setPopup({ title, message, icon });
    setTimeout(() => setPopup(null), 3000);
  };

  const addNotification = (type, title, message) => {
    const newNotif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      type,
      title,
      message,
      createdAt: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const borrow = async (id) => {
    const book = books.find(b => (b.id || b._id) === id);
    try {
      await bookAPI.borrowBook(id, profile.id);
      showPopup('Success', 'Book borrowed successfully', '✅');
      addNotification('success', 'Book Borrowed', `You have successfully borrowed "${book?.title || 'a book'}". Return it within 14 days.`);
      await loadBooks();
      await loadBorrowedBooks();
    } catch (e) {
      showPopup('Error', e.message || 'Failed to borrow', '❌');
      addNotification('alert', 'Borrow Failed', e.message || 'Unable to borrow the selected book. Please try again.');
    }
  };

  const returnBook = async (bookId, recordId) => {
    try {
      const res = await bookAPI.returnBook(bookId, recordId);
      const fine = res.data.data?.fine || 0;
      if (fine > 0) {
        showPopup('Returned', `Book returned. Overdue fine: Rs. ${fine}`, '💰');
        addNotification('alert', 'Book Returned', `Book returned with an overdue fine of Rs. ${fine}.`);
      } else {
        showPopup('Success', 'Book returned successfully', '✅');
        addNotification('success', 'Book Returned', 'Book returned on time. No fine applicable.');
      }
      await loadBooks();
      await loadBorrowedBooks();
    } catch (e) {
      showPopup('Error', e.response?.data?.error || e.message || 'Failed to return book', '❌');
      addNotification('alert', 'Return Failed', e.response?.data?.error || 'Unable to return the book. Please try again.');
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date() > new Date(dueDate);
  };

  const calculateOverdueDays = (dueDate) => {
    if (!dueDate) return 0;
    const diff = new Date() - new Date(dueDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (ts) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'alert': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className="student-portal">
      <nav className="navbar">
        <div className="logo-text">Vemu Library</div>
        <div className="nav-links">
          <button
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            🏠 Home
          </button>
          <button
            className={`nav-item ${activePage === 'mybooks' ? 'active' : ''}`}
            onClick={() => setActivePage('mybooks')}
          >
            📚 My Books
            {borrowedBooks.length > 0 && (
              <span className="notification-badge">{borrowedBooks.length}</span>
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="notif-wrapper">
            <button
              className={`nav-item notif-btn ${activePage === 'notifications' ? 'active' : ''}`}
              onClick={() => setNotifOpen(prev => !prev)}
              aria-label="Notifications"
            >
              🔔 Alerts
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && (
                    <button className="notif-markall" onClick={markAllAsRead}>Mark all read</button>
                  )}
                </div>
                <div className="notif-dropdown-list">
                  {notifications.length === 0 ? (
                    <div className="notif-dropdown-empty">No notifications</div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        className={`notif-dropdown-item ${n.read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <span className="notif-dropdown-icon">{getTypeIcon(n.type)}</span>
                        <div className="notif-dropdown-content">
                          <div className="notif-dropdown-title">{n.title}</div>
                          <div className="notif-dropdown-msg">{n.message}</div>
                          <div className="notif-dropdown-time">{formatTimeAgo(n.createdAt)}</div>
                        </div>
                        <button className="notif-dropdown-dismiss" onClick={(e) => dismissNotification(n.id, e)}>×</button>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 5 && (
                  <div className="notif-dropdown-footer">
                    <button className="notif-viewall" onClick={() => { setNotifOpen(false); setActivePage('notifications'); }}>
                      View all {notifications.length} notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => setActivePage('profile')}
          >
            👤 Profile
          </button>
          <button
            className="nav-item logout-btn"
            onClick={() => { localStorage.clear(); navigate('/login'); }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="main-container">
        {/* Home Page */}
        <div id="homePage" className={`page ${activePage === 'home' ? 'active-page' : ''}`}>
          <div className="card-elegant">
            <h2>Explore Books</h2>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn-gold" onClick={() => {}}>Search</button>
            </div>
            <div className="book-grid">
              {loading ? (
                <p>Loading books...</p>
              ) : (
                filteredBooks.map(b => (
                  <div className="book-card" key={b.id || b._id}>
                    <div className="book-img">📖</div>
                    <div className="book-info">
                      <div className="book-title">{b.title}</div>
                      <div className={`book-status ${b.available > 0 ? 'status-avail' : 'status-borrowed'}`}>
                        {b.available > 0 ? 'Available' : 'Borrowed'}
                      </div>
                      <button
                        className="book-btn"
                        onClick={() => borrow(b.id || b._id)}
                        disabled={b.available <= 0}
                      >
                        {b.available > 0 ? 'Borrow' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* My Books Page */}
        <div id="myBooksPage" className={`page ${activePage === 'mybooks' ? 'active-page' : ''}`}>
          <div className="card-elegant">
            <h2>📚 My Borrowed Books</h2>
            {borrowedBooks.length === 0 ? (
              <p className="mybooks-empty">You have no borrowed books. Go to Home to borrow some!</p>
            ) : (
              <div className="borrowed-list">
                {borrowedBooks.map(record => {
                  const book = record.bookId || {};
                  const overdue = isOverdue(record.dueDate);
                  const overdueDays = calculateOverdueDays(record.dueDate);
                  return (
                    <div className={`borrowed-card ${overdue ? 'overdue' : ''}`} key={record._id}>
                      <div className="borrowed-info">
                        <div className="borrowed-title">{book.title || 'Unknown Book'}</div>
                        <div className="borrowed-author">{book.author || 'Unknown Author'}</div>
                        <div className="borrowed-meta">
                          <span>Borrowed: {formatDate(record.borrowDate)}</span>
                          <span className={overdue ? 'due-overdue' : 'due-normal'}>
                            Due: {formatDate(record.dueDate)}
                            {overdue && ` (Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''})`}
                          </span>
                        </div>
                        {overdue && (
                          <div className="fine-badge">
                            Estimated Fine: Rs. {overdueDays * 1}
                          </div>
                        )}
                      </div>
                      <button
                        className="btn-return"
                        onClick={() => returnBook(book._id || book.id, record._id)}
                      >
                        Return Book
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Page */}
        <div id="notificationsPage" className={`page ${activePage === 'notifications' ? 'active-page' : ''}`}>
          <div className="card-elegant">
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
              <p className="notif-page-empty">No new notifications.</p>
            ) : (
              <div className="notif-page-list">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-page-item ${n.read ? 'read' : 'unread'} ${n.type}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="notif-page-row">
                      <span className="notif-page-icon">{getTypeIcon(n.type)}</span>
                      <span className="notif-page-title">{n.title}</span>
                      <button className="notif-page-dismiss" onClick={(e) => dismissNotification(n.id, e)}>×</button>
                    </div>
                    <div className="notif-page-message">{n.message}</div>
                    <div className="notif-page-time">{formatTimeAgo(n.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Page */}
        <div id="profilePage" className={`page ${activePage === 'profile' ? 'active-page' : ''}`}>
          <div className="card-elegant">
            <h2>User Profile</h2>
            <div style={{ marginTop: '20px' }}>
              <div className="profile-row">
                <span className="profile-label">Name:</span>
                {profile.name}
              </div>
              <div className="profile-row">
                <span className="profile-label">Email:</span>
                {profile.email}
              </div>
              <div className="profile-row">
                <span className="profile-label">User ID:</span>
                {profile.id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div style={{ fontSize: '3rem' }}>{popup.icon}</div>
            <h3>{popup.title}</h3>
            <p style={{ margin: '10px 0' }}>{popup.message}</p>
            <button className="popup-btn" onClick={() => setPopup(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;

