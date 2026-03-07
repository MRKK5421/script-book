import express from 'express';
import pool from '../database';

const router = express.Router();

// Get all pages for a chapter
router.get('/chapter/:chapterId', async (req: any, res: any) => {
  try {
    const { chapterId } = req.params;
    const result = await pool.query(
      'SELECT id, content, word_count, created_at, updated_at FROM pages WHERE chapter_id = $1 ORDER BY order_index',
      [chapterId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Create new page
router.post('/chapter/:chapterId', async (req: any, res: any) => {
  try {
    const { chapterId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Page content is required' });
    }

    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;

    // Get next order index
    const maxOrderResult = await pool.query(
      'SELECT MAX(order_index) as max_order FROM pages WHERE chapter_id = $1',
      [chapterId]
    );
    const nextOrder = (maxOrderResult.rows[0].max_order || 0) + 1;

    const result = await pool.query(
      'INSERT INTO pages (content, word_count, chapter_id, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [content, wordCount, chapterId, nextOrder]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Update page
router.put('/:pageId', async (req: any, res: any) => {
  try {
    const { pageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Page content is required' });
    }

    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;

    const result = await pool.query(
      'UPDATE pages SET content = $1, word_count = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [content, wordCount, pageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Delete page
router.delete('/:pageId', async (req: any, res: any) => {
  try {
    const { pageId } = req.params;
    const result = await pool.query(
      'DELETE FROM pages WHERE id = $1 RETURNING id',
      [pageId]
    );

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

export default router;
