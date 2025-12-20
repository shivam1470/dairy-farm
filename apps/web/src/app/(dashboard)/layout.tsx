'use client';

import React, { useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useLayoutStore } from '@/store/layoutStore';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = React.memo(({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const { toggleSidebar, closeSidebar } = useLayoutStore();

  // Auto-close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [pathname, isMobile, closeSidebar]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* App Bar */}
        {/* <AppBar
          position="sticky"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                mr: 2,
                ...(isMobile ? {} : { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dairy Farm Management
            </Typography>
          </Toolbar>
        </AppBar> */}

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.default,
            minHeight: 'calc(100vh - 64px)', // Account for AppBar height
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;