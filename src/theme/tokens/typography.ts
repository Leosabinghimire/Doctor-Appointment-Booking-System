import type { TypographyVariantsOptions } from '@mui/material/styles';

const fontFamily = `'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const displayFont = `'Plus Jakarta Sans', ${fontFamily}`;

export const typography: TypographyVariantsOptions = {
  fontFamily,
  h1: { fontFamily: displayFont, fontWeight: 800, letterSpacing: '-0.02em' },
  h2: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '-0.01em' },
  h4: { fontFamily: displayFont, fontWeight: 700, fontSize: '1.6rem' },
  h5: { fontFamily: displayFont, fontWeight: 700, fontSize: '1.25rem' },
  h6: { fontFamily: displayFont, fontWeight: 700, fontSize: '1.05rem' },
  subtitle1: { fontWeight: 600 },
  subtitle2: { fontWeight: 600 },
  button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
};
