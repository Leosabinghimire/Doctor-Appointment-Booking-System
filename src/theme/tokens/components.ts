import { alpha, type Components, type Theme } from '@mui/material/styles';

export const componentOverrides: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: (themeParam) => ({
      '*::-webkit-scrollbar': { width: 8, height: 8 },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': {
        background: alpha(themeParam.palette.text.secondary, 0.25),
        borderRadius: 8,
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: alpha(themeParam.palette.text.secondary, 0.4),
      },
      body: { backgroundColor: themeParam.palette.background.default },
    }),
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 16,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        transition: 'border-color .2s ease, box-shadow .2s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.text.primary, 0.18),
        },
      }),
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 10, paddingInline: 18, paddingBlock: 9, fontWeight: 600 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 600 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'small' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: 12 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600 },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        background: theme.palette.text.primary,
        color: theme.palette.background.paper,
        borderRadius: 8,
        fontSize: 12,
        padding: '6px 10px',
      }),
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { fontWeight: 600 },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'transparent' },
  },
};
