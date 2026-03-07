import express from 'express';
import pool from '../database';

const router = express.Router();

// Get all chapters for a book
router.get('/book/:bookId', async (req: any, res: any) => {
  try {
    const { bookId } = req.params;
    const result = await pool.query(
      'SELECT id, title, word_count, created_at, updated_at FROM chapters WHERE book_id = $1 ORDER BY order_index',
      [bookId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Create new chapter
router.post('/book/:bookId', async (req: any, res: any) => {
  try {
    const { bookId } = req.params;
    const { title } = req.body;

    // Get the next order index
    const maxOrderResult = await pool.query(
      'SELECT MAX(order_index) as max_order FROM chapters WHERE book_id = $1',
      [bookId]
    );
    const nextOrder = (maxOrderResult.rows[0].max_order || 0) + 1;

    const result = await pool.query(
      'INSERT INTO chapters (title, book_id, order_index, word_count) VALUES ($1, $2, $3, 0) RETURNING *',
      [title, bookId, nextOrder]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

export default router;
