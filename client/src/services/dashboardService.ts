import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface DashboardSummary {
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  totalNetworkAssets: number;
  totalScans: number;
  totalEndpoints: number;
  patchedEndpoints: number;
  unpatchedEndpoints: number;
  complianceScore: number;
  riskScore: number;
  patchingEfficiency: number;
  lastUpdated: string;
  sources: {
    tenable: {
      lastUpdated: string;
      status: string;
    };
    manageEngine: {
      lastUpdated: string;
      status: string;
    };
  };
}

export interface DashboardData {
  summary: DashboardSummary;
  tenable: any;
  manageEngine: any;
  lastUpdated: string;
}

export interface VulnerabilityTrend {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

class DashboardService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.axiosInstance.get('/dashboard/data');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await this.axiosInstance.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  async refreshDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.axiosInstance.post('/dashboard/refresh');
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      throw error;
    }
  }

  async getVulnerabilityTrends(days: number = 30): Promise<VulnerabilityTrend[]> {
    try {
      const response = await this.axiosInstance.get(`/dashboard/trends?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vulnerability trends:', error);
      throw error;
    }
  }

  async getTenableStats(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/tenable/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching Tenable stats:', error);
      throw error;
    }
  }

  async getManageEngineStats(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/manageengine/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching ManageEngine stats:', error);
      throw error;
    }
  }

  async getTenableVulnerabilities(filters?: any): Promise<any> {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await this.axiosInstance.get(`/tenable/vulnerabilities?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Tenable vulnerabilities:', error);
      throw error;
    }
  }

  async getManageEngineVulnerabilities(filters?: any): Promise<any> {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await this.axiosInstance.get(`/manageengine/vulnerabilities?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ManageEngine vulnerabilities:', error);
      throw error;
    }
  }

  async getTenableAssets(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/tenable/assets');
      return response.data;
    } catch (error) {
      console.error('Error fetching Tenable assets:', error);
      throw error;
    }
  }

  async getManageEngineEndpoints(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/manageengine/endpoints');
      return response.data;
    } catch (error) {
      console.error('Error fetching ManageEngine endpoints:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();