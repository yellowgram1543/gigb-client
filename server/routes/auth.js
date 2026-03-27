import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (synced from Supabase)
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is already populated by the 'protect' middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
