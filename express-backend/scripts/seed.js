require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await BorrowRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [
      {
        username: 'admin',
        email: 'admin@vemu.edu',
        password: 'Admin@123',
        role: 'admin',
        name: 'Admin User',
        department: 'Administration'
      },
      {
        username: 'faculty1',
        email: 'faculty1@vemu.edu',
        password: 'Faculty@123',
        role: 'faculty',
        name: 'Dr. John Smith',
        department: 'Computer Science'
      },
      {
        username: 'student1',
        email: 'student1@vemu.edu',
        password: 'Student@123',
        role: 'student',
        name: 'Alice Johnson',
        department: 'Computer Science'
      },
      {
        username: 'student2',
        email: 'student2@vemu.edu',
        password: 'Student@123',
        role: 'student',
        name: 'Bob Davis',
        department: 'Electronics'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create books
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        category: 'Fiction',
        description: 'A classic American novel set in the Jazz Age',
        publishedYear: 1925,
        department: 'Literature',
        total: 5,
        available: 3,
        borrowed: 2
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Cormen, Leiserson',
        isbn: '978-0-262-03384-8',
        category: 'Computer Science',
        description: 'Comprehensive guide to algorithms and data structures',
        publishedYear: 2009,
        department: 'Computer Science',
        total: 3,
        available: 1,
        borrowed: 2
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0-553-38016-3',
        category: 'Science',
        description: 'From the Big Bang to Black Holes',
        publishedYear: 1988,
        department: 'Physics',
        total: 2,
        available: 2,
        borrowed: 0
      },
      {
        title: 'Digital Electronics',
        author: 'Morris Mano',
        isbn: '978-0-13-156999-2',
        category: 'Electronics',
        description: 'Fundamentals of digital design',
        publishedYear: 2006,
        department: 'Electronics',
        total: 4,
        available: 4,
        borrowed: 0
      },
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        isbn: '978-0-19-282995-0',
        category: 'Science',
        description: 'A gene-centered view of evolution',
        publishedYear: 1976,
        department: 'Biology',
        total: 2,
        available: 1,
        borrowed: 1
      }
    ];

    const createdBooks = await Book.insertMany(books);
    console.log(`Created ${createdBooks.length} books`);

    // Create borrow records (optional demo data)
    const borrowRecords = [
      {
        bookId: createdBooks[0]._id,
        userId: createdUsers[2]._id,
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'borrowed'
      },
      {
        bookId: createdBooks[1]._id,
        userId: createdUsers[3]._id,
        borrowDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'returned'
      }
    ];

    await BorrowRecord.insertMany(borrowRecords);
    console.log(`Created ${borrowRecords.length} borrow records`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
