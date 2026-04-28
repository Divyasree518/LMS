const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const User = require('../models/User');
const mongoose = require('mongoose');
const mockStore = require('../data/mockStore');

const bookController = {
  getAllBooks: async (req, res) => {
    try {
      if (!global.dbConnected) {
        return res.json({
          success: true,
          count: mockStore.books.length,
          data: mockStore.books
        });
      }
      const books = await Book.find();
      res.json({
        success: true,
        count: books.length,
        data: books
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBookById: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const book = mockStore.findOne(mockStore.books, { _id: req.params.id });
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        return res.json({ success: true, data: book });
      }
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBooksByCategory: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const books = mockStore.find(mockStore.books, { category: req.params.category });
        return res.json({ success: true, count: books.length, data: books });
      }
      const books = await Book.find({ category: req.params.category });
      res.json({ success: true, count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createBook: async (req, res) => {
    try {
      const { title, author, isbn, category, total, department, publishedYear, description } = req.body;

      if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
      }

      if (!global.dbConnected) {
        const newBook = {
          _id: mockStore.generateId(),
          title,
          author,
          isbn: isbn || undefined,
          category: category || 'General',
          total: total || 1,
          available: total || 1,
          publishedYear: publishedYear || new Date().getFullYear(),
          department: department || 'General',
          description,
          borrowed: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockStore.books.push(newBook);
        return res.status(201).json({ success: true, data: newBook });
      }

      const newBook = new Book({
        title,
        author,
        isbn: isbn || undefined,
        category: category || 'General',
        total: total || 1,
        available: total || 1,
        publishedYear: publishedYear || new Date().getFullYear(),
        department: department || 'General',
        description
      });

      await newBook.save();
      res.status(201).json({ success: true, data: newBook });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Book with this ISBN already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  updateBook: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const idx = mockStore.books.findIndex(b => b._id === req.params.id);
        if (idx === -1) {
          return res.status(404).json({ error: 'Book not found' });
        }
        mockStore.books[idx] = { ...mockStore.books[idx], ...req.body, updatedAt: new Date() };
        return res.json({ success: true, data: mockStore.books[idx] });
      }

      const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBook: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const idx = mockStore.books.findIndex(b => b._id === req.params.id);
        if (idx === -1) {
          return res.status(404).json({ error: 'Book not found' });
        }
        const book = mockStore.books.splice(idx, 1)[0];
        return res.json({ success: true, message: 'Book deleted', data: book });
      }

      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json({ success: true, message: 'Book deleted', data: book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  borrowBook: async (req, res) => {
    try {
      const bookId = req.params.id;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!global.dbConnected) {
        const user = mockStore.findOne(mockStore.users, { _id: userId }) ||
                     mockStore.findOne(mockStore.users, { username: userId }) ||
                     mockStore.findOne(mockStore.users, { email: userId.toLowerCase() });
        if (!user) {
          return res.status(404).json({ error: 'User not found with provided ID/Email/Username' });
        }

        const book = mockStore.findOne(mockStore.books, { _id: bookId });
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }

        if (book.available <= 0) {
          return res.status(400).json({ error: 'Book not available' });
        }

        const borrowRecord = {
          _id: mockStore.generateId(),
          bookId,
          userId: user._id,
          borrowDate: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          returnDate: null,
          status: 'borrowed',
          fine: 0,
          createdAt: new Date()
        };

        mockStore.borrowRecords.push(borrowRecord);
        book.available--;
        book.borrowed++;

        return res.json({
          success: true,
          message: 'Book borrowed successfully',
          data: borrowRecord
        });
      }

      // MongoDB mode
      const user = await User.findOne({
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined },
          { username: userId },
          { email: userId.toLowerCase() }
        ].filter(q => q._id !== undefined || q.username || q.email)
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found with provided ID/Email/Username' });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if (book.available <= 0) {
        return res.status(400).json({ error: 'Book not available' });
      }

      const borrowRecord = new BorrowRecord({
        bookId,
        userId: user._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });

      await borrowRecord.save();

      book.available--;
      book.borrowed++;
      await book.save();

      res.json({
        success: true,
        message: 'Book borrowed successfully',
        data: borrowRecord
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  returnBook: async (req, res) => {
    try {
      const bookId = req.params.id;
      const { borrowRecordId } = req.body;

      if (!global.dbConnected) {
        const book = mockStore.findOne(mockStore.books, { _id: bookId });
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }

        let record;
        if (borrowRecordId) {
          record = mockStore.findOne(mockStore.borrowRecords, { _id: borrowRecordId });
        } else {
          record = mockStore.borrowRecords
            .filter(r => r.bookId === bookId && r.status === 'borrowed')
            .sort((a, b) => b.borrowDate - a.borrowDate)[0];
        }

        if (!record) {
          return res.status(404).json({ error: 'No active borrow record found for this book' });
        }

        const returnDate = new Date();
        record.returnDate = returnDate;
        record.status = 'returned';

        const FINE_PER_DAY = 1;
        let fine = 0;
        if (record.dueDate && returnDate > record.dueDate) {
          const diffTime = returnDate - record.dueDate;
          const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          fine = overdueDays * FINE_PER_DAY;
        }
        record.fine = fine;

        book.available = Math.min(book.total, book.available + 1);
        book.borrowed = Math.max(0, book.borrowed - 1);

        return res.json({
          success: true,
          message: fine > 0
            ? `Book returned successfully. Overdue fine: Rs. ${fine}`
            : 'Book returned successfully',
          data: { book, fine, record }
        });
      }

      // MongoDB mode
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      let record;
      if (borrowRecordId) {
        record = await BorrowRecord.findById(borrowRecordId);
      } else {
        record = await BorrowRecord.findOne({ bookId, status: 'borrowed' }).sort({ borrowDate: -1 });
      }

      if (!record) {
        return res.status(404).json({ error: 'No active borrow record found for this book' });
      }

      const returnDate = new Date();
      record.returnDate = returnDate;
      record.status = 'returned';

      const FINE_PER_DAY = 1;
      let fine = 0;
      if (record.dueDate && returnDate > record.dueDate) {
        const diffTime = returnDate - record.dueDate;
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fine = overdueDays * FINE_PER_DAY;
      }
      record.fine = fine;
      await record.save();

      book.available = Math.min(book.total, book.available + 1);
      book.borrowed = Math.max(0, book.borrowed - 1);
      await book.save();

      res.json({
        success: true,
        message: fine > 0
          ? `Book returned successfully. Overdue fine: Rs. ${fine}`
          : 'Book returned successfully',
        data: { book, fine, record }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllBorrowRecords: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const records = mockStore.borrowRecords.map(r => {
          const book = mockStore.findOne(mockStore.books, { _id: r.bookId });
          const user = mockStore.findOne(mockStore.users, { _id: r.userId });
          return {
            ...r,
            bookId: book ? { _id: book._id, title: book.title, author: book.author } : r.bookId,
            userId: user ? { _id: user._id, username: user.username, name: user.name, role: user.role } : r.userId
          };
        }).sort((a, b) => b.borrowDate - a.borrowDate);
        return res.json({ success: true, count: records.length, data: records });
      }

      const records = await BorrowRecord.find()
        .populate('bookId', 'title author')
        .populate('userId', 'username name role')
        .sort({ borrowDate: -1 });
      res.json({ success: true, count: records.length, data: records });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBorrowedByUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!global.dbConnected) {
        let actualUserId = userId;
        if (!mockStore.findOne(mockStore.users, { _id: userId })) {
          const user = mockStore.findOne(mockStore.users, { username: userId }) ||
                      mockStore.findOne(mockStore.users, { email: userId.toLowerCase() });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          actualUserId = user._id;
        }

        const records = mockStore.borrowRecords
          .filter(r => r.userId === actualUserId && r.status === 'borrowed')
          .map(r => {
            const book = mockStore.findOne(mockStore.books, { _id: r.bookId });
            return { ...r, bookId: book || r.bookId };
          });
        return res.json({ success: true, data: records });
      }

      // MongoDB mode
      let actualUserId = userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        const user = await User.findOne({
          $or: [{ username: userId }, { email: userId.toLowerCase() }]
        });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        actualUserId = user._id;
      }

      const records = await BorrowRecord.find({ userId: actualUserId, status: 'borrowed' }).populate('bookId');
      res.json({ success: true, data: records });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookController;
