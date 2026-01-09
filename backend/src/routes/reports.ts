import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import db from '../db/database';
import { randomUUID } from 'crypto';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

function generateId() {
    return randomUUID();
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Submit noise report
router.post(
    '/',
    optionalAuth,
    [
        body('latitude').isFloat({ min: -90, max: 90 }),
        body('longitude').isFloat({ min: -180, max: 180 }),
        body('decibel_level').isInt({ min: 0, max: 150 }),
        body('noise_category').isIn(['low', 'medium', 'high', 'extreme']),
        body('noise_source').optional().trim(),
        body('description').optional().trim(),
        body('timestamp').isISO8601(),
    ],
    (req: AuthRequest, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { latitude, longitude, decibel_level, noise_category, noise_source, description, timestamp } = req.body;
            const userId = req.user?.id || null;

            const reportId = generateId();
            const stmt = db.prepare(`
        INSERT INTO noise_reports (id, user_id, latitude, longitude, decibel_level, noise_category, noise_source, description, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            stmt.run(reportId, userId, latitude, longitude, decibel_level, noise_category, noise_source, description, timestamp);

            const report = db.prepare('SELECT * FROM noise_reports WHERE id = ?').get(reportId);

            // Broadcast to WebSocket clients (if implemented)
            if (global.wss) {
                global.wss.clients.forEach((client: any) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({ type: 'new_report', data: report }));
                    }
                });
            }

            res.status(201).json({
                message: 'Noise report submitted successfully',
                report,
            });
        } catch (error) {
            console.error('Submit report error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get all reports with filters
router.get(
    '/',
    [
        query('city').optional().isString(),
        query('limit').optional().isInt({ min: 1, max: 1000 }),
        query('offset').optional().isInt({ min: 0 }),
        query('category').optional().isIn(['low', 'medium', 'high', 'extreme']),
        query('source').optional().trim(),
        query('since').optional().isISO8601(),
    ],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const city = req.query.city as string;
            const limit = parseInt(req.query.limit as string) || 100;
            const offset = parseInt(req.query.offset as string) || 0;
            const category = req.query.category as string;
            const source = req.query.source as string;
            const since = req.query.since as string;

            let query = 'SELECT * FROM noise_reports WHERE 1=1';
            const params: any[] = [];

            if (city) {
                query += ' AND city = ?';
                params.push(city);
            }

            if (category) {
                query += ' AND noise_category = ?';
                params.push(category);
            }

            if (source) {
                query += ' AND noise_source LIKE ?';
                params.push(`%${source}%`);
            }

            if (since) {
                query += ' AND timestamp >= ?';
                params.push(since);
            }

            query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const reports = db.prepare(query).all(...params);
            const total = db.prepare('SELECT COUNT(*) as count FROM noise_reports').get() as { count: number };

            res.json({
                reports,
                total: total.count,
                limit,
                offset,
            });
        } catch (error) {
            console.error('Get reports error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get nearby reports
router.get(
    '/nearby',
    [
        query('latitude').isFloat({ min: -90, max: 90 }),
        query('longitude').isFloat({ min: -180, max: 180 }),
        query('radius').optional().isFloat({ min: 0.1, max: 100 }), // in km
    ],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const latitude = parseFloat(req.query.latitude as string);
            const longitude = parseFloat(req.query.longitude as string);
            const radius = parseFloat(req.query.radius as string) || 5; // default 5km

            const allReports = db.prepare('SELECT * FROM noise_reports').all() as any[];

            const nearbyReports = allReports
                .map(report => ({
                    ...report,
                    distance: calculateDistance(latitude, longitude, report.latitude, report.longitude),
                }))
                .filter(report => report.distance <= radius)
                .sort((a, b) => a.distance - b.distance);

            res.json({ reports: nearbyReports, radius });
        } catch (error) {
            console.error('Get nearby reports error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get specific report
router.get('/:id', (req, res) => {
    try {
        const report = db.prepare('SELECT * FROM noise_reports WHERE id = ?').get(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({ report });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete own report
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
    try {
        const report = db.prepare('SELECT * FROM noise_reports WHERE id = ?').get(req.params.id) as any;

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (report.user_id !== req.user!.id) {
            return res.status(403).json({ error: 'Not authorized to delete this report' });
        }

        db.prepare('DELETE FROM noise_reports WHERE id = ?').run(req.params.id);

        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
