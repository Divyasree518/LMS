# VEMU Library Management System (LMS)

## Overview
100% **Frontend-Only** static web app. No backend, server, or external dependencies required.
- **Authentication**: localStorage-based signup/login with roles (admin, faculty, librarian, student).
- **Data**: All books/users/fines stored in browser localStorage.
- **Features**: Dashboards, book search/borrow, reports, real-time counts (polling).
- **AI Chat**: Built-in Telugu/English assistant.

## How to Run
1. Open any HTML file (e.g., `signinpage.html`, `Home.html`) in browser.
2. Signup → Login with role → Access dashboard.
3. Offline-first: Works without internet.

## Pages
- `signinpage.html`: Signup/Login
- `login.html`: Role-based login
- `adminstrator.html`: Admin dashboard
- `libraryDashboard.html`: Librarian
- `student_portal/`: Student/Faculty portals
- etc.

**Backend Removed**: All API/fetch calls converted to localStorage. Fully static!

