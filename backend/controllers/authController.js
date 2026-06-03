const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '12h',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed, role: role || 'user' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user) });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
