const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Report routes
router.get('/', reportController.getAllReports);
router.get('/summary', reportController.getSummary);
router.get('/circulation', reportController.getCirculationReport);
router.post('/', reportController.generateReport);

module.exports = router;
