# 🚀 Quick Start Guide - Vemu Library Management System

## 5-Minute Setup

### Step 1: Open Two Terminals

**Terminal 1 - Backend**
```bash
cd express-backend
npm install
npm start
```
You should see: `Backend server running on http://localhost:5000`

**Terminal 2 - Frontend**
```bash
cd react-frontend
npm install
npm start
```
Your browser will automatically open at `http://localhost:3000`

### Step 2: Login

Use any of these demo accounts:
- **Student**: student1 / student123
- **Faculty**: faculty1 / faculty123
- **Admin**: admin / admin123

That's it! 🎉

---

## 📋 Project Structure Overview

```
Your Project
├── react-frontend/          ← React application (Port 3000)
├── express-backend/         ← Express API server (Port 5000)
├── README_FULL_STACK_CONVERSION.md  ← Complete documentation
└── QUICK_START.md          ← This file
```

---

## ✅ What's Included

### Frontend Features
- ✅ Home/Landing Page
- ✅ Login & Signup System
- ✅ Student Portal
- ✅ Faculty Portal
- ✅ Admin Dashboard
- ✅ Books Catalog
- ✅ Reports & Analytics
- ✅ AI Chat Assistant
- ✅ Responsive Design
- ✅ Same UI as original

### Backend Features
- ✅ User Authentication
- ✅ User Management
- ✅ Book Library System
- ✅ Book Borrowing/Returning
- ✅ Reports Generation
- ✅ Mock Data (No Database)
- ✅ Error Handling
- ✅ CORS Enabled

---

## 🔑 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Student | student1 | student123 |
| Faculty | faculty1 | faculty123 |
| Admin | admin | admin123 |

---

## 🎯 Testing Each Page

### As Student (Login: student1)
1. ✅ View Home Page
2. ✅ Access Student Portal
3. ✅ Browse Books
4. ✅ View Reports

### As Faculty (Login: faculty1)
1. ✅ View Home Page
2. ✅ Access Faculty Portal
3. ✅ Manage Resources
4. ✅ View Reports

### As Admin (Login: admin)
1. ✅ View Home Page
2. ✅ Admin Dashboard
3. ✅ User Management
4. ✅ Book Management
5. ✅ System Reports

---

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -i :5000
kill -9 [PID]
```

### Port 3000 Already in Use
```bash
# The React app will suggest an alternative port
# Press 'Y' to use the next available port (typically 3001)
```

### Module Not Found Error
```bash
# In either frontend or backend directory:
rm -rf node_modules
npm install
```

### API Connection Error
Make sure:
1. Backend is running on port 5000
2. Frontend .env.local has: `REACT_APP_API_URL=http://localhost:5000/api`
3. Both are on different ports

---

## 📱 API Testing

Open a new terminal and test the backend directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"student123","role":"student"}'

# Get all books
curl http://localhost:5000/api/books

# Get all users
curl http://localhost:5000/api/users
```

---

## 🎨 Customization Tips

### Change Colors
Edit in `react-frontend/src/styles/globals.css`:
```css
:root {
  --navy: #1C2B4A;      /* Change this */
  --gold: #C8973A;      /* Or this */
  --cream: #FAF7F2;     /* Color palette */
}
```

### Add New Routes
1. Create page in `react-frontend/src/pages/`
2. Import in `App.js`
3. Add route: `<Route path="/new-page" element={<NewPage />} />`

### Add New API Endpoints
1. Create route file in `express-backend/routes/`
2. Create controller in `express-backend/controllers/`
3. Import route in `server.js`

---

## 📊 File Sizes

- Backend: ~40 KB (excluding node_modules)
- Frontend: ~50 KB (excluding node_modules)
- Total with node_modules: ~300 MB

---

## 🔒 Security Notes

This is a **development/demo** setup. For production:
- ✅ Use proper JWT tokens
- ✅ Add password hashing (bcrypt)
- ✅ Store sensitive data in .env
- ✅ Use HTTPS
- ✅ Implement rate limiting
- ✅ Add input validation
- ✅ Database instead of mock data

---

## 📚 Next Steps

1. **Understand the structure**: Review the main files
2. **Test all features**: Try different roles and pages
3. **Modify styles**: Customize colors and fonts
4. **Add features**: Create new components and routes
5. **Connect database**: Replace mock data with real DB

---

## 🎓 Learning Paths

### Frontend Development
1. Understand React components in `/pages/`
2. Study routing in `App.js`
3. Learn state management in `useAuth.js`
4. Explore CSS organization

### Backend Development
1. Review Express setup in `server.js`
2. Study route structure in `/routes/`
3. Understand controllers in `/controllers/`
4. Learn API patterns

---

## 📞 Quick Commands

```bash
# Start everything (run in separate terminals)
Terminal 1: cd express-backend && npm start
Terminal 2: cd react-frontend && npm start

# Install dependencies
npm install

# Stop server
Ctrl + C

# Clean install
rm -rf node_modules && npm install

# Build for production (frontend only)
npm run build
```

---

## 🎉 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] Login works with demo credentials
- [ ] All pages load correctly
- [ ] Books can be borrowed/returned
- [ ] Reports display data
- [ ] AI assistant responds to messages
- [ ] Admin dashboard shows all data
- [ ] No console errors

---

## 📞 Need Help?

1. Check `README_FULL_STACK_CONVERSION.md` for detailed docs
2. Review console error messages
3. Check backend console for API errors
4. Verify all ports are correct

---

**Happy coding! 🚀**

Last Updated: April 2026
