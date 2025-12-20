'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dashboard,
  Pets,
  Opacity,
  AttachMoney,
  People,
  Assignment,
  LocalShipping,
  Restaurant,
  MedicalServices,
  Settings,
} from '@mui/icons-material';
import { menuItems } from '@/lib/navigation';
import { useLayoutStore } from '@/store/layoutStore';

const DRAWER_WIDTH = 280; // Slightly wider for better UX

const Sidebar: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useLayoutStore();

  const handleItemClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Dashboard,
      Pets,
      Opacity,
      AttachMoney,
      People,
      Assignment,
      LocalShipping,
      Restaurant,
      MedicalServices,
      Settings,
    };

    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent sx={{ fontSize: 24 }} /> : null;
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Dairy Farm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Management System
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleItemClick}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '10',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '20',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Dairy Farm
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? sidebarOpen : true}
      onClose={closeSidebar}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;