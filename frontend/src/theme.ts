import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#2563eb',
              light: '#60a5fa',
              dark: '#1d4ed8',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#7c3aed',
              light: '#a78bfa',
              dark: '#5b21b6',
              contrastText: '#ffffff',
            },
            success: {
              main: '#10b981',
              light: '#6ee7b7',
              dark: '#047857',
              contrastText: '#ffffff',
            },
            warning: {
              main: '#f59e0b',
              light: '#fbbf24',
              dark: '#d97706',
              contrastText: '#ffffff',
            },
            error: {
              main: '#ef4444',
              light: '#f87171',
              dark: '#dc2626',
              contrastText: '#ffffff',
            },
            info: {
              main: '#06b6d4',
              light: '#67e8f9',
              dark: '#0891b2',
              contrastText: '#ffffff',
            },
            background: {
              default: '#fafbfc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1f2937',
              secondary: '#6b7280',
              disabled: '#9ca3af',
            },
            divider: '#e5e7eb',
            action: {
              hover: 'rgba(37, 99, 235, 0.04)',
              selected: 'rgba(37, 99, 235, 0.08)',
            },
          }
        : {
            primary: {
              main: '#60a5fa',
              light: '#93c5fd',
              dark: '#3b82f6',
              contrastText: '#0f172a',
            },
            secondary: {
              main: '#a78bfa',
              light: '#c4b5fd',
              dark: '#8b5cf6',
              contrastText: '#0f172a',
            },
            success: {
              main: '#34d399',
              light: '#6ee7b7',
              dark: '#10b981',
              contrastText: '#0f172a',
            },
            warning: {
              main: '#fbbf24',
              light: '#fcd34d',
              dark: '#f59e0b',
              contrastText: '#0f172a',
            },
            error: {
              main: '#f87171',
              light: '#fca5a5',
              dark: '#ef4444',
              contrastText: '#0f172a',
            },
            info: {
              main: '#67e8f9',
              light: '#a7f3d0',
              dark: '#06b6d4',
              contrastText: '#0f172a',
            },
            background: {
              default: '#0f172a',
              paper: '#1e293b',
            },
            text: {
              primary: '#f8fafc',
              secondary: '#cbd5e1',
              disabled: '#64748b',
            },
            divider: '#334155',
            action: {
              hover: 'rgba(96, 165, 250, 0.08)',
              selected: 'rgba(96, 165, 250, 0.12)',
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { 
        fontSize: '3rem', 
        fontWeight: 800, 
        lineHeight: 1.1,
        letterSpacing: '-0.025em',
      },
      h2: { 
        fontSize: '2.25rem', 
        fontWeight: 700, 
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h3: { 
        fontSize: '1.875rem', 
        fontWeight: 700, 
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
      },
      h4: { 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h5: { 
        fontSize: '1.25rem', 
        fontWeight: 600, 
        lineHeight: 1.35,
      },
      h6: { 
        fontSize: '1.125rem', 
        fontWeight: 600, 
        lineHeight: 1.4,
      },
      body1: { 
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      body2: { 
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 500,
        letterSpacing: '0.025em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: mode === 'dark' 
      ? [
          'none',
          '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
          '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
          '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
          '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)',
          '0 24px 48px rgba(0, 0, 0, 0.35), 0 19px 15px rgba(0, 0, 0, 0.22)'
        ]
      : [
          'none',
          '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
          '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
          },
          body: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
            backgroundColor: mode === 'dark' ? '#0f172a' : '#fafbfc',
            backgroundImage: mode === 'dark' 
              ? 'radial-gradient(circle at 25% 25%, rgba(96, 165, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
            color: mode === 'dark' ? '#f8fafc' : '#1f2937',
          },
          '#root': {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '10px 20px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'dark' 
                ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                : '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          },
          contained: {
            boxShadow: mode === 'dark' 
              ? '0 4px 14px rgba(0, 0, 0, 0.3)' 
              : '0 4px 14px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 6px 20px rgba(0, 0, 0, 0.4)' 
                : '0 6px 20px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: mode === 'dark' ? '1px solid rgba(51, 65, 85, 0.8)' : '1px solid rgba(229, 231, 235, 0.8)',
            boxShadow: mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            background: mode === 'dark' 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'dark'
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: mode === 'dark' ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: 'none',
            color: mode === 'dark' ? '#f8fafc' : '#1f2937',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            background: mode === 'dark' 
              ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(10px)',
            color: mode === 'dark' ? '#f8fafc' : '#1f2937',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          },
          elevation1: {
            boxShadow: mode === 'dark'
              ? '0 1px 3px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
            padding: '16px',
          },
          head: {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(42, 57, 82, 0.8) 0%, rgba(51, 65, 85, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.4) 100%)',
            color: mode === 'dark' ? '#60a5fa' : '#2563eb',
            fontWeight: 700,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& > fieldset': {
                  borderColor: mode === 'dark' ? '#60a5fa' : '#2563eb',
                },
              },
              '&.Mui-focused': {
                '& > fieldset': {
                  borderWidth: '2px',
                  borderColor: mode === 'dark' ? '#60a5fa' : '#2563eb',
                },
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.75rem',
            '&.MuiChip-filled': {
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(167, 139, 250, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%)',
              color: '#ffffff',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase': {
              '&.Mui-checked': {
                '& + .MuiSwitch-track': {
                  background: mode === 'dark' 
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                },
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: mode === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)',
          },
          bar: {
            borderRadius: 4,
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
          },
        },
      },
    },
  });