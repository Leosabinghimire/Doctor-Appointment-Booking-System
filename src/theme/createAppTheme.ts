import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeMode } from '@/store/theme';
import { lightPalette, darkPalette, typography, shape, componentOverrides } from './tokens';

export const createAppTheme = (mode: ThemeMode): Theme =>
  createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape,
    components: componentOverrides,
  });

export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
