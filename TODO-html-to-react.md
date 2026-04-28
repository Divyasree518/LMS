# HTML to React Conversion Plan

## Information Gathered

### HTML Pages (Source of Truth for UI/UX)
1. **adminstrator.html** / **admin_dashboard.html** - Admin User Management Portal
   - Sidebar navigation with gold/navy theme
   - Stats cards (Total, Admin, Librarian, Faculty, Student)
   - User table with Edit/Delete/Restore actions
   - Add/Edit user modals
   - Toast notifications
   - localStorage-based user management

2. **faculty_dashboard.html** - Faculty Book Recommendations
   - Navbar with navy/gold theme
   - Recommendation submission form
   - Search/filter toolbar
   - Recommendation cards grid
   - Edit modal
   - Toast notifications
   - localStorage-based recommendations

3. **libraryDashboard.html** - Librarian Management System
   - Sidebar navigation
   - Add Book form
   - Inventory table
   - Issue/Return system
   - Fine Calculator
   - Activity Logs
   - Section-based navigation

4. **student_dashboard.html** - Student Portal
   - Navbar with sticky positioning
   - Book grid with search
   - Notifications page
   - Profile page
   - Popup modal for messages
   - Tab-based navigation

5. **Reports.html** - Analytics & Reports
   - Sidebar navigation
   - Stats grid (Total, Circulating, Overdue)
   - Data Entry form
   - Chart.js doughnut chart
   - Download CSV functionality

6. **backup.html** - Backup & Recovery
   - Sidebar navigation
   - Backup download (JSON)
   - Restore upload (JSON)
   - Toast notifications

7. **login.html** - Role-Based Authentication
   - Background image with overlay
   - Role selection dropdown
   - Success/Error modal popup
   - Redirect based on role

### Existing React Pages (Need Updating)
- **Admin.js** - Too basic, needs full adminstrator.html UI
- **Faculty.js** - Too basic, needs faculty_dashboard.html UI
- **StudentPortal.js** - Too basic, needs student_dashboard.html UI
- **Reports.js** - Too basic, needs Reports.html UI
- **Login.js** - Different UI from login.html
- **Books.js** - OK as-is (no HTML equivalent)
- **Home.js** - OK as-is (no HTML equivalent)
- **Signup.js** - OK as-is (no HTML equivalent)

### Missing React Pages
- **Librarian.js** - Need to create from libraryDashboard.html
- **Backup.js** - Need to create from backup.html

## Plan

### Phase 1: Update Existing Pages to Match HTML UI/UX

#### 1. Update `react-frontend/src/pages/Admin.js`
- Replace with adminstrator.html layout (sidebar, stats, tables, modals)
- Preserve all CSS styles as CSS-in-JS or admin.css
- Keep React state management for users, modals, toasts
- Integrate with existing API service

#### 2. Update `react-frontend/src/pages/Faculty.js`
- Replace with faculty_dashboard.html layout (navbar, form, cards, modal)
- Preserve all CSS styles
- Keep React state for recommendations
- Integrate with existing API service

#### 3. Update `react-frontend/src/pages/StudentPortal.js`
- Replace with student_dashboard.html layout (navbar, book grid, tabs)
- Preserve all CSS styles
- Keep React state for books, notifications, profile
- Integrate with existing API service

#### 4. Update `react-frontend/src/pages/Reports.js`
- Replace with Reports.html layout (sidebar, stats, chart, form)
- Preserve all CSS styles
- Add Chart.js integration
- Keep React state for reports data
- Integrate with existing API service

#### 5. Update `react-frontend/src/pages/Login.js`
- Replace with login.html layout (background, form, modal)
- Preserve all CSS styles
- Keep React state and auth hook integration
- Add role selection

### Phase 2: Create New Pages

#### 6. Create `react-frontend/src/pages/Librarian.js`
- Convert libraryDashboard.html to React
- Preserve sidebar, sections, forms, tables
- Keep React state for books, circulation, logs
- Integrate with existing API service

#### 7. Create `react-frontend/src/pages/Backup.js`
- Convert backup.html to React
- Preserve sidebar, action boxes
- Keep React state for backup/restore
- Integrate with existing API service

### Phase 3: Update Routing & Styles

#### 8. Update `react-frontend/src/App.js`
- Add routes for `/librarian` and `/backup`
- Update role-based redirects
- Ensure ProtectedRoute covers new pages

#### 9. Update/Create CSS Files
- `admin.css` - Match adminstrator.html styles
- `faculty.css` - Match faculty_dashboard.html styles
- `student-portal.css` - Match student_dashboard.html styles
- `reports.css` - Match Reports.html styles
- `login.css` - Match login.html styles
- `librarian.css` - Match libraryDashboard.html styles
- `backup.css` - Match backup.html styles

### Phase 4: Testing & Integration

#### 10. Verify all pages
- Check that UI/UX matches original HTML exactly
- Ensure all interactions work (modals, toasts, forms)
- Verify API integration points
- Test navigation between pages

## Dependent Files to Edit
- `react-frontend/src/App.js` - Add new routes
- `react-frontend/src/pages/Admin.js` - Complete rewrite
- `react-frontend/src/pages/Faculty.js` - Complete rewrite
- `react-frontend/src/pages/StudentPortal.js` - Complete rewrite
- `react-frontend/src/pages/Reports.js` - Complete rewrite
- `react-frontend/src/pages/Login.js` - Complete rewrite
- `react-frontend/src/pages/Librarian.js` - New file
- `react-frontend/src/pages/Backup.js` - New file
- `react-frontend/src/styles/admin.css` - Update
- `react-frontend/src/styles/faculty.css` - Update
- `react-frontend/src/styles/student-portal.css` - Update
- `react-frontend/src/styles/reports.css` - Update
- `react-frontend/src/styles/login.css` - Update
- `react-frontend/src/styles/librarian.css` - New file
- `react-frontend/src/styles/backup.css` - New file

## Followup Steps
1. Install Chart.js if not already installed (`npm install chart.js react-chartjs-2`)
2. Test all routes in browser
3. Verify responsive design
4. Check API endpoints match backend

