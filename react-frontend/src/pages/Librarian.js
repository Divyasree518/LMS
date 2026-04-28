import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI, userAPI } from '../services/api';
import '../styles/librarian.css';

const FINE_PER_DAY = 1;

const Librarian = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inventory');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: '',
    qty: 1
  });

  const [memberId, setMemberId] = useState('');
  const [issueBookId, setIssueBookId] = useState('');
  const [returnBookId, setReturnBookId] = useState('');

  const [dueDate, setDueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [fineResult, setFineResult] = useState(null);

  // User management state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'General'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, usersRes] = await Promise.all([
        bookAPI.getAllBooks(),
        userAPI.getAllUsers()
      ]);
      setBooks(booksRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    return error?.response?.data?.error || error?.message || 'Something went wrong';
  };

  const loadBorrowRecords = async () => {
    try {
      setLoadingRecords(true);
      const res = await bookAPI.getAllBorrowRecords();
      setBorrowRecords(res.data.data || []);
    } catch (error) {
      console.error('Failed to load borrow records:', error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await bookAPI.createBook({
        title: bookForm.title,
        author: bookForm.author,
        category: bookForm.category,
        total: parseInt(bookForm.qty)
      });
      alert('Book added successfully!');
      setBookForm({ title: '', author: '', category: '', qty: 1 });
      await loadData();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleIssue = async () => {
    if (!memberId || !issueBookId) {
      alert('Please select a borrower and a book');
      return;
    }
    try {
      await bookAPI.borrowBook(issueBookId, memberId);
      alert('Book issued successfully!');
      setMemberId('');
      setIssueBookId('');
      await loadData();
      if (activeSection === 'reports') {
        await loadBorrowRecords();
      }
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleReturn = async () => {
    if (!returnBookId) {
      alert('Select a book to return');
      return;
    }
    try {
      await bookAPI.returnBook(returnBookId);
      alert('Book returned successfully!');
      setReturnBookId('');
      await loadData();
      if (activeSection === 'reports') {
        await loadBorrowRecords();
      }
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const downloadReports = () => {
    if (borrowRecords.length === 0) {
      alert('No records to download');
      return;
    }
    const headers = ['#', 'Borrower', 'Book', 'Author', 'Borrowed On', 'Due Date', 'Returned On', 'Status', 'Fine (Rs.)'];
    const rows = borrowRecords.map((r, idx) => [
      idx + 1,
      r.userId?.name || r.userId?.username || 'Unknown',
      r.bookId?.title || 'Unknown Book',
      r.bookId?.author || '',
      r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : '-',
      r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-',
      r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '-',
      r.status,
      r.fine || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `issue_return_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateFine = () => {
    const d1 = new Date(dueDate);
    const d2 = new Date(returnDate);
    if (isNaN(d1) || isNaN(d2)) {
      alert('Select valid dates');
      return;
    }
    const diff = d2 - d1;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const fine = days > 0 ? days * FINE_PER_DAY : 0;
    setFineResult({ fine, days, overdue: days > 0 });
  };

  // User management handlers
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: 'General'
    });
    setUserModalOpen(true);
  };

  const openEditUserModal = (u) => {
    setEditingUser(u);
    setUserForm({
      username: u.username || '',
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'student',
      department: u.department || 'General'
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = {
          username: userForm.username,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          department: userForm.department
        };
        if (userForm.password) {
          updateData.password = userForm.password;
        }
        await userAPI.updateUser(editingUser._id || editingUser.id, updateData);
        alert('User updated successfully!');
      } else {
        await userAPI.createUser({
          username: userForm.username,
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: userForm.role,
          department: userForm.department
        });
        alert('User added successfully!');
      }
      setUserModalOpen(false);
      await loadData();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Are you sure you want to delete ${u.name || u.username}?`)) return;
    try {
      await userAPI.deleteUser(u._id || u.id);
      alert('User deleted successfully!');
      await loadData();
    } catch (error) {
      alert('Error: ' + getErrorMessage(error));
    }
  };

  const availableBooks = books.filter(b => b.available > 0);
  const issuedBooks = books.filter(b => b.available < b.total);
  const manageableUsers = users.filter(u => u.role === 'student' || u.role === 'faculty');

  return (
    <div className="librarian-page">
      <div className="sidebar">
        <h2>VEMU Library</h2>
        <nav className="nav-menu">
          <a href="#" className={activeSection === 'inventory' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('inventory'); }}>
            <i className="fas fa-list"></i> Inventory
          </a>
          <a href="#" className={activeSection === 'circulation' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('circulation'); }}>
            <i className="fas fa-sync"></i> Issue/Return
          </a>
          <a href="#" className={activeSection === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('users'); }}>
            <i className="fas fa-users"></i> Manage Users
          </a>
          <a href="#" className={activeSection === 'calc' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('calc'); }}>
            <i className="fas fa-calculator"></i> Fine Calculator
          </a>
          <a href="#" className={activeSection === 'reports' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('reports'); loadBorrowRecords(); }}>
            <i className="fas fa-file-alt"></i> Issue/Return Reports
          </a>
          <a href="#" className={activeSection === 'logs' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveSection('logs'); }}>
            <i className="fas fa-history"></i> Activity Logs
          </a>
        </nav>
      </div>

      <div className="main-content">
        {/* Add Book Section */}
        <div className="card">
          <h1>Add <em>New Book</em></h1>
          <form onSubmit={handleAddBook} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label>Title</label>
              <input type="text" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Author</label>
              <input type="text" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Category</label>
              <input type="text" value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })} />
            </div>
            <div style={{ width: '120px' }}>
              <label>Quantity</label>
              <input type="number" min="1" value={bookForm.qty} onChange={(e) => setBookForm({ ...bookForm, qty: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '150px' }}>Add</button>
          </form>
        </div>

        {/* Inventory Section */}
        <div id="inventory" className={`section ${activeSection === 'inventory' ? 'active' : ''}`}>
          <div className="card">
            <h1>Book <em>Catalog</em></h1>
            {loading ? (
              <p>Loading books...</p>
            ) : (
              <table>
                <thead>
                  <tr><th>ID</th><th>Book Title</th><th>Author</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {books.map(b => (
                    <tr key={b._id || b.id}>
                      <td>{(b._id || b.id || '').substring(0, 8)}...</td>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>
                        <span className={`badge ${b.available > 0 ? 'b-avail' : 'b-issued'}`}>
                          {b.available > 0 ? 'Available' : 'Issued'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Circulation Section */}
        <div id="circulation" className={`section ${activeSection === 'circulation' ? 'active' : ''}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="card">
              <h1>Issue <em>System</em></h1>
              <label>Select Borrower</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u._id || u.id} value={u.username}>{u.name} ({u.username} - {u.role})</option>
                ))}
              </select>
              <label>Select Book</label>
              <select value={issueBookId} onChange={(e) => setIssueBookId(e.target.value)}>
                <option value="">Select a book</option>
                {availableBooks.map(b => (
                  <option key={b._id || b.id} value={b._id || b.id}>{b.title} ({b.available} available)</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleIssue}>Issue Book</button>
            </div>
            <div className="card">
              <h1>Return <em>System</em></h1>
              <label>Select Book to Return</label>
              <select value={returnBookId} onChange={(e) => setReturnBookId(e.target.value)}>
                <option value="">Select a book</option>
                {issuedBooks.map(b => (
                  <option key={b._id || b.id} value={b._id || b.id}>{b.title} ({b.total - b.available} issued)</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleReturn}>Confirm Return</button>
            </div>
          </div>
        </div>

        {/* Manage Users Section */}
        <div id="users" className={`section ${activeSection === 'users' ? 'active' : ''}`}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: 0 }}>Manage <em>Users</em></h1>
              <button className="btn btn-primary" onClick={openAddUserModal}>
                <i className="fas fa-plus"></i> Add User
              </button>
            </div>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {manageableUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No users found</td>
                    </tr>
                  ) : (
                    manageableUsers.map(u => (
                      <tr key={u._id || u.id}>
                        <td><strong>{u.username}</strong></td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'faculty' ? 'b-avail' : 'b-issued'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.department || 'General'}</td>
                        <td>
                          <button className="btn btn-primary" style={{ marginRight: '8px', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => openEditUserModal(u)}>
                            Edit
                          </button>
                          <button className="btn" style={{ background: 'var(--danger)', color: '#fff', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDeleteUser(u)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Fine Calculator Section */}
        <div id="calc" className={`section ${activeSection === 'calc' ? 'active' : ''}`}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h1>Fine <em>Calculator</em></h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '20px' }}>
              Current Rate: <strong>Rs.1.00 / day</strong>
            </p>
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <label>Actual Return Date</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            <button className="btn btn-primary" onClick={calculateFine}>Calculate Charges</button>
            {fineResult && (
              <div className="fine-box">
                <h3>{fineResult.overdue ? 'Overdue Charges' : 'On Time / Early'}</h3>
                <div className={`amount-circle ${fineResult.overdue ? 'overdue' : 'ontime'}`}>
                  Rs.{fineResult.fine}
                </div>
                <p style={{ fontWeight: 'bold' }}>
                  {fineResult.overdue ? `${fineResult.days} Days Delay` : 'No Fine Applicable'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Issue/Return Reports Section */}
        <div id="reports" className={`section ${activeSection === 'reports' ? 'active' : ''}`}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: 0 }}>Issue / Return <em>Reports</em></h1>
              <button className="btn btn-primary" onClick={downloadReports}>
                <i className="fas fa-download"></i> Download Reports
              </button>
            </div>
            {loadingRecords ? (
              <p>Loading records...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Borrower</th>
                    <th>Book</th>
                    <th>Borrowed On</th>
                    <th>Due Date</th>
                    <th>Returned On</th>
                    <th>Status</th>
                    <th>Fine (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: '#999' }}>No borrow records found</td>
                    </tr>
                  ) : (
                    borrowRecords.map((r, idx) => (
                      <tr key={r._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{r.userId?.name || r.userId?.username || 'Unknown'}</td>
                        <td>{r.bookId?.title || 'Unknown Book'}</td>
                        <td>{r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : '-'}</td>
                        <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                        <td>{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <span className={`badge ${r.status === 'borrowed' ? 'b-issued' : r.status === 'overdue' ? 'b-overdue' : 'b-avail'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>{r.fine || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Logs Section */}
        <div id="logs" className={`section ${activeSection === 'logs' ? 'active' : ''}`}>
          <div className="card">
            <h1>Transaction <em>History</em></h1>
            <table>
              <thead>
                <tr><th>Date</th><th>Member</th><th>Book</th><th>Action</th><th>Fine</th></tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>No transactions yet</td>
                  </tr>
                ) : (
                  logs.map((l, idx) => (
                    <tr key={idx}>
                      <td>{l.date}</td>
                      <td>{l.member}</td>
                      <td>{l.title}</td>
                      <td>{l.type}</td>
                      <td>{l.fine}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Modal (Add/Edit) */}
      {userModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setUserModalOpen(false)}>&times;</span>
            <div className="modal-header">{editingUser ? 'Edit User' : 'Add New User'}</div>
            <form onSubmit={handleSaveUser}>
              <label>Username</label>
              <input type="text" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} required />
              <label>Full Name</label>
              <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
              <label>Email</label>
              <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
              <label>Password {editingUser && '(leave blank to keep unchanged)'}</label>
              <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={!editingUser} />
              <label>Role</label>
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
              <label>Department</label>
              <input type="text" value={userForm.department} onChange={(e) => setUserForm({ ...userForm, department: e.target.value })} />
              <button type="submit" className="modal-submit">{editingUser ? 'Save Changes' : 'Create Account'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Librarian;

