# File-by-File Documentation

## 📂 Frontend Files (react-frontend/)

### Core Application Files

#### `src/App.js`
**Purpose**: Main application component with React Router setup
**Key Features**:
- Sets up BrowserRouter for client-side routing
- Manages authentication state across app
- Conditionally renders protected routes
- Wraps all pages with Navbar and Footer
**Connected Files**: All page components, Navbar, Footer, useAuth hook
**Key Functions**:
- `handleNavigate()` - Programmatic navigation
- `handleLogout()` - Clears auth and redirects

#### `src/index.js`
**Purpose**: Entry point for React application
**Key Features**:
- Creates React root and renders App
- Enables React Strict Mode for development checks
**Dependencies**: React, ReactDOM, App component

#### `public/index.html`
**Purpose**: HTML template for React app
**Key Features**:
- Contains `<div id="root">` target
- Links to Google Fonts (Playfair Display, DM Sans)
- Font Awesome icon library
- Metadata for browser/mobile

---

### Hooks

#### `src/hooks/useAuth.js`
**Purpose**: Custom hook for authentication logic
**State Managed**:
```javascript
user         // Current logged-in user object
token        // JWT token from backend
loading      // Loading state during API calls
error        // Error message if login fails
isAuthenticated // Boolean: user && token exist
```
**Functions**:
- `login(username, password, role)` - Authenticates user, stores token/user
- `logout()` - Clears localStorage, resets state
- Auto-reads localStorage on mount for persistent login
**Used By**: Login page, Navbar, Admin, StudentPortal

---

### Components

#### `src/components/Navbar.js`
**Purpose**: Navigation bar shown on all pages
**Features**:
- Logo with icon and branding
- Navigation links (changes based on user role)
- User display / Login/Signup buttons
- Mobile menu toggle
**Props**: `user`, `onLogout`, `onNavigate`
**Styling**: `navbar.css`
**Key Functions**:
- Shows different links for Student/Faculty/Admin
- Mobile responsive menu button
- Logout handler

#### `src/components/Footer.js`
**Purpose**: Footer shown on all pages
**Features**:
- Company info
- Quick links (About, Contact, Privacy)
- Contact information
- Copyright notice
**Styling**: `footer.css`
**No Props or State**: Purely presentational

#### `src/components/AIAssistant.js`
**Purpose**: AI chat widget (bottom-right floating button)
**Features**:
- Floating chat button with pulsing animation
- Chat panel with message history
- localStorage persistence
- Mock AI responses
- Clear history button
**State**:
```javascript
isOpen      // Panel open/closed
messages    // Array of chat messages
input       // Current message input
```
**Styling**: `ai-assistant.css`
**Functions**:
- `handleSendMessage()` - Add user message and generate AI response
- `handleClearHistory()` - Clear messages and localStorage

---

### Pages

#### `src/pages/Home.js`
**Purpose**: Landing page / Homepage
**Features**:
- Hero section with call-to-action
- Hero background graphics (decorative)
- Features grid with 4 feature cards
- Conditional buttons based on user login status
**Props**: `user`, `onNavigate`
**Styling**: `home.css`
**Sections**:
1. Hero with title and subtitle
2. CTA buttons (Get Started / Browse Books)
3. Features section (4 cards)

#### `src/pages/Login.js`
**Purpose**: User login page
**Features**:
- Role selection dropdown (Student/Faculty/Admin)
- Username input
- Password input
- Error message display
- Demo credentials hint
- Link to signup
**Uses**: `useAuth` hook for login logic
**State**:
```javascript
username    // Input value
password    // Input value
role        // Selected role
loading     // Login in progress
error       // Error message
```
**Styling**: `login.css`

#### `src/pages/Signup.js`
**Purpose**: User registration page
**Features**:
- Full name input
- Username input
- Email input
- Password input
- Success/error messages
- Link back to login
**Uses**: Direct API call to `authAPI.signup()`
**State**:
```javascript
username    // Username input
email       // Email input
password    // Password input
name        // Full name
loading     // Signup in progress
error       // Error message
success     // Success message
```
**Styling**: `signup.css`

#### `src/pages/Books.js`
**Purpose**: Books catalog page
**Features**:
- Search bar (search by title/author)
- Category filters
- Books grid display
- Book available count
- Borrow button with availability check
- Loading and error states
**Uses**: `bookAPI` service
**State**:
```javascript
books           // All books from API
filteredBooks   // Filtered by search/category
searchTerm      // Search input
selectedCategory // Selected filter
loading         // Loading state
error           // Error message
```
**Styling**: `books.css`
**Key Functions**:
- `handleBorrow()` - Call API to borrow book

#### `src/pages/Reports.js`
**Purpose**: System reports and analytics page
**Features**:
- Summary statistics (4 cards)
- Circulation report with top books
- Reports list with details
- Multiple API calls combined with Promise.all()
**Uses**: `reportAPI` service
**State**:
```javascript
summary      // System summary stats
circulation  // Circulation report data
reports      // List of reports
loading      // Loading state
```
**Styling**: `reports.css`

#### `src/pages/StudentPortal.js`
**Purpose**: Student dashboard
**Features**:
- Tab-based interface (Borrow / My Books)
- Browse available books
- View currently borrowed books
- Return book button
- Borrow button on books
**Uses**: `bookAPI` service
**State**:
```javascript
activeTab      // 'borrow' or 'borrowed' tab
books          // All available books
borrowedBooks  // User's borrowed books
loading        // Loading state
```
**Styling**: `student-portal.css`
**Protected**: Only accessible when `user.role === 'student'`

#### `src/pages/Faculty.js`
**Purpose**: Faculty member resources
**Features**:
- Active loans counter
- On hold books counter
- Course materials display
- Request resources section
**Props**: `user` - current user info
**Styling**: `faculty.css`
**Protected**: Only accessible when `user.role === 'faculty'`

#### `src/pages/Admin.js`
**Purpose**: Administrator dashboard
**Features**:
- 3 tabs: Dashboard / Users / Books
- Dashboard: System overview with stats
- Users: Table of all users with roles
- Books: Inventory table
- Role badges with color coding
**Uses**: `userAPI` and `bookAPI` services
**State**:
```javascript
activeTab // 'dashboard', 'users', or 'books'
users     // All users from API
books     // All books from API
loading   // Loading state
```
**Styling**: `admin.css`
**Protected**: Only accessible when `user.role === 'admin'`

---

### Services

#### `src/services/api.js`
**Purpose**: Centralized API client using Axios
**Key Features**:
- Base URL configuration
- Automatic token attachment to requests
- Request interceptor for auth
- Organized endpoint functions
**Exports**:
```javascript
authAPI {
  login(username, password, role)
  signup(username, password, email, name)
  logout()
  validateToken()
}

userAPI {
  getAllUsers()
  getUserById(id)
  createUser(userData)
  updateUser(id, userData)
  deleteUser(id)
}

bookAPI {
  getAllBooks()
  getBookById(id)
  getBooksByCategory(category)
  createBook(bookData)
  updateBook(id, bookData)
  deleteBook(id)
  borrowBook(id, userId)
  returnBook(id)
}

reportAPI {
  getAllReports()
  getSummary()
  getCirculationReport()
  generateReport(reportData)
}
```
**Used By**: All page components

---

### Styles

#### Global Styles (`src/styles/globals.css`)
**Contains**:
- CSS variables (colors, shadows, radii)
- Dark mode theme definitions
- Base element styles
- Scrollbar styling
- App layout (flexbox)

#### Component Styles
- **navbar.css** - Navigation styling
- **footer.css** - Footer styling
- **ai-assistant.css** - Chat widget styling

#### Page Styles
- **home.css** - Hero and features
- **login.css** - Login form styling
- **signup.css** - Signup form styling
- **books.css** - Books grid and filters
- **reports.css** - Reports page layout
- **student-portal.css** - Portal tabs and grid
- **faculty.css** - Faculty dashboard
- **admin.css** - Admin dashboard and tables

---

## 📂 Backend Files (express-backend/)

### Core Server

#### `server.js`
**Purpose**: Express server setup and initialization
**Key Features**:
- Initializes Express app
- Registers middleware (CORS, body-parser)
- Imports and registers all routes
- Error handling middleware
- Server startup on PORT 5000
**Middleware Chain**:
1. CORS - Allow cross-origin requests
2. bodyParser.json() - Parse JSON requests
3. bodyParser.urlencoded() - Parse URL-encoded
4. Logging middleware
5. Routes
6. Error handler

**Routes Registered**:
- `/api/auth` → authRoutes
- `/api/users` → userRoutes
- `/api/books` → bookRoutes
- `/api/reports` → reportRoutes
- `/api/health` → Health check endpoint

---

### Routes

#### `routes/auth.js`
**Endpoints**:
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/logout` - End session
- `GET /api/auth/validate` - Check token validity

#### `routes/users.js`
**Endpoints**:
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### `routes/books.js`
**Endpoints**:
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `GET /api/books/category/:category` - Filter by category
- `POST /api/books/:id/borrow` - Borrow book
- `POST /api/books/:id/return` - Return book
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

#### `routes/reports.js`
**Endpoints**:
- `GET /api/reports` - Get all reports
- `GET /api/reports/summary` - System summary
- `GET /api/reports/circulation` - Circulation stats
- `POST /api/reports` - Generate new report

---

### Controllers

#### `controllers/authController.js`
**Functions**:
- `login(req, res)` - Validate credentials, create session
- `signup(req, res)` - Create new user account
- `logout(req, res)` - End session
- `validateToken(req, res)` - Check token validity

**Data Structures**:
- `users` array - Mock user database
- `sessions` object - Active sessions map

**Logic**:
- Finds user by username and password
- Checks role if specified
- Creates simple token: `token_${userId}_${timestamp}`
- Stores session for validation

#### `controllers/userController.js`
**Functions**:
- `getAllUsers()` - Return all users with count
- `getUserById(id)` - Get single user
- `createUser(data)` - Add new user to array
- `updateUser(id, data)` - Modify user properties
- `deleteUser(id)` - Remove user from array

**Data Structure**:
- `allUsers` array - Mock user database
- Fields: id, username, email, role, name, department, joinDate

#### `controllers/bookController.js`
**Functions**:
- `getAllBooks()` - Return all books
- `getBookById(id)` - Get single book
- `getBooksByCategory(category)` - Filter by category
- `createBook(data)` - Add new book
- `updateBook(id, data)` - Modify book
- `deleteBook(id)` - Remove book
- `borrowBook(id, userId)` - Decrease available count
- `returnBook(id)` - Increase available count

**Data Structures**:
- `allBooks` array - Mock book collection
- `borrowRecords` array - Track borrow history
- Fields: id, title, author, isbn, category, available, total, publishedYear, department

**Logic**:
- Checks if book is available before borrowing
- Decrements/increments available count
- Creates borrow record with dates

#### `controllers/reportController.js`
**Functions**:
- `getAllReports()` - Get system reports list
- `getSummary()` - System statistics
- `getCirculationReport()` - Usage analytics
- `generateReport(type, dates)` - Create new report

**Data Generated**:
- Summary stats (total users, books, active loans, etc.)
- Circulation data (checkouts, returns, popular books)
- Usage by category
- Top borrowed books

---

### Configuration Files

#### `package.json`
**Scripts**:
- `npm start` - Run server with Node
- `npm run dev` - Run with nodemon (auto-reload)

**Dependencies**:
- `express` - Web framework
- `cors` - Cross-origin support
- `body-parser` - Request parsing

**Dev Dependencies**:
- `nodemon` - Auto-restart on changes

#### `.env.example`
**Template Variables**:
```
PORT=5000
NODE_ENV=development
```

#### `.gitignore`
**Ignored Files**:
- node_modules/
- .env
- .DS_Store
- npm debug logs

---

## 📂 Configuration Root Level

### `README_FULL_STACK_CONVERSION.md`
Complete project documentation including:
- Project overview
- Structure explanation
- Setup instructions
- API endpoints reference
- Technologies used
- Production deployment notes

### `QUICK_START.md`
Quick reference guide:
- 5-minute setup
- Demo credentials
- Troubleshooting
- File sizes
- Learning paths

### `ARCHITECTURE.md`
Technical architecture:
- System diagram
- Component hierarchy
- Data flow diagrams
- State management maps
- Error handling strategy
- Scalability path

---

## 🔄 Data Flow Examples

### Flow: User Login
```
1. LoginPage component → handleSubmit()
2. useAuth.login(credentials)
3. axios → POST /api/auth/login
4. authController.login()
5. Validates in users array
6. Creates session token
7. Returns {token, user}
8. localStorage.setItem('authToken', token)
9. useAuth state updated
10. User redirected to portal
```

### Flow: Borrow Book
```
1. Books page → handleBorrow()
2. bookAPI.borrowBook(bookId, userId)
3. axios → POST /api/books/:id/borrow
4. bookController.borrowBook()
5. Find book in allBooks
6. Decrement available count
7. Create borrow record
8. Return success response
9. Frontend refreshes book list
10. UI shows updated counts
```

---

## 🎯 File Naming Conventions

### React Components
- **Format**: PascalCase (.js)
- **Examples**: `Home.js`, `StudentPortal.js`, `AIAssistant.js`

### CSS Files
- **Format**: kebab-case (.css)
- **Examples**: `ai-assistant.css`, `student-portal.css`

### Hooks
- **Format**: camelCase with "use" prefix
- **Examples**: `useAuth.js`

### Services/Utils
- **Format**: camelCase or kebab-case
- **Examples**: `api.js`

---

## 📊 File Sizes (Approximate)

### Frontend
- App.js: 2 KB
- Each page: 3-5 KB
- Each style file: 2-8 KB
- Hooks: 2 KB
- Services: 3 KB
- Total source: ~50 KB

### Backend
- server.js: 1 KB
- Each route: 0.5 KB
- Each controller: 2-4 KB
- Total source: ~15 KB

---

This documentation provides a complete reference for understanding the full-stack application! 🚀
