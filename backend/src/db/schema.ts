import db from './database';

export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Noise reports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS noise_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      city TEXT NOT NULL DEFAULT 'coimbatore',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      decibel_level INTEGER NOT NULL,
      noise_category TEXT NOT NULL CHECK(noise_category IN ('low', 'medium', 'high', 'extreme')),
      noise_source TEXT,
      description TEXT,
      timestamp DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create index for location queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_noise_reports_location 
    ON noise_reports(latitude, longitude)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_noise_reports_timestamp 
    ON noise_reports(timestamp DESC)
  `);

  // Quiet zones table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiet_zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'coimbatore',
      type TEXT NOT NULL CHECK(type IN ('park', 'library', 'cafe', 'workspace', 'nature')),
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      avg_decibels INTEGER,
      rating REAL DEFAULT 0,
      description TEXT,
      amenities TEXT,
      best_time TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Zone ratings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS zone_ratings (
      id TEXT PRIMARY KEY,
      zone_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (zone_id) REFERENCES quiet_zones(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(zone_id, user_id)
    )
  `);

  console.log('✅ Database tables initialized successfully');
}

export function seedDatabase() {
  const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

  if (checkUsers.count === 0) {
    console.log('📊 Seeding database with multi-city sample data...');

    // Insert sample quiet zones for multiple cities
    const insertZone = db.prepare(`
      INSERT INTO quiet_zones (id, name, city, type, latitude, longitude, avg_decibels, rating, description, amenities, best_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const zones = [
      // Coimbatore
      ['zone-cbe1', 'VOC Park & Zoo', 'coimbatore', 'park', 11.0074, 76.9618, 35, 4.8, 'A peaceful park with greenery, perfect for morning walks and relaxation.', JSON.stringify(['Walking paths', 'Benches', 'Zoo nearby']), '6-9 AM'],
      ['zone-cbe2', 'Coimbatore Public Library', 'coimbatore', 'library', 11.0168, 76.9558, 30, 4.9, 'Quiet study rooms with excellent facilities for students and researchers.', JSON.stringify(['WiFi', 'Power outlets', 'AC', 'Study rooms']), '10 AM - 8 PM'],
      ['zone-cbe3', 'Brookefields Mall Food Court', 'coimbatore', 'cafe', 11.0271, 76.9969, 55, 4.2, 'Modern mall with designated quiet cafes for remote workers.', JSON.stringify(['WiFi', 'Coffee', 'Food', 'AC']), '10 AM - 2 PM'],
      ['zone-cbe4', 'Singanallur Lake', 'coimbatore', 'nature', 11.0045, 77.0285, 38, 4.7, 'Serene lake with walking paths, away from city traffic noise.', JSON.stringify(['Walking paths', 'Scenic views', 'Benches']), 'Early morning'],
      ['zone-cbe5', 'RS Puram Quiet Workspace', 'coimbatore', 'workspace', 11.0050, 76.9550, 40, 4.6, 'Professional coworking space with strict noise policies.', JSON.stringify(['WiFi', 'Meeting rooms', 'Coffee', 'Parking']), '9 AM - 6 PM'],
      ['zone-cbe6', 'Botanical Gardens', 'coimbatore', 'nature', 11.0510, 76.9040, 32, 4.9, 'Expansive gardens with numerous quiet spots among native flora.', JSON.stringify(['Walking paths', 'Benches', 'Restrooms', 'Café']), 'Weekday mornings'],

      // Chennai
      ['zone-che1', 'Marina Beach Early Morning', 'chennai', 'nature', 13.0499, 80.2824, 42, 4.5, 'Peaceful beach atmosphere before the crowds arrive.', JSON.stringify(['Walking paths', 'Benches', 'Scenic views']), '5-7 AM'],
      ['zone-che2', 'Connemara Public Library', 'chennai', 'library', 13.0569, 80.2497, 28, 4.9, 'Historic library with excellent reading rooms and research facilities.', JSON.stringify(['WiFi', 'AC', 'Study rooms', 'Archives']), '9 AM - 8 PM'],
      ['zone-che3', 'Guindy National Park', 'chennai', 'park', 13.0067, 80.2350, 35, 4.7, 'Urban forest with peaceful trails and bird watching spots.', JSON.stringify(['Walking trails', 'Bird watching', 'Benches']), 'Weekday mornings'],
      ['zone-che4', 'Besant Nagar Quiet Cafe', 'chennai', 'cafe', 13.0001, 80.2668, 48, 4.4, 'Cozy cafe popular with remote workers and students.', JSON.stringify(['WiFi', 'Coffee', 'Power outlets', 'AC']), '10 AM - 6 PM'],

      // Bangalore
      ['zone-blr1', 'Cubbon Park', 'bangalore', 'park', 12.9762, 77.5929, 38, 4.8, 'Large urban park with shaded walking paths and quiet corners.', JSON.stringify(['Walking paths', 'Benches', 'Gardens', 'Restrooms']), 'Early morning'],
      ['zone-blr2', 'State Central Library', 'bangalore', 'library', 12.9767, 77.5993, 30, 4.9, 'Well-maintained library with excellent study facilities.', JSON.stringify(['WiFi', 'AC', 'Study rooms', 'Power outlets']), '10 AM - 7 PM'],
      ['zone-blr3', 'Lalbagh Botanical Garden', 'bangalore', 'nature', 12.9507, 77.5848, 33, 4.8, 'Historic botanical garden with serene walking paths.', JSON.stringify(['Walking paths', 'Gardens', 'Lake', 'Benches']), '6-9 AM'],
      ['zone-blr4', 'Koramangala Coworking Hub', 'bangalore', 'workspace', 12.9352, 77.6245, 42, 4.6, 'Modern workspace with noise-controlled zones.', JSON.stringify(['WiFi', 'Meeting rooms', 'Coffee', 'Parking', 'AC']), '9 AM - 7 PM'],

      // Mumbai
      ['zone-mum1', 'Sanjay Gandhi National Park', 'mumbai', 'nature', 19.2183, 72.9100, 36, 4.7, 'Large national park offering escape from city noise.', JSON.stringify(['Walking trails', 'Nature', 'Benches']), 'Early morning'],
      ['zone-mum2', 'Asiatic Society Library', 'mumbai', 'library', 18.9272, 72.8311, 32, 4.8, 'Historic library with peaceful reading rooms.', JSON.stringify(['WiFi', 'AC', 'Study rooms', 'Archives']), '10 AM - 6 PM'],
      ['zone-mum3', 'Hanging Gardens', 'mumbai', 'park', 18.9559, 72.8050, 40, 4.5, 'Terraced gardens with city views and quiet spots.', JSON.stringify(['Walking paths', 'Benches', 'Gardens']), 'Morning hours'],
      ['zone-mum4', 'Bandra Quiet Workspace', 'mumbai', 'workspace', 19.0596, 72.8295, 45, 4.4, 'Professional coworking space in Bandra.', JSON.stringify(['WiFi', 'Meeting rooms', 'Coffee', 'AC']), '9 AM - 8 PM'],

      // Delhi
      ['zone-del1', 'Lodhi Garden', 'delhi', 'park', 28.5933, 77.2197, 40, 4.7, 'Historic garden with monuments and peaceful walking paths.', JSON.stringify(['Walking paths', 'Monuments', 'Benches', 'Gardens']), '6-9 AM'],
      ['zone-del2', 'Delhi Public Library', 'delhi', 'library', 28.6358, 77.2245, 35, 4.8, 'Well-equipped library with quiet study areas.', JSON.stringify(['WiFi', 'AC', 'Study rooms', 'Power outlets']), '10 AM - 8 PM'],
      ['zone-del3', 'Hauz Khas Lake', 'delhi', 'nature', 28.5494, 77.1932, 38, 4.6, 'Serene lake area away from main traffic.', JSON.stringify(['Walking paths', 'Lake views', 'Benches']), 'Early morning'],
      ['zone-del4', 'Connaught Place Workspace', 'delhi', 'workspace', 28.6315, 77.2167, 43, 4.5, 'Central coworking space with noise management.', JSON.stringify(['WiFi', 'Meeting rooms', 'Coffee', 'Parking', 'AC']), '9 AM - 7 PM'],
    ];

    zones.forEach(zone => insertZone.run(...zone));

    // Insert sample noise reports for multiple cities
    const insertReport = db.prepare(`
      INSERT INTO noise_reports (id, city, latitude, longitude, decibel_level, noise_category, noise_source, description, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const reports = [
      // Coimbatore
      ['report-cbe1', 'coimbatore', 11.0168, 76.9558, 85, 'high', 'Construction', 'Metro construction work ongoing', '2024-01-15T10:30:00'],
      ['report-cbe2', 'coimbatore', 11.0074, 76.9618, 42, 'low', 'Park', 'Peaceful park area', '2024-01-15T11:00:00'],
      ['report-cbe3', 'coimbatore', 11.0271, 76.9969, 75, 'high', 'Traffic', 'Heavy traffic on Avinashi Road', '2024-01-15T09:15:00'],
      ['report-cbe4', 'coimbatore', 11.0050, 76.9550, 48, 'low', 'Residential', 'Quiet residential area in RS Puram', '2024-01-14T20:00:00'],
      ['report-cbe5', 'coimbatore', 10.9900, 76.9610, 65, 'medium', 'Market', 'Town Hall market area', '2024-01-15T14:00:00'],
      ['report-cbe6', 'coimbatore', 11.0045, 77.0285, 38, 'low', 'Nature', 'Singanallur Lake area', '2024-01-15T12:30:00'],
      ['report-cbe7', 'coimbatore', 11.0100, 76.9700, 90, 'extreme', 'Industrial', 'Industrial area near Peelamedu', '2024-01-15T15:00:00'],
      ['report-cbe8', 'coimbatore', 11.0200, 76.9800, 55, 'medium', 'Traffic', 'Moderate traffic on Trichy Road', '2024-01-15T16:00:00'],

      // Chennai
      ['report-che1', 'chennai', 13.0827, 80.2707, 78, 'high', 'Traffic', 'Heavy traffic on Anna Salai', '2024-01-15T09:00:00'],
      ['report-che2', 'chennai', 13.0499, 80.2824, 40, 'low', 'Beach', 'Marina Beach early morning', '2024-01-15T06:30:00'],
      ['report-che3', 'chennai', 13.0569, 80.2497, 30, 'low', 'Library', 'Connemara Library area', '2024-01-15T11:00:00'],
      ['report-che4', 'chennai', 13.0878, 80.2785, 88, 'extreme', 'Construction', 'Metro construction at T Nagar', '2024-01-15T14:00:00'],
      ['report-che5', 'chennai', 13.0067, 80.2350, 35, 'low', 'Park', 'Guindy National Park', '2024-01-15T08:00:00'],

      // Bangalore
      ['report-blr1', 'bangalore', 12.9716, 77.5946, 82, 'high', 'Traffic', 'MG Road traffic congestion', '2024-01-15T18:00:00'],
      ['report-blr2', 'bangalore', 12.9762, 77.5929, 38, 'low', 'Park', 'Cubbon Park morning', '2024-01-15T07:00:00'],
      ['report-blr3', 'bangalore', 12.9352, 77.6245, 70, 'medium', 'Traffic', 'Koramangala traffic', '2024-01-15T17:30:00'],
      ['report-blr4', 'bangalore', 12.9507, 77.5848, 33, 'low', 'Garden', 'Lalbagh Botanical Garden', '2024-01-15T08:30:00'],
      ['report-blr5', 'bangalore', 12.9698, 77.7499, 92, 'extreme', 'Airport', 'Near airport area', '2024-01-15T12:00:00'],

      // Mumbai
      ['report-mum1', 'mumbai', 19.0760, 72.8777, 85, 'high', 'Traffic', 'CST area heavy traffic', '2024-01-15T09:30:00'],
      ['report-mum2', 'mumbai', 19.2183, 72.9100, 36, 'low', 'Nature', 'Sanjay Gandhi National Park', '2024-01-15T07:00:00'],
      ['report-mum3', 'mumbai', 18.9272, 72.8311, 32, 'low', 'Library', 'Asiatic Library area', '2024-01-15T11:30:00'],
      ['report-mum4', 'mumbai', 19.0596, 72.8295, 75, 'high', 'Traffic', 'Bandra traffic noise', '2024-01-15T19:00:00'],
      ['report-mum5', 'mumbai', 18.9220, 72.8347, 95, 'extreme', 'Railway', 'Near railway station', '2024-01-15T16:00:00'],

      // Delhi
      ['report-del1', 'delhi', 28.6139, 77.2090, 88, 'extreme', 'Traffic', 'Connaught Place traffic', '2024-01-15T18:30:00'],
      ['report-del2', 'delhi', 28.5933, 77.2197, 40, 'low', 'Park', 'Lodhi Garden morning', '2024-01-15T07:30:00'],
      ['report-del3', 'delhi', 28.6358, 77.2245, 35, 'low', 'Library', 'Delhi Public Library', '2024-01-15T12:00:00'],
      ['report-del4', 'delhi', 28.5494, 77.1932, 38, 'low', 'Nature', 'Hauz Khas Lake area', '2024-01-15T08:00:00'],
      ['report-del5', 'delhi', 28.5562, 77.1000, 92, 'extreme', 'Airport', 'Near IGI Airport', '2024-01-15T13:00:00'],
    ];

    reports.forEach(report => insertReport.run(...report));

    console.log('✅ Database seeded with multi-city sample data');
  }
}

