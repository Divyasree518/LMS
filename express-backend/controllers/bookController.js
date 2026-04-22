const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

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

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if (book.available <= 0) {
        return res.status(400).json({ error: 'Book not available' });
      }

      // Create borrow record
      const borrowRecord = new BorrowRecord({
        bookId,
        userId,
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

      // Find and update borrow record
      const record = await BorrowRecord.findById(borrowRecordId || req.body.recordId);
      if (!record) {
        return res.status(404).json({ error: 'Borrow record not found' });
      }

      record.returnDate = new Date();
      record.status = 'returned';
      await record.save();

      // Update book availability
      book.available++;
      book.borrowed--;
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

  getBorrowedByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const records = await BorrowRecord.find({ userId, status: 'borrowed' }).populate('bookId');
      res.json({ success: true, data: records });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookController;
