import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/admin.css';

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [newUser, setNewUser] = useState({
    username: '',
    role: 'Admin',
    status: 'Active'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await userAPI.getAllUsers();
        setUsers(usersRes.data.data || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        // Fallback to localStorage
        const stored = JSON.parse(localStorage.getItem('vemuUsers') || '[]');
        setUsers(stored);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const username = newUser.username;
    const role = newUser.role.toLowerCase();
    const status = newUser.status;

    const updatedUsers = [...users, { name: username, role, status }];
    setUsers(updatedUsers);
    localStorage.setItem('vemuUsers', JSON.stringify(updatedUsers));

    setAddModalOpen(false);
    setNewUser({ username: '', role: 'Admin', status: 'Active' });
    showToast('User added successfully!');
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (!editUser) return;

    const updatedUsers = users.map(u =>
      u.name === editUser.originalName
        ? { name: editUser.username, role: editUser.role.toLowerCase(), status: editUser.status }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('vemuUsers', JSON.stringify(updatedUsers));

    setEditModalOpen(false);
    setEditUser(null);
    showToast('User details edited successfully!');
  };

  const handleDeleteUser = (userToDelete) => {
    const updatedUsers = users.filter(u => u.name !== userToDelete.name);
    setUsers(updatedUsers);
    localStorage.setItem('vemuUsers', JSON.stringify(updatedUsers));

    const date = new Date().toLocaleDateString();
    const updatedDeleted = [...deletedUsers, { ...userToDelete, deletedOn: date }];
    setDeletedUsers(updatedDeleted);

    showToast('User deleted successfully!');
  };

  const handleRestoreUser = (userToRestore) => {
    const updatedDeleted = deletedUsers.filter(u => u.name !== userToRestore.name);
    setDeletedUsers(updatedDeleted);

    const updatedUsers = [...users, { name: userToRestore.name, role: userToRestore.role, status: 'Active' }];
    setUsers(updatedUsers);
    localStorage.setItem('vemuUsers', JSON.stringify(updatedUsers));

    showToast('User restored successfully!');
  };

  const openEditModal = (u) => {
    setEditUser({
      originalName: u.name,
      username: u.name,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      status: u.status || 'Active'
    });
    setEditModalOpen(true);
  };

  const stats = {
    total: users.length + deletedUsers.length,
    admin: users.filter(u => u.role === 'admin').length,
    librarian: users.filter(u => u.role === 'librarian').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    student: users.filter(u => u.role === 'student').length
  };

  return (
    <div className="admin-page">
      <div id="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> {t.message}
          </div>
        ))}
      </div>

      <div className="sidebar">
        <nav className="nav-menu">
          <h3>VEMU ADMIN</h3>
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}><i className="fas fa-users-cog"></i> Manage Users</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/reports'); }}><i className="fas fa-file-invoice"></i> Reports</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/backup'); }}><i className="fas fa-hdd"></i> Backup & Recovery</a>
          <a href="#" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate('/login'); }} style={{ marginTop: '50px', color: 'var(--danger)' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="dashboard-card">
          <h1>User Management <em>Portal</em></h1>

          <div className="stats-grid">
            <div className="stat-card total">
              <i className="fas fa-users"></i>
              <span className="stat-label">Total Users</span>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-card admin">
              <i className="fas fa-user-shield"></i>
              <span className="stat-label">Admins</span>
              <span className="stat-number">{stats.admin}</span>
            </div>
            <div className="stat-card librarian">
              <i className="fas fa-book-reader"></i>
              <span className="stat-label">Librarians</span>
              <span className="stat-number">{stats.librarian}</span>
            </div>
            <div className="stat-card faculty">
              <i className="fas fa-chalkboard-teacher"></i>
              <span className="stat-label">Faculty</span>
              <span className="stat-number">{stats.faculty}</span>
            </div>
            <div className="stat-card student">
              <i className="fas fa-user-graduate"></i>
              <span className="stat-label">Students</span>
              <span className="stat-number">{stats.student}</span>
            </div>
          </div>

          <button className="btn btn-add" onClick={() => setAddModalOpen(true)}>
            <i className="fas fa-plus"></i> Add New User
          </button>

          {loading && <p>Loading...</p>}

          <table id="usersTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
                  <td className={u.status === 'Active' ? 'status-active' : 'status-inactive'}>{u.status || 'Active'}</td>
                  <td>
                    <button className="btn edit-btn" style={{ padding: '3px 4px', width: '42px', fontSize: '0.65rem' }} onClick={() => openEditModal(u)}>Edit</button>
                    <button className="btn delete-btn" style={{ padding: '3px 4px', width: '42px', fontSize: '0.65rem' }} onClick={() => handleDeleteUser(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Archived / Deleted Users</h2>
          <table id="deletedUsersTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Deleted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((u, idx) => (
                <tr key={idx}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
                  <td>{u.deletedOn}</td>
                  <td>
                    <button className="btn restore-btn" style={{ padding: '3px 4px', width: '42px', fontSize: '0.65rem' }} onClick={() => handleRestoreUser(u)}>Restore</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {addModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setAddModalOpen(false)}>&times;</span>
            <div className="modal-header">Add New User</div>
            <form onSubmit={handleAddUser}>
              <label>Username</label>
              <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
              <label>Role</label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option>Admin</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Librarian</option>
              </select>
              <label>Initial Status</label>
              <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" className="modal-submit">Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editUser && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setEditModalOpen(false)}>&times;</span>
            <div className="modal-header">Modify User</div>
            <form onSubmit={handleEditUser}>
              <label>Username</label>
              <input type="text" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} required />
              <label>Role</label>
              <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                <option>Admin</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Librarian</option>
              </select>
              <label>Status</label>
              <select value={editUser.status} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" className="modal-submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

