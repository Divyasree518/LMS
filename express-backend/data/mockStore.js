const bcryptjs = require('bcryptjs');

// Generate unique IDs like MongoDB ObjectIds
let idCounter = 1;
function generateId() {
  const hex = idCounter.toString(16).padStart(24, '0');
  idCounter++;
  return hex;
}

function hashPassword(password) {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
}

// ─── DEMO DATA ────────────────────────────────────────────────

const users = [
  {
    _id: generateId(),
    username: 'admin',
    password: hashPassword('admin123'),
    email: 'admin@vemu.ac.in',
    name: 'Administrator',
    role: 'admin',
    department: 'Administration',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: generateId(),
    username: 'student1',
    password: hashPassword('student123'),
    email: 'student1@vemu.ac.in',
    name: 'John Student',
    role: 'student',
    department: 'Computer Science',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: generateId(),
    username: 'faculty1',
    password: hashPassword('faculty123'),
    email: 'faculty1@vemu.ac.in',
    name: 'Dr. Jane Faculty',
    role: 'faculty',
    department: 'Electronics',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    _id: generateId(),
    username: 'librarian',
    password: hashPassword('librarian123'),
    email: 'librarian@vemu.ac.in',
    name: 'Mr. Librarian',
    role: 'librarian',
    department: 'Library',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    _id: generateId(),
    username: 'student2',
    password: hashPassword('student123'),
    email: 'student2@vemu.ac.in',
    name: 'Mary Student',
    role: 'student',
    department: 'Physics',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

const books = [
  {
    _id: generateId(),
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson, Rivest, Stein',
    isbn: '9780262033848',
    category: 'Computer Science',
    description: 'A comprehensive guide to algorithms and data structures.',
    publishedYear: 2009,
    department: 'Computer Science',
    total: 5,
    available: 3,
    borrowed: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: generateId(),
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    category: 'Computer Science',
    description: 'A handbook of agile software craftsmanship.',
    publishedYear: 2008,
    department: 'Computer Science',
    total: 4,
    available: 2,
    borrowed: 2,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: generateId(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Literature',
    description: 'A novel set in the Jazz Age.',
    publishedYear: 1925,
    department: 'Humanities',
    total: 6,
    available: 5,
    borrowed: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: generateId(),
    title: 'Physics for Scientists and Engineers',
    author: 'Serway & Jewett',
    isbn: '9781133954156',
    category: 'Physics',
    description: 'Comprehensive physics textbook.',
    publishedYear: 2013,
    department: 'Physics',
    total: 3,
    available: 1,
    borrowed: 2,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    _id: generateId(),
    title: 'Biology: The Unity and Diversity of Life',
    author: 'Starr & Taggart',
    isbn: '9781305073951',
    category: 'Biology',
    description: 'Introductory biology textbook.',
    publishedYear: 2015,
    department: 'Biology',
    total: 4,
    available: 4,
    borrowed: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: generateId(),
    title: 'Digital Design and Computer Architecture',
    author: 'Harris & Harris',
    isbn: '9780123944245',
    category: 'Electronics',
    description: 'Digital electronics and computer architecture.',
    publishedYear: 2012,
    department: 'Electronics',
    total: 3,
    available: 2,
    borrowed: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: generateId(),
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    category: 'History',
    description: 'Explores the history of humankind from the Stone Age to the modern era.',
    publishedYear: 2011,
    department: 'Humanities',
    total: 8,
    available: 6,
    borrowed: 2,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    _id: generateId(),
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits.',
    publishedYear: 2018,
    department: 'General',
    total: 10,
    available: 8,
    borrowed: 2,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    _id: generateId(),
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    isbn: '9780201616224',
    category: 'Computer Science',
    description: 'A guide to becoming a better programmer.',
    publishedYear: 1999,
    department: 'Computer Science',
    total: 5,
    available: 5,
    borrowed: 0,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    _id: generateId(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    category: 'Literature',
    description: 'A novel about racial injustice in the American South.',
    publishedYear: 1960,
    department: 'Humanities',
    total: 7,
    available: 6,
    borrowed: 1,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

const borrowRecords = [
  {
    _id: generateId(),
    bookId: books[0]._id,
    userId: users[1]._id,
    borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    returnDate: null,
    status: 'borrowed',
    fine: 0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    _id: generateId(),
    bookId: books[1]._id,
    userId: users[1]._id,
    borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    returnDate: null,
    status: 'borrowed',
    fine: 6,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    _id: generateId(),
    bookId: books[3]._id,
    userId: users[2]._id,
    borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    returnDate: null,
    status: 'borrowed',
    fine: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: generateId(),
    bookId: books[5]._id,
    userId: users[4]._id,
    borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    returnDate: null,
    status: 'borrowed',
    fine: 11,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  },
  {
    _id: generateId(),
    bookId: books[6]._id,
    userId: users[2]._id,
    borrowDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    returnDate: null,
    status: 'borrowed',
    fine: 1,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
];

const reports = [
  {
    _id: generateId(),
    type: 'summary',
    period: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    },
    data: { summary: 'Monthly report data' },
    generatedBy: users[0]._id,
    createdAt: new Date()
  }
];

// ─── QUERY HELPERS ────────────────────────────────────────────

function findOne(arr, query) {
  return arr.find(item => matchQuery(item, query));
}

function find(arr, query = {}) {
  return arr.filter(item => matchQuery(item, query));
}

function matchQuery(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('$')) continue; // Skip Mongo operators for simple case
    if (key === '$or') {
      const orMatch = value.some(subQ => matchQuery(item, subQ));
      if (!orMatch) return false;
      continue;
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle operators like $lt, $gte, etc.
      for (const [op, opVal] of Object.entries(value)) {
        if (op === '$lt' && !(item[key] < opVal)) return false;
        if (op === '$lte' && !(item[key] <= opVal)) return false;
        if (op === '$gt' && !(item[key] > opVal)) return false;
        if (op === '$gte' && !(item[key] >= opVal)) return false;
        if (op === '$ne' && item[key] === opVal) return false;
        if (op === '$in' && !opVal.includes(item[key])) return false;
      }
      continue;
    }
    if (item[key] !== value) return false;
  }
  return true;
}

function sortBy(arr, field, order = -1) {
  return [...arr].sort((a, b) => {
    const aVal = a[field] || 0;
    const bVal = b[field] || 0;
    return order === -1
      ? (bVal > aVal ? 1 : bVal < aVal ? -1 : 0)
      : (aVal > bVal ? 1 : aVal < bVal ? -1 : 0);
  });
}

module.exports = {
  users, books, borrowRecords, reports,
  findOne, find, sortBy, generateId, hashPassword
};

