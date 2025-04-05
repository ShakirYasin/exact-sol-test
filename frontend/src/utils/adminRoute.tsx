import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAdminRoute(WrappedComponent: React.ComponentType) {
  return function AdminRoute(props: React.ComponentProps<typeof WrappedComponent>) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (user && user.role !== 'admin') {
        router.push('/dashboard');
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user || user.role !== 'admin') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 