const express = require('express');
const router = express.Router();
const vulnerabilityService = require('../services/vulnerabilityService');
const logger = require('../utils/logger');

// Get consolidated dashboard data
router.get('/data', async (req, res) => {
  try {
    const data = vulnerabilityService.getConsolidatedData();
    res.json(data);
  } catch (error) {
    logger.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get summary statistics
router.get('/summary', async (req, res) => {
  try {
    const data = vulnerabilityService.getConsolidatedData();
    res.json(data.summary);
  } catch (error) {
    logger.error('Error fetching dashboard summary:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Force refresh of all data
router.post('/refresh', async (req, res) => {
  try {
    const data = await vulnerabilityService.refreshAllData();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error refreshing dashboard data:', error.message);
    res.status(500).json({ error: 'Failed to refresh dashboard data' });
  }
});

// Get vulnerability trends (mock data for demo)
router.get('/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Generate mock trend data
    const trends = [];
    const now = new Date();
    
    for (let i = parseInt(days); i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        critical: Math.floor(Math.random() * 50) + 10,
        high: Math.floor(Math.random() * 100) + 20,
        medium: Math.floor(Math.random() * 200) + 50,
        low: Math.floor(Math.random() * 300) + 100
      });
    }
    
    res.json(trends);
  } catch (error) {
    logger.error('Error fetching vulnerability trends:', error.message);
    res.status(500).json({ error: 'Failed to fetch vulnerability trends' });
  }
});

module.exports = router;