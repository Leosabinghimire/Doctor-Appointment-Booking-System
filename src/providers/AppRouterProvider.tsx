import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export const AppRouterProvider = ({ children }: Props) => (
  <BrowserRouter>{children}</BrowserRouter>
);
