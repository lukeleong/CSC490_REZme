const { User } = require('../models');

// Middleware to check admin status
exports.checkAdminStatus = async (req, res, next) => {
  console.log('Inside checkAdminStatus middleware');
  console.log('req.user:', req.user);
  console.log('req.user.id:', req.user.id); 
  try {
    const user = await User.findByPk(req.user.id);
    console.log('User found in checkAdminStatus:', user);
    if (!user || user.IsAdmin !== true) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    res.status(500).json({ error: 'Error checking admin status' });
  }
};

module.exports = exports;