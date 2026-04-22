# Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)                   │  │
│  │  ┌────────────┐  ┌─────────┐  ┌──────────────────────┐  │  │
│  │  │   Navbar   │  │ Pages   │  │   AI Assistant      │  │  │
│  │  │            │  │ - Home  │  │   - Chat Widget     │  │  │
│  │  │ - Logo     │  │ - Login │  │   - localStorage    │  │  │
│  │  │ - Links    │  │ - Books │  │                      │  │  │
│  │  │ - Auth     │  │ - Admin │  │                      │  │  │
│  │  └────────────┘  └─────────┘  └──────────────────────┘  │  │
│  │                        ▼                                  │  │
│  │           React Router (Client-side routing)             │  │
│  │                        ▼                                  │  │
│  │        ┌──────────────────────────────┐                  │  │
│  │        │   API Service (Axios)        │                  │  │
│  │        │  - Auth calls                │                  │  │
│  │        │  - Book operations           │                  │  │
│  │        │  - User management           │                  │  │
│  │        └──────────────────────────────┘                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER (Port 5000)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   CORS Middleware                        │  │
│  │              (Allow requests from localhost:3000)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Routes & Controllers                          │  │
│  │  ┌─────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │ Auth Route  │  │ Book Route │  │ Report Route    │  │  │
│  │  │  ▼          │  │  ▼         │  │  ▼              │  │  │
│  │  │ Auth        │  │ Book       │  │ Report          │  │  │
│  │  │ Controller  │  │ Controller │  │ Controller      │  │  │
│  │  └─────────────┘  └────────────┘  └──────────────────┘  │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌────────────┐                        │  │
│  │  │ User Route  │  │ Health     │                        │  │
│  │  │  ▼          │  │ Check      │                        │  │
│  │  │ User        │  │ Endpoint   │                        │  │
│  │  │ Controller  │  │            │                        │  │
│  │  └─────────────┘  └────────────┘                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Mock Data Storage (In-Memory)                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │  │
│  │  │ Users    │  │ Books    │  │ Sessions / Reports  │  │  │
│  │  │ Array    │  │ Array    │  │ Objects             │  │  │
│  │  └──────────┘  └──────────┘  └──────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Frontend Component Tree

```
App (Router wrapper)
├── Navbar
│   ├── Logo
│   ├── Nav Links
│   └── User Actions
├── Main Routes
│   ├── Home
│   │   ├── Hero Section
│   │   └── Features Grid
│   ├── Login Page
│   │   └── Login Form
│   ├── Signup Page
│   │   └── Signup Form
│   ├── Books Page
│   │   ├── Search Bar
│   │   ├── Category Filters
│   │   └── Book Grid
│   ├── Reports Page
│   │   ├── Summary Stats
│   │   ├── Circulation Report
│   │   └── Top Books Table
│   ├── StudentPortal
│   │   ├── Borrow Tab
│   │   └── Borrowed Tab
│   ├── Faculty Portal
│   │   └── Course Materials
│   └── Admin Dashboard
│       ├── Dashboard Tab
│       ├── Users Tab
│       └── Books Tab
├── AIAssistant (Fixed to bottom-right)
│   ├── Chat Button
│   ├── Chat Panel
│   └── Message History
└── Footer
```

---

## Data Flow Diagram

### Login Flow
```
1. User inputs credentials
         ▼
2. LoginPage component state updated
         ▼
3. useAuth hook called with login()
         ▼
4. API call to POST /api/auth/login
         ▼
5. Backend validates credentials
         ▼
6. Returns token + user data
         ▼
7. Frontend stores in localStorage
         ▼
8. User redirected to dashboard
         ▼
9. API requests now include token
```

### Book Borrowing Flow
```
1. User clicks "Borrow" button
         ▼
2. handleBorrow() called with bookId
         ▼
3. API call to POST /api/books/:id/borrow
         ▼
4. Backend validates user
         ▼
5. Decrements book.available
         ▼
6. Creates borrow record
         ▼
7. Returns success response
         ▼
8. Frontend updates UI/state
         ▼
9. User sees updated available count
```

---

## State Management Map

### Frontend State (Context/Hooks)

**useAuth Hook:**
```javascript
{
  user: { id, username, email, role, name },
  token: "token_string",
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

**Page Component States:**
```javascript
// Books Page
{
  books: Array<Book>,
  filteredBooks: Array<Book>,
  searchTerm: string,
  selectedCategory: string,
  loading: boolean,
  error: string | null
}

// StudentPortal
{
  activeTab: 'borrow' | 'borrowed',
  books: Array<Book>,
  borrowedBooks: Array<Book>,
  loading: boolean
}

// Admin
{
  activeTab: 'dashboard' | 'users' | 'books',
  users: Array<User>,
  books: Array<Book>,
  loading: boolean
}
```

---

## Backend Data Models

### User Model
```javascript
{
  id: number,
  username: string,
  password: string,
  email: string,
  role: 'student' | 'faculty' | 'admin',
  name: string,
  department: string,
  joinDate: string
}
```

### Book Model
```javascript
{
  id: number,
  title: string,
  author: string,
  isbn: string,
  category: string,
  available: number,
  total: number,
  publishedYear: number,
  department: string
}
```

### Session Model
```javascript
{
  userId: number,
  username: string,
  role: string,
  createdAt: Date
}
```

### Borrow Record Model
```javascript
{
  id: number,
  bookId: number,
  userId: number,
  borrowDate: string,
  dueDate: string,
  returnDate?: string,
  status: 'borrowed' | 'returned'
}
```

---

## API Request/Response Examples

### Login Request
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "student1",
  "password": "student123",
  "role": "student"
}

Response:
{
  "success": true,
  "token": "token_1_1234567890",
  "user": {
    "id": 2,
    "username": "student1",
    "email": "student1@vemu.edu",
    "role": "student",
    "name": "John Student"
  }
}
```

### Get Books Request
```
GET /api/books
Authorization: Bearer token_1_1234567890

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "available": 3,
      "total": 5
    },
    ...
  ]
}
```

### Borrow Book Request
```
POST /api/books/1/borrow
Authorization: Bearer token_1_1234567890
Content-Type: application/json

{
  "userId": 2
}

Response:
{
  "success": true,
  "message": "Book borrowed successfully! Return by 2 weeks.",
  "data": {
    "id": 1,
    "bookId": 1,
    "userId": 2,
    "borrowDate": "2026-04-21T...",
    "dueDate": "2026-05-05T...",
    "status": "borrowed"
  }
}
```

---

## Middleware Chain

### Request Processing Order
```
1. Express Server receives request
         ▼
2. CORS Middleware (Allow cross-origin)
         ▼
3. Body Parser (Parse JSON)
         ▼
4. Request Logging Middleware
         ▼
5. Route Handler (Get the matching route)
         ▼
6. Controller Function (Process request)
         ▼
7. Send Response
         ▼
8. Error Handler (if any error occurred)
```

---

## CSS Architecture

### Style Organization
```
global.css
├── CSS Variables (colors, shadows, etc.)
├── Base Styles (*, body, html)
├── Typography
└── General Utilities

Component Styles
├── navbar.css (Navbar component)
├── footer.css (Footer component)
├── ai-assistant.css (AIAssistant component)
└── Page Styles
    ├── home.css
    ├── login.css
    ├── signup.css
    ├── books.css
    ├── reports.css
    ├── student-portal.css
    ├── faculty.css
    └── admin.css
```

### Color System
```
Primary Colors:
--navy: #1C2B4A (Buttons, Headers)
--gold: #C8973A (Accents, Highlights)
--cream: #FAF7F2 (Background)

Secondary Colors:
--teal: #1A6B6B
--red: #A63228

Text Colors:
--ink: #1A1410 (Primary text)
--ink-soft: #5C4F40 (Secondary text)
--ink-muted: #8B7B6A (Muted text)

Shadows:
--shadow-sm: small shadows
--shadow-md: medium shadows
--shadow-lg: large shadows
```

---

## Performance Considerations

### Frontend Optimization
- ✅ Components only re-render when state changes
- ✅ API calls minimized with useEffect dependencies
- ✅ localStorage for persistent auth
- ✅ CSS not duplicated across pages
- ✅ Images optimized (emoji used instead)

### Backend Optimization
- ✅ In-memory data (no I/O delay)
- ✅ Simple routing (fast lookup)
- ✅ Error handling prevents crashes
- ✅ CORS properly configured
- ✅ Request logging for debugging

---

## Security Implementation

### Current (Development)
- ✅ Simple string-based tokens
- ✅ Session storage in memory
- ✅ Mock authentication

### Recommended (Production)
- ✅ JWT tokens with expiration
- ✅ Password hashing (bcrypt)
- ✅ Database persistence
- ✅ HTTPS only
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention

---

## Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await bookAPI.borrowBook(id, userId);
  // Success handling
} catch (err) {
  const message = err.response?.data?.error || 'Failed to borrow book';
  setError(message);
  // User-friendly error display
}
```

### Backend Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong',
    message: err.message 
  });
});
```

---

## Scalability Path

### Phase 1 (Current)
- In-memory data
- Single server
- Demo authentication

### Phase 2
- Add database (MongoDB/PostgreSQL)
- Implement proper JWT
- Add password hashing

### Phase 3
- User sessions/preferences
- Email notifications
- Advanced search/filtering
- Caching layer

### Phase 4
- Real-time updates (WebSocket)
- Mobile app (React Native)
- Analytics dashboard
- Machine learning recommendations

---

This architecture provides a solid foundation for a scalable, maintainable library management system! 🚀
