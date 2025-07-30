const express = require('express');
const router = express.Router();
const tenableService = require('../services/tenableService');
const logger = require('../utils/logger');

// Get Tenable dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await tenableService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching Tenable stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch Tenable statistics' });
  }
});

// Get vulnerabilities with filters
router.get('/vulnerabilities', async (req, res) => {
  try {
    const { severity, limit, state } = req.query;
    const filters = {};
    
    if (severity) filters.severity = severity.split(',');
    if (limit) filters.limit = parseInt(limit);
    if (state) filters.state = state.split(',');
    
    const vulnerabilities = await tenableService.getVulnerabilities(filters);
    res.json(vulnerabilities);
  } catch (error) {
    logger.error('Error fetching Tenable vulnerabilities:', error.message);
    res.status(500).json({ error: 'Failed to fetch vulnerabilities' });
  }
});

// Get network assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await tenableService.getAssets();
    res.json(assets);
  } catch (error) {
    logger.error('Error fetching Tenable assets:', error.message);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Get scans
router.get('/scans', async (req, res) => {
  try {
    const scans = await tenableService.getScans();
    res.json(scans);
  } catch (error) {
    logger.error('Error fetching Tenable scans:', error.message);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

module.exports = router;