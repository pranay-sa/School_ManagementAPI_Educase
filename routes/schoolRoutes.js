const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');

// Add school route
router.post('/addSchool', addSchool);

// List schools route
router.get('/listSchools', listSchools);

module.exports = router;