import express from 'express';
import pool from '../database';

const router = express.Router();

// Get user settings
router.get('/settings', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      'SELECT dark_mode, font_size, font_family, auto_save, writing_streak FROM user_settings WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Create default settings if none exist
      await pool.query(
        'INSERT INTO user_settings (user_id, dark_mode, font_size, font_family, auto_save, writing_streak) VALUES ($1, false, \'medium\', \'Inter\', true, 0) RETURNING *',
        [userId]
      );
    }

    res.json(result.rows[0] || {
      dark_mode: false,
      font_size: 'medium',
      font_family: 'Inter',
      auto_save: true,
      writing_streak: 0
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
router.put('/settings', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { darkMode, fontSize, fontFamily, autoSave, writingStreak } = req.body;

    const updates = [];
    const values = [];

    if (darkMode !== undefined) {
      updates.push('dark_mode = $1');
      values.push(darkMode);
    }
    if (fontSize !== undefined) {
      updates.push('font_size = $1');
      values.push(fontSize);
    }
    if (fontFamily !== undefined) {
      updates.push('font_family = $1');
      values.push(fontFamily);
    }
    if (autoSave !== undefined) {
      updates.push('auto_save = $1');
      values.push(autoSave);
    }
    if (writingStreak !== undefined) {
      updates.push('writing_streak = $1');
      values.push(writingStreak);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    const setClause = updates.join(', ');
    const result = await pool.query(
      `UPDATE user_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${updates.length + 1} RETURNING *`,
      [...values, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
