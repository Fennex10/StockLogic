import { useAuthStore } from '@/auth/store/auth.store';
import type { RoleCode } from '@/auth/type/roleCode';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

interface RoleRouteProps extends PropsWithChildren {
  role: RoleCode;
}


export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === 'checking') return null;

  if (authStatus === 'authenticated') return <Navigate to="/dashboard" />;

  return children;
};

// export const AdminRoute = ({ children }: PropsWithChildren) => {
//   const { authStatus, isAdmin } = useAuthStore();

//   if (authStatus === 'checking') return null;

//   if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;

//   if (!isAdmin()) return <Navigate to="/" />;

//   return children;
// };

export const RoleRoute = ({ role, children }: RoleRouteProps) => {
  const { authStatus, hasRole } = useAuthStore();

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated")
    return <Navigate to="/auth/login" />;

  if (!hasRole(role)) return <Navigate to="/dashboard" />;

  return children;
};