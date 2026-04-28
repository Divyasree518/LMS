import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/faculty.css';

const STORAGE_KEY = 'vemu_faculty_book_recommendations_v1';
const NOTIFS_KEY = 'vemu_faculty_notifications_v1';

const departmentOptions = [
  'CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'MBA',
  'Science', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Other'
];

const defaultNotifications = [
  {
    id: 'notif_1',
    type: 'info',
    title: 'Welcome Faculty',
    message: 'You can now submit book recommendations for your department.',
    createdAt: Date.now(),
    read: false
  },
  {
    id: 'notif_2',
    type: 'alert',
    title: 'Library Hours Update',
    message: 'Library will remain open until 8 PM during exam weeks.',
    createdAt: Date.now() - 86400000,
    read: false
  },
  {
    id: 'notif_3',
    type: 'success',
    title: 'New Arrivals',
    message: 'New Computer Science textbooks have been added to the catalog.',
    createdAt: Date.now() - 172800000,
    read: true
  }
];

const Faculty = ({ user }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', success: true });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRec, setEditRec] = useState(null);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    department: '',
    description: ''
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecommendations(parsed);
      }
    } catch (e) {
      console.error('Failed to load recommendations', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendations));
  }, [recommendations]);

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

  const showToast = (message, success = true) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: true }), 2800);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { bookTitle, authorName, department, description } = formData;

    if (!bookTitle.trim() || !authorName.trim() || !department || !description.trim()) {
      showToast('Please fill in all fields.', false);
      return;
    }

    const newRec = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
      title: bookTitle.trim(),
      author: authorName.trim(),
      department,
      description: description.trim(),
      createdAt: Date.now()
    };

    setRecommendations(prev => [newRec, ...prev]);
    setFormData({ bookTitle: '', authorName: '', department: '', description: '' });
    showToast('Recommendation added.', true);
    addNotification('success', 'Recommendation Submitted', `"${bookTitle.trim()}" has been added to your recommendations.`);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this recommendation from your list?')) return;
    const rec = recommendations.find(r => r.id === id);
    setRecommendations(prev => prev.filter(r => r.id !== id));
    showToast('Recommendation removed.', true);
    if (rec) {
      addNotification('alert', 'Recommendation Removed', `"${rec.title}" was removed from your list.`);
    }
  };

  const openEdit = (rec) => {
    setEditRec({ ...rec });
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { title, author, department, description } = editRec;
    if (!title.trim() || !author.trim() || !department || !description.trim()) {
      showToast('Please complete all edit fields.', false);
      return;
    }

    setRecommendations(prev => prev.map(r => r.id === editRec.id ? { ...editRec } : r));
    setEditModalOpen(false);
    setEditRec(null);
    showToast('Recommendation updated.', true);
    addNotification('info', 'Recommendation Updated', `"${title.trim()}" has been updated.`);
  };

  const filtered = recommendations.filter(r => {
    const titleMatch = !searchTerm || (r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const deptMatch = !filterDept || r.department === filterDept;
    return titleMatch && deptMatch;
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

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

  return (
    <div className="faculty-page">
      <nav className="navbar">
        <div className="navbar-brand">Vemu Library — Faculty Recommendations</div>
        <div className="nav-links">
          <button type="button" className="nav-btn" onClick={() => navigate('/books')}>Catalog</button>

          {/* Notification Bell */}
          <div className="notif-wrapper">
            <button
              type="button"
              className="nav-btn notif-btn"
              onClick={() => setNotifOpen(prev => !prev)}
              aria-label="Notifications"
            >
              <span className="notif-bell">🔔</span>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="notif-panel">
                <div className="notif-header">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && (
                    <button className="notif-markall" onClick={markAllAsRead}>Mark all read</button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${n.read ? 'read' : 'unread'} ${n.type}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="notif-row">
                          <span className="notif-dot"></span>
                          <span className="notif-title">{n.title}</span>
                          <button
                            className="notif-dismiss"
                            onClick={(e) => dismissNotification(n.id, e)}
                            aria-label="Dismiss"
                          >
                            ×
                          </button>
                        </div>
                        <div className="notif-message">{n.message}</div>
                        <div className="notif-time">{formatTimeAgo(n.createdAt)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button type="button" className="nav-btn primary" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
        </div>
      </nav>

      <main className="main">
        <h1 className="page-title">Book recommendation system</h1>
        <p className="page-sub">Suggest titles for the library collection. Your list is saved on this device until you clear it.</p>

        <section className="card" aria-labelledby="form-heading">
          <h2 id="form-heading">Submit a recommendation</h2>
          <form onSubmit={handleSubmit} className="form-grid" noValidate>
            <div className="form-grid two">
              <div>
                <label htmlFor="bookTitle">Book title</label>
                <input
                  type="text"
                  id="bookTitle"
                  required
                  autoComplete="off"
                  placeholder="e.g., Introduction to Algorithms"
                  value={formData.bookTitle}
                  onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="authorName">Author</label>
                <input
                  type="text"
                  id="authorName"
                  required
                  autoComplete="off"
                  placeholder="Author name"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="department">Subject / department</label>
              <select
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select department</option>
                {departmentOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description">Description or reason</label>
              <textarea
                id="description"
                required
                placeholder="Why should the library acquire this book?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-submit">Submit recommendation</button>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="filter-heading">
          <h2 id="filter-heading">Browse recommendations</h2>
          <div className="toolbar">
            <div className="field-grow">
              <label htmlFor="searchInput">Search by title</label>
              <input
                type="search"
                id="searchInput"
                placeholder="Type to filter..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterDepartment">Filter by department</label>
              <select
                id="filterDepartment"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="">All departments</option>
                {departmentOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="card" aria-labelledby="list-heading">
          <h2 id="list-heading">Recommended books</h2>
          <div className="recommendations-grid" role="list">
            {filtered.length === 0 ? (
              <p className="empty-state" role="status">
                {recommendations.length === 0
                  ? 'No recommendations yet. Use the form above to add your first one.'
                  : 'No entries match your search or filter.'}
              </p>
            ) : (
              filtered.map(r => (
                <article className="rec-card" role="listitem" key={r.id}>
                  <div className="rec-card-header">
                    <div className="rec-title">{r.title}</div>
                    <span className="rec-badge">{r.department}</span>
                  </div>
                  <div className="rec-meta"><strong>Author:</strong> {r.author}</div>
                  <div className="rec-desc">{r.description}</div>
                  <div className="rec-actions">
                    <button type="button" className="btn-sm" onClick={() => openEdit(r)}>Edit</button>
                    <button type="button" className="btn-sm danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Edit Modal */}
      {editModalOpen && editRec && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setEditModalOpen(false); }}>
          <div className="modal">
            <h3>Edit recommendation</h3>
            <form onSubmit={handleEditSubmit} className="form-grid">
              <input type="hidden" value={editRec.id} readOnly />
              <div className="form-grid two">
                <div>
                  <label htmlFor="editTitle">Book title</label>
                  <input
                    type="text"
                    id="editTitle"
                    required
                    value={editRec.title}
                    onChange={(e) => setEditRec({ ...editRec, title: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="editAuthor">Author</label>
                  <input
                    type="text"
                    id="editAuthor"
                    required
                    value={editRec.author}
                    onChange={(e) => setEditRec({ ...editRec, author: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="editDepartment">Subject / department</label>
                <select
                  id="editDepartment"
                  required
                  value={editRec.department}
                  onChange={(e) => setEditRec({ ...editRec, department: e.target.value })}
                >
                  {departmentOptions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editDescription">Description</label>
                <textarea
                  id="editDescription"
                  required
                  value={editRec.description}
                  onChange={(e) => setEditRec({ ...editRec, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-submit">Save changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.success ? 'success' : ''}`} role="status">
        {toast.message}
      </div>
    </div>
  );
};

export default Faculty;

