import { ReactNode } from 'react';
import { AppQueryProvider } from './AppQueryProvider';
import { AppThemeProvider } from './AppThemeProvider';
import { AppRouterProvider } from './AppRouterProvider';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => (
  <ErrorBoundary>
    <AppQueryProvider>
      <AppThemeProvider>
        <AppRouterProvider>{children}</AppRouterProvider>
      </AppThemeProvider>
    </AppQueryProvider>
  </ErrorBoundary>
);
