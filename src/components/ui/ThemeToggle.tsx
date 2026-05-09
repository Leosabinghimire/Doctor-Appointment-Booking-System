import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode, useThemeStore } from '@/store/theme';

export const ThemeToggle = () => {
  const mode = useThemeMode();
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
      <IconButton
        onClick={toggle}
        aria-label="toggle theme"
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 2,
          width: 40,
          height: 40,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex' }}
          >
            {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </motion.div>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
};
