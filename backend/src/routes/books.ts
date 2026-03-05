import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database';

const router = express.Router();

// Get all books for a user
router.get('/', async (req: any, res: any) => {
  try {
    const userId = req.user?.id; // This would come from auth middleware
    const result = await pool.query(
      `SELECT id, title, description, theme, is_password_protured, total_word_count, created_at, updated_at 
       FROM books WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Create new book
router.post('/', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { title, description, theme, password } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const result = await pool.query(
      `INSERT INTO books (title, description, user_id, theme, is_password_protured, password_hash, total_word_count) 
       VALUES ($1, $2, $3, $4, $5, $6, 0) RETURNING *`,
      [title, description, userId, theme, !!password, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Get single book
router.get('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, title, description, theme, is_password_protured, total_word_count, created_at, updated_at 
       FROM books WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get chapters for this book
    const chaptersResult = await pool.query(
      'SELECT id, title, word_count, created_at, updated_at FROM chapters WHERE book_id = $1 ORDER BY order_index',
      [id]
    );

    const book = {
      ...result.rows[0],
      chapters: chaptersResult.rows
    };

    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Update book
router.put('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const updates = req.body;

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE books SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *`,
      [...Object.values(updates), new Date(), id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
