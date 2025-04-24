const { pool } = require('../db/db');
const { calculateDistance } = require('../utils/distanceCalculator');

/**
 * Add a new school to the database
 */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (name, address, latitude, longitude) are required' 
      });
    }

    // Validate data types
    if (typeof name !== 'string' || typeof address !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and address must be strings' 
      });
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180' 
      });
    }

    // Insert school into database
    const [result] = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, lat, lng]
    );

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude: lat,
        longitude: lng
      }
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add school',
      error: error.message 
    });
  }
}

/**
 * List all schools sorted by proximity to user location
 */
async function listSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude parameters are required' 
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLng) || userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180' 
      });
    }

    // Fetch all schools
    const [schools] = await pool.query('SELECT * FROM schools');

    // Calculate distance for each school and sort
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, userLng,
        school.latitude, school.longitude
      );
      
      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
      };
    });

    // Sort by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to list schools',
      error: error.message 
    });
  }
}

module.exports = {
  addSchool,
  listSchools
};