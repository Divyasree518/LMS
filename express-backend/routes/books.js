const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Book routes
router.get('/', bookController.getAllBooks);
router.get('/records', bookController.getAllBorrowRecords);
router.get('/:id', bookController.getBookById);
router.get('/category/:category', bookController.getBooksByCategory);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/:id/borrow', bookController.borrowBook);
router.post('/:id/return', bookController.returnBook);
router.get('/borrowed/:userId', bookController.getBorrowedByUser);

module.exports = router;
