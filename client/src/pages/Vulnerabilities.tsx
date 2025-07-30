import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { dashboardService } from '../services/dashboardService';

interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  score: number;
  asset: string;
  source: 'Tenable' | 'ManageEngine';
  status: 'Open' | 'Fixed' | 'In Progress';
  firstSeen: string;
  lastSeen: string;
}

const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'CVE-2023-1234',
    title: 'Remote Code Execution in Apache HTTP Server',
    severity: 'Critical',
    score: 9.8,
    asset: '192.168.1.100',
    source: 'Tenable',
    status: 'Open',
    firstSeen: '2023-10-15',
    lastSeen: '2023-10-20',
  },
  {
    id: 'CVE-2023-5678',
    title: 'SQL Injection in Web Application',
    severity: 'High',
    score: 8.5,
    asset: 'web-server-01',
    source: 'Tenable',
    status: 'In Progress',
    firstSeen: '2023-10-12',
    lastSeen: '2023-10-19',
  },
  {
    id: 'MS23-001',
    title: 'Windows Security Update Missing',
    severity: 'High',
    score: 7.8,
    asset: 'DESKTOP-001',
    source: 'ManageEngine',
    status: 'Open',
    firstSeen: '2023-10-10',
    lastSeen: '2023-10-20',
  },
  {
    id: 'CVE-2023-9999',
    title: 'Buffer Overflow in Network Driver',
    severity: 'Medium',
    score: 6.2,
    asset: '192.168.1.50',
    source: 'Tenable',
    status: 'Fixed',
    firstSeen: '2023-10-05',
    lastSeen: '2023-10-18',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'error';
    case 'in progress':
      return 'warning';
    case 'fixed':
      return 'success';
    default:
      return 'default';
  }
};

const Vulnerabilities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: vulnerabilitiesData,
    isLoading,
    error,
    refetch,
  } = useQuery('vulnerabilities', async () => {
    // In a real application, this would fetch from the API
    return mockVulnerabilities;
  });

  const filteredVulnerabilities = (vulnerabilitiesData || []).filter((vuln) => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !severityFilter || vuln.severity === severityFilter;
    const matchesSource = !sourceFilter || vuln.source === sourceFilter;
    const matchesStatus = !statusFilter || vuln.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesSource && matchesStatus;
  });

  const vulnerabilityStats = {
    total: vulnerabilitiesData?.length || 0,
    critical: vulnerabilitiesData?.filter(v => v.severity === 'Critical').length || 0,
    high: vulnerabilitiesData?.filter(v => v.severity === 'High').length || 0,
    medium: vulnerabilitiesData?.filter(v => v.severity === 'Medium').length || 0,
    low: vulnerabilitiesData?.filter(v => v.severity === 'Low').length || 0,
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Vulnerabilities
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="primary">
                {vulnerabilityStats.total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="error">
                {vulnerabilityStats.critical}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Critical
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {vulnerabilityStats.high}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                High
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {vulnerabilityStats.medium}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Medium
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {vulnerabilityStats.low}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Low
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search vulnerabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  label="Severity"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  label="Source"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Tenable">Tenable</MenuItem>
                  <MenuItem value="ManageEngine">ManageEngine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Fixed">Fixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => refetch()}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vulnerabilities Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Vulnerability Details ({filteredVulnerabilities.length} results)
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load vulnerabilities. Please check your connection.
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>First Seen</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVulnerabilities.map((vuln) => (
                  <TableRow key={vuln.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {vuln.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vuln.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vuln.severity}
                        color={getSeverityColor(vuln.severity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {vuln.score}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vuln.asset}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vuln.source}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vuln.status}
                        color={getStatusColor(vuln.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {vuln.firstSeen}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Vulnerabilities;