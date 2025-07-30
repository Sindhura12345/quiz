const axios = require('axios');
const logger = require('../utils/logger');

class TenableService {
  constructor() {
    this.baseURL = process.env.TENABLE_BASE_URL || 'https://cloud.tenable.com';
    this.accessKey = process.env.TENABLE_ACCESS_KEY;
    this.secretKey = process.env.TENABLE_SECRET_KEY;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-ApiKeys': `accessKey=${this.accessKey}; secretKey=${this.secretKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
  }

  async getVulnerabilities(filters = {}) {
    try {
      const response = await this.axiosInstance.post('/vulnerabilities/export', {
        num_assets: filters.limit || 1000,
        filters: {
          severity: filters.severity || ['critical', 'high', 'medium'],
          state: filters.state || ['open'],
          ...filters.customFilters
        }
      });

      if (response.data && response.data.export_uuid) {
        return await this.pollExportStatus(response.data.export_uuid);
      }
      
      return null;
    } catch (error) {
      logger.error('Error fetching vulnerabilities from Tenable:', error.message);
      throw error;
    }
  }

  async pollExportStatus(exportUuid, maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const statusResponse = await this.axiosInstance.get(`/vulnerabilities/export/${exportUuid}/status`);
        
        if (statusResponse.data.status === 'finished') {
          return await this.downloadExport(exportUuid);
        }
        
        if (statusResponse.data.status === 'error') {
          throw new Error('Export failed');
        }
        
        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        logger.error(`Error polling export status: ${error.message}`);
        throw error;
      }
    }
    
    throw new Error('Export timeout');
  }

  async downloadExport(exportUuid) {
    try {
      const response = await this.axiosInstance.get(`/vulnerabilities/export/${exportUuid}/download`);
      return response.data;
    } catch (error) {
      logger.error('Error downloading export:', error.message);
      throw error;
    }
  }

  async getAssets() {
    try {
      const response = await this.axiosInstance.get('/assets');
      return response.data.assets || [];
    } catch (error) {
      logger.error('Error fetching assets from Tenable:', error.message);
      throw error;
    }
  }

  async getScans() {
    try {
      const response = await this.axiosInstance.get('/scans');
      return response.data.scans || [];
    } catch (error) {
      logger.error('Error fetching scans from Tenable:', error.message);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const [vulnerabilities, assets, scans] = await Promise.all([
        this.getVulnerabilities({ limit: 5000 }),
        this.getAssets(),
        this.getScans()
      ]);

      const vulnData = Array.isArray(vulnerabilities) ? vulnerabilities : [];
      
      const stats = {
        totalVulnerabilities: vulnData.length,
        criticalVulnerabilities: vulnData.filter(v => v.severity === 'Critical').length,
        highVulnerabilities: vulnData.filter(v => v.severity === 'High').length,
        mediumVulnerabilities: vulnData.filter(v => v.severity === 'Medium').length,
        lowVulnerabilities: vulnData.filter(v => v.severity === 'Low').length,
        totalAssets: assets.length,
        totalScans: scans.length,
        lastUpdated: new Date().toISOString(),
        vulnerabilities: vulnData.slice(0, 100) // Return top 100 for dashboard
      };

      return stats;
    } catch (error) {
      logger.error('Error fetching dashboard stats from Tenable:', error.message);
      return {
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        totalAssets: 0,
        totalScans: 0,
        lastUpdated: new Date().toISOString(),
        vulnerabilities: [],
        error: error.message
      };
    }
  }
}

module.exports = new TenableService();