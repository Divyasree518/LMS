const User = require('../models/User');
const mockStore = require('../data/mockStore');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const users = mockStore.users.map(u => {
          const { password, ...rest } = u;
          return rest;
        });
        return res.json({
          success: true,
          count: users.length,
          data: users
        });
      }

      const users = await User.find().select('-password');
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const user = mockStore.findOne(mockStore.users, { _id: req.params.id });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...rest } = user;
        return res.json({ success: true, data: rest });
      }

      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, password, email, name, role, department } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      if (!global.dbConnected) {
        const existing = mockStore.findOne(mockStore.users, { username }) ||
                        mockStore.findOne(mockStore.users, { email });
        if (existing) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }

        const bcryptjs = require('bcryptjs');
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newUser = {
          _id: mockStore.generateId(),
          username,
          password: hashedPassword,
          email,
          name: name || username,
          role: role || 'student',
          department: department || 'General',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        mockStore.users.push(newUser);
        const { password: _, ...rest } = newUser;
        return res.status(201).json({ success: true, data: rest });
      }

      const newUser = new User({
        username,
        password,
        email,
        name: name || username,
        role: role || 'student',
        department: department || 'General'
      });

      await newUser.save();
      res.status(201).json({ success: true, data: newUser.toJSON() });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const idx = mockStore.users.findIndex(u => u._id === req.params.id);
        if (idx === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        Object.assign(mockStore.users[idx], req.body, { updatedAt: new Date() });
        const { password, ...rest } = mockStore.users[idx];
        return res.json({ success: true, data: rest });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      if (!global.dbConnected) {
        const idx = mockStore.users.findIndex(u => u._id === req.params.id);
        if (idx === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = mockStore.users.splice(idx, 1)[0];
        const { password, ...rest } = user;
        return res.json({ success: true, message: 'User deleted', data: rest });
      }

      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, message: 'User deleted', data: user.toJSON() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
