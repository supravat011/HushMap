import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../db/database';
import { randomUUID } from 'crypto';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate UUID
function generateId() {
    return randomUUID();
}

// Register
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('username').trim().isLength({ min: 3, max: 50 }),
        body('password').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, username, password } = req.body;

            // Check if user exists
            const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const userId = generateId();
            const stmt = db.prepare(`
        INSERT INTO users (id, email, username, password_hash)
        VALUES (?, ?, ?, ?)
      `);

            stmt.run(userId, email, username, passwordHash);

            // Generate token
            const token = jwt.sign(
                { id: userId, email },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: userId, email, username },
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user
            const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get current user
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    try {
        const user = db.prepare('SELECT id, email, username, created_at FROM users WHERE id = ?')
            .get(req.user!.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
