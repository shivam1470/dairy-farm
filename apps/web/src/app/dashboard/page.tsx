'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Pets,
  Opacity,
  AttachMoney,
  People,
  LocalShipping,
  Restaurant,
  MedicalServices,
  Settings,
  Menu as MenuIcon,
  Notifications,
  Logout,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Animals', icon: <Pets />, path: '/animals' },
  { text: 'Milk Records', icon: <Opacity />, path: '/milk-records' },
  { text: 'Expenses', icon: <AttachMoney />, path: '/expenses' },
  { text: 'Workers', icon: <People />, path: '/workers' },
  { text: 'Deliveries', icon: <LocalShipping />, path: '/deliveries' },
  { text: 'Feeding', icon: <Restaurant />, path: '/feeding' },
  { text: 'Vet Visits', icon: <MedicalServices />, path: '/vet' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const stats = [
  { title: 'Total Animals', value: '124', change: '+5', trend: 'up', color: '#2e7d32' },
  { title: "Today's Milk (L)", value: '850', change: '+12%', trend: 'up', color: '#1976d2' },
  { title: "Today's Expenses", value: '₹4,250', change: '-8%', trend: 'down', color: '#ed6c02' },
  { title: 'Workers Present', value: '18/20', change: '90%', trend: 'up', color: '#9c27b0' },
  { title: 'Deliveries Done', value: '12', change: '+2', trend: 'up', color: '#0288d1' },
  { title: 'Feeding Status', value: '98%', change: 'On Time', trend: 'up', color: '#388e3c' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!user) return null;

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight={700}>
          🐄 Dairy Farm
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => router.push(item.path)}
            selected={item.path === '/dashboard'}
          >
            <ListItemIcon sx={{ color: item.path === '/dashboard' ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.name.charAt(0)}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Typography variant="body2">{user.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => router.push('/settings')}>
              <Settings fontSize="small" sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Here's what's happening with your farm today
          </Typography>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', borderLeft: 4, borderColor: stat.color }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {stat.trend === 'up' ? (
                            <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 20, color: 'error.main' }} />
                          )}
                          <Typography
                            variant="body2"
                            sx={{ color: stat.trend === 'up' ? 'success.main' : 'error.main' }}
                          >
                            {stat.change}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Milk Production Trend (Last 7 Days)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <Typography color="text.secondary">Chart will be rendered here</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Expense Breakdown
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <Typography color="text.secondary">Pie chart will be rendered here</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
