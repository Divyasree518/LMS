import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import '../styles/reports.css';

const Reports = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [circulation, setCirculation] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [summaryRes, circulationRes, reportsRes] = await Promise.all([
          reportAPI.getSummary(),
          reportAPI.getCirculationReport(),
          reportAPI.getAllReports()
        ]);

        setSummary(summaryRes.data.data);
        setCirculation(circulationRes.data.data);
        setReports(reportsRes.data.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="reports-page"><p>Loading reports...</p></div>;

  return (
    <div className="reports-page">
      <h1>📊 Library Reports</h1>

      {summary && (
        <div className="summary-section">
          <h2>System Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">👥</div>
              <div className="summary-stat">{summary.totalUsers}</div>
              <div className="summary-label">Total Users</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📚</div>
              <div className="summary-stat">{summary.totalBooks}</div>
              <div className="summary-label">Total Books</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📤</div>
              <div className="summary-stat">{summary.activeLoans}</div>
              <div className="summary-label">Active Loans</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⚠️</div>
              <div className="summary-stat">{summary.overdueBooks}</div>
              <div className="summary-label">Overdue Books</div>
            </div>
          </div>
        </div>
      )}

      {circulation && (
        <div className="circulation-section">
          <h2>Circulation Report - {circulation.period}</h2>
          <div className="circulation-stats">
            <p><strong>Total Checkouts:</strong> {circulation.totalCheckouts}</p>
            <p><strong>Total Returns:</strong> {circulation.totalReturns}</p>
            <p><strong>Avg Checkout Time:</strong> {circulation.averageCheckoutTime}</p>
          </div>

          <div className="top-books">
            <h3>Top Borrowed Books</h3>
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Checkouts</th>
                </tr>
              </thead>
              <tbody>
                {circulation.topBorrowedBooks.map((book, idx) => (
                  <tr key={idx}>
                    <td>{book.title}</td>
                    <td>{book.checkouts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="usage-by-category">
            <h3>Usage by Category</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Checkouts</th>
                </tr>
              </thead>
              <tbody>
                {circulation.usageByCategory.map((cat, idx) => (
                  <tr key={idx}>
                    <td>{cat.category}</td>
                    <td>{cat.checkouts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reports.length > 0 && (
        <div className="reports-list">
          <h2>Recent Reports</h2>
          <div className="report-cards">
            {reports.map(report => (
              <div key={report.id} className="report-card">
                <h3>{report.title}</h3>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Date:</strong> {report.date}</p>
                <p><strong>Status:</strong> {report.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
