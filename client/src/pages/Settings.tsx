import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  TestTube as TestIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [tenableConfig, setTenableConfig] = useState({
    accessKey: '',
    secretKey: '',
    baseUrl: 'https://cloud.tenable.com',
    refreshInterval: 15,
  });

  const [manageEngineConfig, setManageEngineConfig] = useState({
    apiKey: '',
    baseUrl: '',
    refreshInterval: 10,
  });

  const [showTenableSecrets, setShowTenableSecrets] = useState({
    accessKey: false,
    secretKey: false,
  });

  const [showManageEngineSecret, setShowManageEngineSecret] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    tenable: 'Unknown',
    manageEngine: 'Unknown',
  });

  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleTenableConfigChange = (field: string, value: string | number) => {
    setTenableConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleManageEngineConfigChange = (field: string, value: string | number) => {
    setManageEngineConfig(prev => ({ ...prev, [field]: value }));
  };

  const testTenableConnection = async () => {
    // Simulate API test
    setConnectionStatus(prev => ({ ...prev, tenable: 'Testing...' }));
    setTimeout(() => {
      setConnectionStatus(prev => ({ 
        ...prev, 
        tenable: tenableConfig.accessKey ? 'Connected' : 'Failed' 
      }));
    }, 2000);
  };

  const testManageEngineConnection = async () => {
    // Simulate API test
    setConnectionStatus(prev => ({ ...prev, manageEngine: 'Testing...' }));
    setTimeout(() => {
      setConnectionStatus(prev => ({ 
        ...prev, 
        manageEngine: manageEngineConfig.apiKey ? 'Connected' : 'Failed' 
      }));
    }, 2000);
  };

  const saveConfiguration = () => {
    // Simulate saving configuration
    setSaveStatus({ type: 'success', message: 'Configuration saved successfully!' });
    setTimeout(() => {
      setSaveStatus({ type: null, message: '' });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'success';
      case 'Failed':
        return 'error';
      case 'Testing...':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Settings
      </Typography>

      {saveStatus.type && (
        <Alert severity={saveStatus.type} sx={{ mb: 3 }}>
          {saveStatus.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Tenable Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Tenable Configuration
                </Typography>
                <Chip
                  label={connectionStatus.tenable}
                  color={getStatusColor(connectionStatus.tenable) as any}
                  size="small"
                />
              </Box>
              
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Access Key"
                  type={showTenableSecrets.accessKey ? 'text' : 'password'}
                  value={tenableConfig.accessKey}
                  onChange={(e) => handleTenableConfigChange('accessKey', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowTenableSecrets(prev => ({
                            ...prev,
                            accessKey: !prev.accessKey
                          }))}
                          edge="end"
                        >
                          {showTenableSecrets.accessKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Secret Key"
                  type={showTenableSecrets.secretKey ? 'text' : 'password'}
                  value={tenableConfig.secretKey}
                  onChange={(e) => handleTenableConfigChange('secretKey', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowTenableSecrets(prev => ({
                            ...prev,
                            secretKey: !prev.secretKey
                          }))}
                          edge="end"
                        >
                          {showTenableSecrets.secretKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Base URL"
                  value={tenableConfig.baseUrl}
                  onChange={(e) => handleTenableConfigChange('baseUrl', e.target.value)}
                  margin="normal"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Refresh Interval (minutes)"
                  type="number"
                  value={tenableConfig.refreshInterval}
                  onChange={(e) => handleTenableConfigChange('refreshInterval', parseInt(e.target.value))}
                  margin="normal"
                />
              </Box>

              <Button
                variant="outlined"
                startIcon={<TestIcon />}
                onClick={testTenableConnection}
                fullWidth
                disabled={connectionStatus.tenable === 'Testing...'}
              >
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ManageEngine Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  ManageEngine Configuration
                </Typography>
                <Chip
                  label={connectionStatus.manageEngine}
                  color={getStatusColor(connectionStatus.manageEngine) as any}
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="API Key"
                  type={showManageEngineSecret ? 'text' : 'password'}
                  value={manageEngineConfig.apiKey}
                  onChange={(e) => handleManageEngineConfigChange('apiKey', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowManageEngineSecret(!showManageEngineSecret)}
                          edge="end"
                        >
                          {showManageEngineSecret ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Base URL"
                  placeholder="https://your-instance.manageengine.com"
                  value={manageEngineConfig.baseUrl}
                  onChange={(e) => handleManageEngineConfigChange('baseUrl', e.target.value)}
                  margin="normal"
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Refresh Interval (minutes)"
                  type="number"
                  value={manageEngineConfig.refreshInterval}
                  onChange={(e) => handleManageEngineConfigChange('refreshInterval', parseInt(e.target.value))}
                  margin="normal"
                />
              </Box>

              <Button
                variant="outlined"
                startIcon={<TestIcon />}
                onClick={testManageEngineConnection}
                fullWidth
                disabled={connectionStatus.manageEngine === 'Testing...'}
              >
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* General Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                General Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable Real-time Updates"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Dark Mode"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-refresh Dashboard"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveConfiguration}
              size="large"
            >
              Save Configuration
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;