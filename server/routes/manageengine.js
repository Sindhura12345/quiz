const express = require('express');
const router = express.Router();
const manageEngineService = require('../services/manageEngineService');
const logger = require('../utils/logger');

// Get ManageEngine dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await manageEngineService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching ManageEngine stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch ManageEngine statistics' });
  }
});

// Get vulnerabilities with filters
router.get('/vulnerabilities', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const filters = {};
    
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);
    
    const vulnerabilities = await manageEngineService.getVulnerabilities(filters);
    res.json(vulnerabilities);
  } catch (error) {
    logger.error('Error fetching ManageEngine vulnerabilities:', error.message);
    res.status(500).json({ error: 'Failed to fetch vulnerabilities' });
  }
});

// Get endpoints
router.get('/endpoints', async (req, res) => {
  try {
    const endpoints = await manageEngineService.getEndpoints();
    res.json(endpoints);
  } catch (error) {
    logger.error('Error fetching ManageEngine endpoints:', error.message);
    res.status(500).json({ error: 'Failed to fetch endpoints' });
  }
});

// Get patch status
router.get('/patch-status', async (req, res) => {
  try {
    const patchStatus = await manageEngineService.getPatchStatus();
    res.json(patchStatus);
  } catch (error) {
    logger.error('Error fetching ManageEngine patch status:', error.message);
    res.status(500).json({ error: 'Failed to fetch patch status' });
  }
});

// Get security updates
router.get('/security-updates', async (req, res) => {
  try {
    const updates = await manageEngineService.getSecurityUpdates();
    res.json(updates);
  } catch (error) {
    logger.error('Error fetching ManageEngine security updates:', error.message);
    res.status(500).json({ error: 'Failed to fetch security updates' });
  }
});

// Get compliance status
router.get('/compliance', async (req, res) => {
  try {
    const compliance = await manageEngineService.getComplianceStatus();
    res.json(compliance);
  } catch (error) {
    logger.error('Error fetching ManageEngine compliance status:', error.message);
    res.status(500).json({ error: 'Failed to fetch compliance status' });
  }
});

module.exports = router;