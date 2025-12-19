import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { findAllParticipants, findByOwner, createParticipant, deleteById } from '../repositories/participants.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// all routes require auth
router.use(authMiddleware);

// GET /api/signup
router.get('/', async (req, res) => {
  try {
    const data = req.user.role === 'admin'
      ? await findAllParticipants()
      : await findByOwner(req.user.id);
    res.json({ total: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/signup
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const doc = { name, email, phone, ownerId: req.user.id, createdAt: new Date() };
    const created = await createParticipant(doc);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/signup/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await findAllParticipants();
    const item = data.find((i) => i._id?.toString?.() === id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && item.ownerId !== req.user.id) {
      return res.status(403).json({ error: '權限不足' });
    }
    await deleteById(id);
    res.json({ message: '刪除完成' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
