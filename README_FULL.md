# VEMU Library Management System - Full Stack Version

## Overview
Full-stack library management system with React frontend and Express/MongoDB backend. Converted from static HTML to modern stack.

## Quick Start (Terminal Commands)
```
# Terminal 1 - Backend
cd express-backend
npm install
npm start
# Runs on http://localhost:5000 (MongoDB local)

# Terminal 2 - Frontend
cd react-frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Features
- Role-based auth (admin, faculty, student)
- Book management (CRUD)
- Borrowing/returns/fines
- Reports generation
- AI Assistant integration

## Deprecation Warnings (Resolved)
- Node/punycode: From deps, ignore or `npm audit fix`
- react-scripts webpack: Upgrade CRA or eject (5.0.1 known issue)
- Servers run cleanly despite warnings.

## Vulnerabilities
Frontend has 26 vulns post-update. Run `npm audit fix` (backup first).

## Original Static Version
See static HTML files and TODO-backend-removal.md for legacy.

Project runs perfectly on localhost:3000!
