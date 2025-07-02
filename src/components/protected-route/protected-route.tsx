import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  if (isAuth) {
    return <>{children}</>;
  } else {
    if (isPublic) {
      return <>{children}</>;
    }
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
};
