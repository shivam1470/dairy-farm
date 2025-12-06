'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import { Save, PhotoCamera, Notifications, Language, Lock, Business } from '@mui/icons-material';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your farm settings and preferences
      </Typography>

      {/* Profile Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Business color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={600}>
            Farm Profile
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#2e7d32' }}>F</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={600}>Farm Logo</Typography>
            <Button startIcon={<PhotoCamera />} size="small" sx={{ mt: 1 }}>
              Upload New Photo
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Farm Name" defaultValue="Green Valley Dairy Farm" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Owner Name" defaultValue="John Doe" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" type="email" defaultValue="john@greenvally.com" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone Number" defaultValue="+91-9876543210" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" multiline rows={2} defaultValue="123 Farm Road, Village, District, State" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<Save />}>
            Save Profile
          </Button>
        </Box>
      </Paper>

      {/* Notification Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Notifications color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={600}>
            Notification Preferences
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
              label="Enable Push Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />}
              label="Email Alerts for Important Events"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Daily Task Reminders"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Low Stock Alerts (Feed, Medicine)"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<Save />}>
            Save Preferences
          </Button>
        </Box>
      </Paper>

      {/* Security Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Lock color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={600}>
            Security Settings
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Current Password" type="password" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="New Password" type="password" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Confirm New Password" type="password" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="secondary">
            Change Password
          </Button>
        </Box>
      </Paper>

      {/* System Settings */}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Language color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={600}>
            System Settings
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Language" defaultValue="en" SelectProps={{ native: true }}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Currency" defaultValue="INR" SelectProps={{ native: true }}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Date Format" defaultValue="DD/MM/YYYY" SelectProps={{ native: true }}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<Save />}>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
