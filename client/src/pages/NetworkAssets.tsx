import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

const NetworkAssets: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Network Assets (Tenable)
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Alert severity="info">
                Network Assets page - Integration with Tenable API for network device management.
                This page will display discovered network assets, their vulnerability status, and scanning history.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkAssets;