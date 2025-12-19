import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../repositories/users.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email 已被註冊' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash });
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: '帳號或密碼錯誤' });
    const token = generateToken(user);
    res.json({ token, expiresIn: '2h', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
