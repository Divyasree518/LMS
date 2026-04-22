const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Report = require('../models/Report');

const reportController = {
  getAllReports: async (req, res) => {
    try {
      const reports = await Report.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSummary: async (req, res) => {
    try {
      const [totalUsers, totalBooks, activeLoans, overdueBooks] = await Promise.all([
        User.countDocuments(),
        Book.countDocuments(),
        BorrowRecord.countDocuments({ status: 'borrowed' }),
        BorrowRecord.countDocuments({
          status: 'borrowed',
          dueDate: { $lt: new Date() }
        })
      ]);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const registeredToday = await User.countDocuments({
        createdAt: { $gte: todayStart }
      });

      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);

      const booksAddedThisMonth = await Book.countDocuments({
        createdAt: { $gte: thisMonthStart }
      });

      const circulatingBooks = await Book.aggregate([
        { $group: { _id: null, total: { $sum: '$borrowed' } } }
      ]);

      const summary = {
        totalUsers,
        totalBooks,
        circulatingBooks: circulatingBooks[0]?.total || 0,
        activeLoans,
        overdueBooks,
        registeredToday,
        booksAddedThisMonth,
        totalFinesCollected: 0
      };

      res.json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCirculationReport: async (req, res) => {
    try {
      // Last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [circulation, topBooks, usageByCategory] = await Promise.all([
        BorrowRecord.aggregate([
          { $match: { borrowDate: { $gte: thirtyDaysAgo } } },
          {
            $facet: {
              checkouts: [
                { $match: { status: { $in: ['borrowed', 'returned'] } } },
                { $count: 'total' }
              ],
              returns: [
                { $match: { status: 'returned' } },
                { $count: 'total' }
              ]
            }
          }
        ]),
        BorrowRecord.aggregate([
          { $match: { borrowDate: { $gte: thirtyDaysAgo } } },
          { $group: { _id: '$bookId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'books',
              localField: '_id',
              foreignField: '_id',
              as: 'bookInfo'
            }
          },
          {
            $project: {
              title: { $arrayElemAt: ['$bookInfo.title', 0] },
              checkouts: '$count'
            }
          }
        ]),
        Book.aggregate([
          {
            $lookup: {
              from: 'borrowrecords',
              localField: '_id',
              foreignField: 'bookId',
              as: 'borrows'
            }
          },
          {
            $addFields: {
              recentBorrows: {
                $size: {
                  $filter: {
                    input: '$borrows',
                    as: 'borrow',
                    cond: {
                      $gte: ['$$borrow.borrowDate', thirtyDaysAgo]
                    }
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$category',
              checkouts: { $sum: '$recentBorrows' }
            }
          },
          { $sort: { checkouts: -1 } }
        ])
      ]);

      const totalCheckouts = circulation[0]?.checkouts[0]?.total || 0;
      const totalReturns = circulation[0]?.returns[0]?.total || 0;

      const report = {
        period: 'Last 30 days',
        totalCheckouts,
        totalReturns,
        averageCheckoutTime: '14 days',
        topBorrowedBooks: topBooks,
        usageByCategory
      };

      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  generateReport: async (req, res) => {
    try {
      const { type, startDate, endDate } = req.body;

      if (!type) {
        return res.status(400).json({ error: 'Report type is required' });
      }

      const report = new Report({
        type,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        data: {}
      });

      await report.save();

      res.status(201).json({
        success: true,
        message: 'Report generated',
        data: report
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = reportController;
