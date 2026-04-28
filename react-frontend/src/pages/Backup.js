import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/backup.css';

const Backup = ({ user }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '' });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const downloadBackup = () => {
    const userData = localStorage.getItem('vemuUsers');

    if (!userData || userData === '[]') {
      showNotification('No data found to backup!');
      return;
    }

    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `Vemu_Library_Backup_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Backup downloaded successfully!');
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        if (Array.isArray(importedData)) {
          localStorage.setItem('vemuUsers', JSON.stringify(importedData));
          showNotification('Data restored successfully!');
          event.target.value = '';
        } else {
          alert('Invalid file format. Please upload a valid Vemu backup file.');
        }
      } catch (err) {
        alert('Error reading file. Make sure it\'s a valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="backup-page">
      <div
        id="toast"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--navy)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          borderLeft: '5px solid var(--gold)',
          display: toast.show ? 'block' : 'none',
          animation: 'slideUp 0.5s',
          zIndex: 9999,
        }}
      >
        {toast.message}
      </div>

      <nav className="sidebar">
        <h3>VEMU ADMIN</h3>
        <div className="nav-menu">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
            <i className="fas fa-users-cog"></i> Manage Users
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/reports'); }}>
            <i className="fas fa-file-invoice"></i> Reports
          </a>
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/backup'); }}>
            <i className="fas fa-hdd"></i> Backup & Recovery
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate('/login'); }}
            style={{ marginTop: '50px', color: '#f92810' }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </nav>

      <div className="main-content">
        <div className="backup-card">
          <h1>Data <em>Management</em></h1>
          <p>Export your user database or restore from a previous backup file.</p>

          <div className="action-grid">
            <div className="action-box" onClick={downloadBackup}>
              <i className="fas fa-download"></i>
              <h3>Backup Data</h3>
              <p>Download all user records as a .json file</p>
              <button className="btn-execute">Download JSON</button>
            </div>

            <div className="action-box" onClick={() => document.getElementById('fileInput').click()}>
              <i className="fas fa-upload"></i>
              <h3>Restore Data</h3>
              <p>Upload a .json file to restore users</p>
              <input type="file" id="fileInput" accept=".json" style={{ display: 'none' }} onChange={handleRestore} />
              <button className="btn-execute">Upload File</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;

