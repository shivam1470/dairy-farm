'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Color palette for dairy farm theme
const colors = {
  primary: {
    main: '#2e7d32', // Forest green
    light: '#60ad5e',
    dark: '#005005',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff6f00', // Orange
    light: '#ffa040',
    dark: '#c43e00',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  error: {
    main: '#f44336',
    light: '#ef5350',
    dark: '#c62828',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
};

// Common theme options
const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? '#e2e8f0' : '#334155',
    action: {
      hover: mode === 'light' ? '#f1f5f9' : '#1e293b',
      selected: mode === 'light' ? '#e2e8f0' : '#334155',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: mode === 'light'
    ? [
        'none',
        '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14)',
        '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14)',
        '0px 1px 8px rgba(0, 0, 0, 0.12), 0px 3px 4px rgba(0, 0, 0, 0.14)',
        '0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14)',
        '0px 3px 5px -1px rgba(0, 0, 0, 0.12), 0px 5px 8px rgba(0, 0, 0, 0.14)',
        '0px 3px 5px -1px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14)',
        '0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 7px 10px 1px rgba(0, 0, 0, 0.14)',
        '0px 5px 5px -3px rgba(0, 0, 0, 0.12), 0px 8px 10px 1px rgba(0, 0, 0, 0.14)',
        '0px 5px 6px -3px rgba(0, 0, 0, 0.12), 0px 9px 12px 1px rgba(0, 0, 0, 0.14)',
        '0px 6px 6px -3px rgba(0, 0, 0, 0.12), 0px 10px 14px 1px rgba(0, 0, 0, 0.14)',
        '0px 6px 7px -4px rgba(0, 0, 0, 0.12), 0px 11px 15px 1px rgba(0, 0, 0, 0.14)',
        '0px 7px 8px -4px rgba(0, 0, 0, 0.12), 0px 12px 17px 2px rgba(0, 0, 0, 0.14)',
        '0px 7px 8px -4px rgba(0, 0, 0, 0.12), 0px 13px 19px 2px rgba(0, 0, 0, 0.14)',
        '0px 7px 9px -4px rgba(0, 0, 0, 0.12), 0px 14px 21px 2px rgba(0, 0, 0, 0.14)',
        '0px 8px 9px -5px rgba(0, 0, 0, 0.12), 0px 15px 22px 2px rgba(0, 0, 0, 0.14)',
        '0px 8px 10px -5px rgba(0, 0, 0, 0.12), 0px 16px 24px 2px rgba(0, 0, 0, 0.14)',
        '0px 8px 11px -5px rgba(0, 0, 0, 0.12), 0px 17px 26px 2px rgba(0, 0, 0, 0.14)',
        '0px 9px 11px -5px rgba(0, 0, 0, 0.12), 0px 18px 28px 2px rgba(0, 0, 0, 0.14)',
        '0px 9px 12px -6px rgba(0, 0, 0, 0.12), 0px 19px 29px 2px rgba(0, 0, 0, 0.14)',
        '0px 10px 13px -6px rgba(0, 0, 0, 0.12), 0px 20px 31px 3px rgba(0, 0, 0, 0.14)',
        '0px 10px 13px -6px rgba(0, 0, 0, 0.12), 0px 21px 33px 3px rgba(0, 0, 0, 0.14)',
        '0px 10px 14px -6px rgba(0, 0, 0, 0.12), 0px 22px 35px 3px rgba(0, 0, 0, 0.14)',
        '0px 11px 14px -7px rgba(0, 0, 0, 0.12), 0px 23px 36px 3px rgba(0, 0, 0, 0.14)',
        '0px 11px 15px -7px rgba(0, 0, 0, 0.12), 0px 24px 38px 3px rgba(0, 0, 0, 0.14)',
      ]
    : [
        'none',
        '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 1px rgba(0, 0, 0, 0.4)',
        '0px 1px 5px rgba(0, 0, 0, 0.3), 0px 2px 2px rgba(0, 0, 0, 0.4)',
        '0px 1px 8px rgba(0, 0, 0, 0.3), 0px 3px 4px rgba(0, 0, 0, 0.4)',
        '0px 2px 4px -1px rgba(0, 0, 0, 0.3), 0px 4px 5px rgba(0, 0, 0, 0.4)',
        '0px 3px 5px -1px rgba(0, 0, 0, 0.3), 0px 5px 8px rgba(0, 0, 0, 0.4)',
        '0px 3px 5px -1px rgba(0, 0, 0, 0.3), 0px 6px 10px rgba(0, 0, 0, 0.4)',
        '0px 4px 5px -2px rgba(0, 0, 0, 0.3), 0px 7px 10px 1px rgba(0, 0, 0, 0.4)',
        '0px 5px 5px -3px rgba(0, 0, 0, 0.3), 0px 8px 10px 1px rgba(0, 0, 0, 0.4)',
        '0px 5px 6px -3px rgba(0, 0, 0, 0.3), 0px 9px 12px 1px rgba(0, 0, 0, 0.4)',
        '0px 6px 6px -3px rgba(0, 0, 0, 0.3), 0px 10px 14px 1px rgba(0, 0, 0, 0.4)',
        '0px 6px 7px -4px rgba(0, 0, 0, 0.3), 0px 11px 15px 1px rgba(0, 0, 0, 0.4)',
        '0px 7px 8px -4px rgba(0, 0, 0, 0.3), 0px 12px 17px 2px rgba(0, 0, 0, 0.4)',
        '0px 7px 8px -4px rgba(0, 0, 0, 0.3), 0px 13px 19px 2px rgba(0, 0, 0, 0.4)',
        '0px 7px 9px -4px rgba(0, 0, 0, 0.3), 0px 14px 21px 2px rgba(0, 0, 0, 0.4)',
        '0px 8px 9px -5px rgba(0, 0, 0, 0.3), 0px 15px 22px 2px rgba(0, 0, 0, 0.4)',
        '0px 8px 10px -5px rgba(0, 0, 0, 0.3), 0px 16px 24px 2px rgba(0, 0, 0, 0.4)',
        '0px 8px 11px -5px rgba(0, 0, 0, 0.3), 0px 17px 26px 2px rgba(0, 0, 0, 0.4)',
        '0px 9px 11px -5px rgba(0, 0, 0, 0.3), 0px 18px 28px 2px rgba(0, 0, 0, 0.4)',
        '0px 9px 12px -6px rgba(0, 0, 0, 0.3), 0px 19px 29px 2px rgba(0, 0, 0, 0.4)',
        '0px 10px 13px -6px rgba(0, 0, 0, 0.3), 0px 20px 31px 3px rgba(0, 0, 0, 0.4)',
        '0px 10px 13px -6px rgba(0, 0, 0, 0.3), 0px 21px 33px 3px rgba(0, 0, 0, 0.4)',
        '0px 10px 14px -6px rgba(0, 0, 0, 0.3), 0px 22px 35px 3px rgba(0, 0, 0, 0.4)',
        '0px 11px 14px -7px rgba(0, 0, 0, 0.3), 0px 23px 36px 3px rgba(0, 0, 0, 0.4)',
        '0px 11px 15px -7px rgba(0, 0, 0, 0.3), 0px 24px 38px 3px rgba(0, 0, 0, 0.4)',
      ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'light' ? '#f1f1f1' : '#2d3748',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'light' ? '#c1c1c1' : '#4a5568',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: mode === 'light' ? '#a8a8a8' : '#718096',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 2px 4px rgba(0, 0, 0, 0.1)'
              : '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.12)'
            : '0px 1px 3px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.12)'
            : '0px 1px 3px rgba(0, 0, 0, 0.24)',
          border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.12)'
            : '0px 1px 3px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: mode === 'light'
              ? 'rgba(46, 125, 50, 0.08)'
              : 'rgba(96, 173, 94, 0.16)',
            '&:hover': {
              backgroundColor: mode === 'light'
                ? 'rgba(46, 125, 50, 0.12)'
                : 'rgba(96, 173, 94, 0.24)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
          color: mode === 'light' ? '#1e293b' : '#f1f5f9',
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.12)'
            : '0px 1px 3px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Create themes
export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));

// Default theme (can be changed by context)
export const theme = lightTheme;
