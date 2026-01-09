import { Router } from 'express';
import db from '../db/database';

const router = Router();

// Get hourly noise pattern
router.get('/hourly', (req, res) => {
    try {
        const hourlyData = db.prepare(`
      SELECT 
        strftime('%H', timestamp) as hour,
        AVG(decibel_level) as avg_decibels,
        COUNT(*) as report_count
      FROM noise_reports
      WHERE timestamp >= datetime('now', '-7 days')
      GROUP BY hour
      ORDER BY hour
    `).all();

        res.json({ data: hourlyData });
    } catch (error) {
        console.error('Hourly analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get weekly statistics
router.get('/weekly', (req, res) => {
    try {
        const weeklyData = db.prepare(`
      SELECT 
        CASE CAST(strftime('%w', timestamp) AS INTEGER)
          WHEN 0 THEN 'Sun'
          WHEN 1 THEN 'Mon'
          WHEN 2 THEN 'Tue'
          WHEN 3 THEN 'Wed'
          WHEN 4 THEN 'Thu'
          WHEN 5 THEN 'Fri'
          WHEN 6 THEN 'Sat'
        END as day,
        AVG(decibel_level) as avg_decibels,
        COUNT(*) as report_count
      FROM noise_reports
      WHERE timestamp >= datetime('now', '-7 days')
      GROUP BY strftime('%w', timestamp)
      ORDER BY strftime('%w', timestamp)
    `).all();

        res.json({ data: weeklyData });
    } catch (error) {
        console.error('Weekly analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get noise source distribution
router.get('/sources', (req, res) => {
    try {
        const sourceData = db.prepare(`
      SELECT 
        noise_source as name,
        COUNT(*) as value
      FROM noise_reports
      WHERE noise_source IS NOT NULL
      GROUP BY noise_source
      ORDER BY value DESC
    `).all();

        res.json({ data: sourceData });
    } catch (error) {
        console.error('Sources analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get noisiest locations (hotspots)
router.get('/hotspots', (req, res) => {
    try {
        // Group by approximate location (rounded coordinates)
        const hotspots = db.prepare(`
      SELECT 
        ROUND(latitude, 3) as lat,
        ROUND(longitude, 3) as lng,
        AVG(decibel_level) as avg_decibels,
        COUNT(*) as report_count,
        noise_category
      FROM noise_reports
      GROUP BY ROUND(latitude, 3), ROUND(longitude, 3)
      HAVING report_count > 1
      ORDER BY avg_decibels DESC
      LIMIT 10
    `).all();

        res.json({ hotspots });
    } catch (error) {
        console.error('Hotspots analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get city statistics
router.get('/city-stats', (req, res) => {
    try {
        const totalReports = db.prepare('SELECT COUNT(*) as count FROM noise_reports').get() as { count: number };
        const avgNoise = db.prepare('SELECT AVG(decibel_level) as avg FROM noise_reports').get() as { avg: number };
        const quietZones = db.prepare('SELECT COUNT(*) as count FROM quiet_zones').get() as { count: number };

        const quietestTime = db.prepare(`
      SELECT strftime('%H:%M', timestamp) as time, AVG(decibel_level) as avg
      FROM noise_reports
      GROUP BY strftime('%H', timestamp)
      ORDER BY avg ASC
      LIMIT 1
    `).get() as { time: string; avg: number };

        const weeklyReports = db.prepare(`
      SELECT COUNT(*) as count FROM noise_reports
      WHERE timestamp >= datetime('now', '-7 days')
    `).get() as { count: number };

        const lastWeekReports = db.prepare(`
      SELECT COUNT(*) as count FROM noise_reports
      WHERE timestamp >= datetime('now', '-14 days')
      AND timestamp < datetime('now', '-7 days')
    `).get() as { count: number };

        const weeklyChange = lastWeekReports.count > 0
            ? ((weeklyReports.count - lastWeekReports.count) / lastWeekReports.count * 100).toFixed(1)
            : '0';

        res.json({
            stats: {
                totalReports: totalReports.count,
                avgCityNoise: Math.round(avgNoise.avg || 0),
                quietZonesFound: quietZones.count,
                quietestTime: quietestTime?.time || 'N/A',
                weeklyReports: weeklyReports.count,
                weeklyChange: `${weeklyChange}%`,
            },
        });
    } catch (error) {
        console.error('City stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
