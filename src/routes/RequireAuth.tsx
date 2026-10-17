import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useCurrentUser, useIsAuthenticated } from '@/store/auth';
import type { UserRole } from '@/types';

/** Sends signed-out visitors to the login page, remembering where they were going. */
export const RequireAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

interface RequireRoleProps {
  roles: UserRole[];
  children?: ReactNode;
}

/** Sends users without the right role to their own home page. The backend enforces the same rules. */
export const RequireRole = ({ roles, children }: RequireRoleProps) => {
  const user = useCurrentUser();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={user?.role === 'admin' ? ROUTES.admin : ROUTES.dashboard} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};
