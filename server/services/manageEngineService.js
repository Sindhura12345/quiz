const axios = require('axios');
const logger = require('../utils/logger');

class ManageEngineService {
  constructor() {
    this.baseURL = process.env.MANAGE_ENGINE_BASE_URL;
    this.apiKey = process.env.MANAGE_ENGINE_API_KEY;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
  }

  async getVulnerabilities(filters = {}) {
    try {
      const params = {
        limit: filters.limit || 1000,
        offset: filters.offset || 0,
        ...filters
      };

      const response = await this.axiosInstance.get('/api/v1/patch/vulnerabilities', { params });
      return response.data;
    } catch (error) {
      logger.error('Error fetching vulnerabilities from ManageEngine:', error.message);
      throw error;
    }
  }

  async getEndpoints() {
    try {
      const response = await this.axiosInstance.get('/api/v1/endpoints');
      return response.data.endpoints || [];
    } catch (error) {
      logger.error('Error fetching endpoints from ManageEngine:', error.message);
      throw error;
    }
  }

  async getPatchStatus() {
    try {
      const response = await this.axiosInstance.get('/api/v1/patch/status');
      return response.data;
    } catch (error) {
      logger.error('Error fetching patch status from ManageEngine:', error.message);
      throw error;
    }
  }

  async getSecurityUpdates() {
    try {
      const response = await this.axiosInstance.get('/api/v1/patch/security-updates');
      return response.data.updates || [];
    } catch (error) {
      logger.error('Error fetching security updates from ManageEngine:', error.message);
      throw error;
    }
  }

  async getComplianceStatus() {
    try {
      const response = await this.axiosInstance.get('/api/v1/compliance/status');
      return response.data;
    } catch (error) {
      logger.error('Error fetching compliance status from ManageEngine:', error.message);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const [vulnerabilities, endpoints, patchStatus, securityUpdates, compliance] = await Promise.all([
        this.getVulnerabilities({ limit: 5000 }),
        this.getEndpoints(),
        this.getPatchStatus(),
        this.getSecurityUpdates(),
        this.getComplianceStatus()
      ]);

      const vulnData = vulnerabilities.vulnerabilities || [];
      
      const stats = {
        totalVulnerabilities: vulnData.length,
        criticalVulnerabilities: vulnData.filter(v => v.severity === 'Critical' || v.severity === 'critical').length,
        highVulnerabilities: vulnData.filter(v => v.severity === 'High' || v.severity === 'high').length,
        mediumVulnerabilities: vulnData.filter(v => v.severity === 'Medium' || v.severity === 'medium').length,
        lowVulnerabilities: vulnData.filter(v => v.severity === 'Low' || v.severity === 'low').length,
        totalEndpoints: endpoints.length,
        patchedEndpoints: patchStatus.patched || 0,
        unpatchedEndpoints: patchStatus.unpatched || 0,
        pendingUpdates: securityUpdates.length,
        complianceScore: compliance.score || 0,
        lastUpdated: new Date().toISOString(),
        vulnerabilities: vulnData.slice(0, 100) // Return top 100 for dashboard
      };

      return stats;
    } catch (error) {
      logger.error('Error fetching dashboard stats from ManageEngine:', error.message);
      return {
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        totalEndpoints: 0,
        patchedEndpoints: 0,
        unpatchedEndpoints: 0,
        pendingUpdates: 0,
        complianceScore: 0,
        lastUpdated: new Date().toISOString(),
        vulnerabilities: [],
        error: error.message
      };
    }
  }
}

module.exports = new ManageEngineService();