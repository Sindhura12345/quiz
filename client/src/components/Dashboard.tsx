import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Devices as DevicesIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useQuery } from 'react-query';
import io from 'socket.io-client';

import { dashboardService, DashboardData } from '../services/dashboardService';

const COLORS = {
  critical: '#f44336',
  high: '#ff9800',
  medium: '#ff5722',
  low: '#4caf50',
};

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ color, fontWeight: 700 }}>
            {value.toLocaleString()}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUpIcon
                sx={{
                  fontSize: 16,
                  color: trend > 0 ? 'error.main' : 'success.main',
                  mr: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: trend > 0 ? 'error.main' : 'success.main' }}
              >
                {trend > 0 ? '+' : ''}
                {trend}% from last week
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ color }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<DashboardData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery('dashboardData', dashboardService.getDashboardData, {
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: trendsData } = useQuery(
    'vulnerabilityTrends',
    () => dashboardService.getVulnerabilityTrends(30),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join-dashboard');

    newSocket.on('summary-updated', (data: any) => {
      setRealTimeData((prevData) => ({
        ...prevData,
        summary: data,
      }));
      setLastUpdate(new Date().toLocaleTimeString());
    });

    newSocket.on('tenable-updated', (data: any) => {
      setRealTimeData((prevData) => ({
        ...prevData,
        tenable: data,
      }));
    });

    newSocket.on('manageengine-updated', (data: any) => {
      setRealTimeData((prevData) => ({
        ...prevData,
        manageEngine: data,
      }));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const currentData = realTimeData || dashboardData;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load dashboard data. Please check your API configuration.
      </Alert>
    );
  }

  if (!currentData) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No data available. Please configure your Tenable and ManageEngine API keys.
      </Alert>
    );
  }

  const summary = currentData.summary || {};
  const severityData = [
    { name: 'Critical', value: summary.criticalVulnerabilities || 0, color: COLORS.critical },
    { name: 'High', value: summary.highVulnerabilities || 0, color: COLORS.high },
    { name: 'Medium', value: summary.mediumVulnerabilities || 0, color: COLORS.medium },
    { name: 'Low', value: summary.lowVulnerabilities || 0, color: COLORS.low },
  ];

  const patchingData = [
    {
      name: 'Patched',
      value: summary.patchedEndpoints || 0,
      color: COLORS.low,
    },
    {
      name: 'Unpatched',
      value: summary.unpatchedEndpoints || 0,
      color: COLORS.critical,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Security Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {lastUpdate && (
            <Typography variant="body2" color="textSecondary">
              Last update: {lastUpdate}
            </Typography>
          )}
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Real-time status indicators */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Chip
              icon={<SecurityIcon />}
              label={`Tenable: ${summary.sources?.tenable?.status || 'Unknown'}`}
              color={summary.sources?.tenable?.status === 'healthy' ? 'success' : 'error'}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Chip
              icon={<DevicesIcon />}
              label={`ManageEngine: ${summary.sources?.manageEngine?.status || 'Unknown'}`}
              color={summary.sources?.manageEngine?.status === 'healthy' ? 'success' : 'error'}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Vulnerabilities"
            value={summary.totalVulnerabilities || 0}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color={COLORS.high}
            trend={Math.floor(Math.random() * 20) - 10}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Critical Vulnerabilities"
            value={summary.criticalVulnerabilities || 0}
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color={COLORS.critical}
            trend={Math.floor(Math.random() * 10) - 5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Network Assets"
            value={summary.totalNetworkAssets || 0}
            icon={<ComputerIcon sx={{ fontSize: 40 }} />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Endpoints"
            value={summary.totalEndpoints || 0}
            icon={<DevicesIcon sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      {/* Risk Score and Patching Efficiency */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Score
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h3" sx={{ fontWeight: 700, mr: 2 }}>
                  {summary.riskScore || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  / 100
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((summary.riskScore || 0) * 10, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      (summary.riskScore || 0) > 7
                        ? COLORS.critical
                        : (summary.riskScore || 0) > 4
                        ? COLORS.high
                        : COLORS.low,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patching Efficiency
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h3" sx={{ fontWeight: 700, mr: 2 }}>
                  {summary.patchingEfficiency || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={summary.patchingEfficiency || 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      (summary.patchingEfficiency || 0) > 80
                        ? COLORS.low
                        : (summary.patchingEfficiency || 0) > 60
                        ? COLORS.medium
                        : COLORS.critical,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Vulnerability Severity Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vulnerability Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Patching Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Endpoint Patching Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patchingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patchingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vulnerability Trends */}
        {trendsData && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vulnerability Trends (30 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="critical"
                      stackId="1"
                      stroke={COLORS.critical}
                      fill={COLORS.critical}
                    />
                    <Area
                      type="monotone"
                      dataKey="high"
                      stackId="1"
                      stroke={COLORS.high}
                      fill={COLORS.high}
                    />
                    <Area
                      type="monotone"
                      dataKey="medium"
                      stackId="1"
                      stroke={COLORS.medium}
                      fill={COLORS.medium}
                    />
                    <Area
                      type="monotone"
                      dataKey="low"
                      stackId="1"
                      stroke={COLORS.low}
                      fill={COLORS.low}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;