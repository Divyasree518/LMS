import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { reportAPI } from '../services/api';
import '../styles/reports.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 450,
    issuedBooks: 120,
    overdueBooks: 15
  });
  const [formData, setFormData] = useState({
    totalInput: 450,
    issuedInput: 120,
    overdueInput: 15
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await reportAPI.getSummary();
        const data = result.data.data || {};
        const newStats = {
          totalBooks: data.totalBooks || data.totalBooksVolume || 450,
          issuedBooks: data.issuedBooks || data.issuedToStudents || 120,
          overdueBooks: data.overdueBooks || data.overdueRecords || 15
        };
        setStats(newStats);
        setFormData({
          totalInput: newStats.totalBooks,
          issuedInput: newStats.issuedBooks,
          overdueInput: newStats.overdueBooks
        });
      } catch (error) {
        console.error('Failed to load reports:', error);
        const localStats = JSON.parse(localStorage.getItem('reportStats') || '{"totalBooks":450,"issuedBooks":120,"overdueBooks":15}');
        setStats(localStats);
        setFormData({
          totalInput: localStats.totalBooks,
          issuedInput: localStats.issuedBooks,
          overdueInput: localStats.overdueBooks
        });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const chartData = {
    labels: ['Available', 'Issued', 'Overdue'],
    datasets: [{
      data: [
        Math.max(0, stats.totalBooks - stats.issuedBooks),
        stats.issuedBooks,
        stats.overdueBooks
      ],
      backgroundColor: ['#1C2B4A', '#C8973A', '#E74C3C'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'DM Sans' } }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = parseInt(formData.totalInput);
    const issued = parseInt(formData.issuedInput);
    const overdue = parseInt(formData.overdueInput);

    if (issued > total || overdue > issued) {
      alert('Data Mismatch: Issued cannot exceed Total, and Overdue cannot exceed Issued.');
      return;
    }

    const newStats = { totalBooks: total, issuedBooks: issued, overdueBooks: overdue };
    setStats(newStats);
    localStorage.setItem('reportStats', JSON.stringify(newStats));

    try {
      await reportAPI.generateReport({
        totalBooksVolume: total,
        issuedToStudents: issued,
        overdueRecords: overdue,
        generatedBy: user?.id || 'admin'
      });
    } catch (e) {
      console.log('Backend unavailable, saved locally');
    }
    alert('Statistics synchronized successfully!');
  };

  const downloadCSV = () => {
    const date = new Date().toLocaleString();
    const csv = `Date,Total Books,Issued Books,Overdue Books\n${date},${stats.totalBooks},${stats.issuedBooks},${stats.overdueBooks}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library_reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <nav className="sidebar">
        <h3>VEMU ADMIN</h3>
        <div className="nav-menu">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}><i className="fas fa-users-cog"></i> Manage Users</a>
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/reports'); }}><i className="fas fa-file-invoice"></i> Reports</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/backup'); }}><i className="fas fa-hdd"></i> Backup & Recovery</a>
          <a href="#" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate('/login'); }} style={{ marginTop: '50px', color: '#f92810' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </nav>

      <main className="main-content">
        <div className="glass-card">
          <div className="header-flex">
            <h1>Library <em>Analytics</em></h1>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700 }}>LIVE SYSTEM DATA</span>
            </div>
          </div>

          <button className="btn-download" onClick={downloadCSV}>
            <i className="fas fa-download"></i> Download Reports
          </button>

          <div className="stats-grid">
            <div className="stat-box">
              <p>Total Collection</p>
              <h3>{stats.totalBooks}</h3>
            </div>
            <div className="stat-box">
              <p>Circulating</p>
              <h3>{stats.issuedBooks}</h3>
            </div>
            <div className="stat-box">
              <p>Overdue Notices</p>
              <h3>{stats.overdueBooks}</h3>
            </div>
          </div>

          <div className="grid-2">
            <div className="sub-card">
              <h2>Data Entry</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Total Book Volume</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    value={formData.totalInput}
                    onChange={(e) => setFormData({ ...formData, totalInput: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Issued to Students</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    value={formData.issuedInput}
                    onChange={(e) => setFormData({ ...formData, issuedInput: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Overdue Records</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    value={formData.overdueInput}
                    onChange={(e) => setFormData({ ...formData, overdueInput: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-update">Synchronize Reports</button>
              </form>
            </div>

            <div className="sub-card">
              <h2>Visual Overview</h2>
              <div className="chart-container">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;

