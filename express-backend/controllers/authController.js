const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mockStore = require('../data/mockStore');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      let user;
      if (!global.dbConnected) {
        user = mockStore.findOne(mockStore.users, { username });
        if (user) {
          const bcryptjs = require('bcryptjs');
          const isMatch = bcryptjs.compareSync(password, user.password);
          if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
        }
      } else {
        user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check role if specified
      if (role && user.role !== role) {
        return res.status(403).json({ error: 'User role does not match selected role' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '24h' }
      );

      const userResponse = { ...user };
      delete userResponse.password;

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  signup: async (req, res) => {
    try {
      const { username, password, email, name, role } = req.body;

      console.log('[Signup] Received body:', req.body);

      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username, password, and email are required' 
        });
      }

      // Trim and sanitize inputs
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = (name || trimmedUsername).trim();

      if (trimmedUsername.length < 3) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username must be at least 3 characters' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: 'Password must be at least 6 characters' 
        });
      }

      if (!global.dbConnected) {
        // Mock mode signup
        const existingUser = mockStore.findOne(mockStore.users, { 
          $or: [{ username: trimmedUsername }, { email: trimmedEmail }] 
        });
        
        if (existingUser) {
          const field = existingUser.username === trimmedUsername ? 'Username' : 'Email';
          return res.status(409).json({ 
            success: false, 
            error: `${field} already exists` 
          });
        }

        const bcryptjs = require('bcryptjs');
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const newUser = {
          _id: mockStore.generateId(),
          username: trimmedUsername,
          password: hashedPassword,
          email: trimmedEmail,
          name: trimmedName,
          role: role || 'student',
          department: 'General',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        mockStore.users.push(newUser);
        console.log('[Signup] User saved successfully (mock):', newUser.username);

        return res.status(201).json({
          success: true,
          message: 'Account created successfully',
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name
          }
        });
      }

      // MongoDB mode signup
      const existingUser = await User.findOne({ 
        $or: [{ username: trimmedUsername }, { email: trimmedEmail }] 
      });
      
      if (existingUser) {
        const field = existingUser.username === trimmedUsername ? 'Username' : 'Email';
        return res.status(409).json({ 
          success: false, 
          error: `${field} already exists` 
        });
      }

      const newUser = new User({
        username: trimmedUsername,
        password,
        email: trimmedEmail,
        name: trimmedName,
        role: role || 'student'
      });

      await newUser.save();
      console.log('[Signup] User saved successfully:', newUser.username);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name
        }
      });
    } catch (error) {
      console.error('[Signup] Error:', error.message);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ 
          success: false, 
          error: messages.join(', ') 
        });
      }
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(409).json({ 
          success: false, 
          error: `${field} already exists` 
        });
      }

      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  logout: (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  },

  validateToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      
      let user;
      if (!global.dbConnected) {
        user = mockStore.findOne(mockStore.users, { _id: decoded.userId });
      } else {
        user = await User.findById(decoded.userId);
      }

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({
        valid: true,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};

module.exports = authController;
