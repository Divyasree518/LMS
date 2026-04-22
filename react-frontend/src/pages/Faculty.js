import React from 'react';
import '../styles/faculty.css';

const Faculty = ({ user }) => {
  return (
    <div className="faculty-page">
      <div className="faculty-header">
        <h1>👨‍🏫 Faculty Portal</h1>
        <p>Welcome, Dr. {user?.name}!</p>
      </div>

      <div className="faculty-content">
        <section className="section">
          <h2>My Books</h2>
          <p>Manage your borrowed books and reading lists.</p>
          <div className="faculty-grid">
            <div className="card">
              <h3>Active Loans</h3>
              <p className="stat">5</p>
            </div>
            <div className="card">
              <h3>On Hold</h3>
              <p className="stat">2</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Request Resources</h2>
          <p>Request new books or journals for your courses.</p>
          <button className="btn-faculty">+ New Request</button>
        </section>

        <section className="section">
          <h2>Course Materials</h2>
          <p>Access and manage materials for your courses.</p>
          <div className="faculty-grid">
            <div className="card">
              <h3>CS-101</h3>
              <p>8 resources</p>
            </div>
            <div className="card">
              <h3>CS-202</h3>
              <p>12 resources</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Faculty;
