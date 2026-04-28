const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const User = require('../models/User');
const mongoose = require('mongoose');

const bookController = {
  getAllBooks: async (req, res) => {
    try {
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

      // Find the actual user by ID, username, or email
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

      // Create borrow record with the actual user._id
      const borrowRecord = new BorrowRecord({
        bookId,
        userId: user._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });

      await borrowRecord.save();

      // Update book availability
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

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      let record;

      if (borrowRecordId) {
        // If borrowRecordId is provided, use it
        record = await BorrowRecord.findById(borrowRecordId);
      } else {
        // Otherwise, find the most recent unreturned borrow record for this book
        record = await BorrowRecord.findOne({ bookId, status: 'borrowed' }).sort({ borrowDate: -1 });
      }

      if (!record) {
        return res.status(404).json({ error: 'No active borrow record found for this book' });
      }

      record.returnDate = new Date();
      record.status = 'returned';
      await record.save();

      // Update book availability
      book.available = Math.min(book.total, book.available + 1);
      book.borrowed = Math.max(0, book.borrowed - 1);
      await book.save();

      res.json({
        success: true,
        message: 'Book returned successfully',
        data: book
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllBorrowRecords: async (req, res) => {
    try {
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

      // Resolve actual userId if an email/username was provided
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
