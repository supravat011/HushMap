import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import db from '../db/database';
import { randomUUID } from 'crypto';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

function generateId() {
    return randomUUID();
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get all zones
router.get(
    '/',
    [
        query('city').optional().isString(),
        query('type').optional().isIn(['park', 'library', 'cafe', 'workspace', 'nature']),
        query('limit').optional().isInt({ min: 1, max: 100 }),
    ],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const city = req.query.city as string;
            const type = req.query.type as string;
            const limit = parseInt(req.query.limit as string) || 50;

            let query = 'SELECT * FROM quiet_zones WHERE 1=1';
            const params: any[] = [];

            if (city) {
                query += ' AND city = ?';
                params.push(city);
            }

            if (type) {
                query += ' AND type = ?';
                params.push(type);
            }

            query += ' ORDER BY rating DESC LIMIT ?';
            params.push(limit);

            const zones = db.prepare(query).all(...params).map((zone: any) => ({
                ...zone,
                amenities: zone.amenities ? JSON.parse(zone.amenities) : [],
            }));

            res.json({ zones });
        } catch (error) {
            console.error('Get zones error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get nearby zones
router.get(
    '/nearby',
    [
        query('latitude').isFloat({ min: -90, max: 90 }),
        query('longitude').isFloat({ min: -180, max: 180 }),
        query('radius').optional().isFloat({ min: 0.1, max: 100 }),
    ],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const latitude = parseFloat(req.query.latitude as string);
            const longitude = parseFloat(req.query.longitude as string);
            const radius = parseFloat(req.query.radius as string) || 10;

            const allZones = db.prepare('SELECT * FROM quiet_zones').all() as any[];

            const nearbyZones = allZones
                .map(zone => ({
                    ...zone,
                    amenities: zone.amenities ? JSON.parse(zone.amenities) : [],
                    distance: calculateDistance(latitude, longitude, zone.latitude, zone.longitude),
                }))
                .filter(zone => zone.distance <= radius)
                .sort((a, b) => a.distance - b.distance);

            res.json({ zones: nearbyZones, radius });
        } catch (error) {
            console.error('Get nearby zones error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Get specific zone
router.get('/:id', (req, res) => {
    try {
        const zone = db.prepare('SELECT * FROM quiet_zones WHERE id = ?').get(req.params.id) as any;

        if (!zone) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        zone.amenities = zone.amenities ? JSON.parse(zone.amenities) : [];

        res.json({ zone });
    } catch (error) {
        console.error('Get zone error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create zone
router.post(
    '/',
    authMiddleware,
    [
        body('name').trim().notEmpty(),
        body('type').isIn(['park', 'library', 'cafe', 'workspace', 'nature']),
        body('latitude').isFloat({ min: -90, max: 90 }),
        body('longitude').isFloat({ min: -180, max: 180 }),
        body('avg_decibels').optional().isInt({ min: 0, max: 150 }),
        body('description').optional().trim(),
        body('amenities').optional().isArray(),
        body('best_time').optional().trim(),
    ],
    (req: AuthRequest, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, type, latitude, longitude, avg_decibels, description, amenities, best_time } = req.body;
            const zoneId = generateId();

            const stmt = db.prepare(`
        INSERT INTO quiet_zones (id, name, type, latitude, longitude, avg_decibels, description, amenities, best_time, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            stmt.run(
                zoneId,
                name,
                type,
                latitude,
                longitude,
                avg_decibels || null,
                description || null,
                amenities ? JSON.stringify(amenities) : null,
                best_time || null,
                req.user!.id
            );

            const zone = db.prepare('SELECT * FROM quiet_zones WHERE id = ?').get(zoneId) as any;
            zone.amenities = zone.amenities ? JSON.parse(zone.amenities) : [];

            res.status(201).json({
                message: 'Quiet zone created successfully',
                zone,
            });
        } catch (error) {
            console.error('Create zone error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Rate a zone
router.post(
    '/:id/rate',
    authMiddleware,
    [
        body('rating').isInt({ min: 1, max: 5 }),
        body('comment').optional().trim(),
    ],
    (req: AuthRequest, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { rating, comment } = req.body;
            const zoneId = req.params.id;
            const userId = req.user!.id;

            // Check if zone exists
            const zone = db.prepare('SELECT id FROM quiet_zones WHERE id = ?').get(zoneId);
            if (!zone) {
                return res.status(404).json({ error: 'Zone not found' });
            }

            // Check if user already rated
            const existingRating = db.prepare('SELECT id FROM zone_ratings WHERE zone_id = ? AND user_id = ?')
                .get(zoneId, userId);

            if (existingRating) {
                // Update existing rating
                db.prepare('UPDATE zone_ratings SET rating = ?, comment = ? WHERE zone_id = ? AND user_id = ?')
                    .run(rating, comment || null, zoneId, userId);
            } else {
                // Insert new rating
                const ratingId = generateId();
                db.prepare(`
          INSERT INTO zone_ratings (id, zone_id, user_id, rating, comment)
          VALUES (?, ?, ?, ?, ?)
        `).run(ratingId, zoneId, userId, rating, comment || null);
            }

            // Update zone average rating
            const avgRating = db.prepare('SELECT AVG(rating) as avg FROM zone_ratings WHERE zone_id = ?')
                .get(zoneId) as { avg: number };

            db.prepare('UPDATE quiet_zones SET rating = ? WHERE id = ?')
                .run(avgRating.avg, zoneId);

            res.json({
                message: 'Rating submitted successfully',
                averageRating: avgRating.avg,
            });
        } catch (error) {
            console.error('Rate zone error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;
