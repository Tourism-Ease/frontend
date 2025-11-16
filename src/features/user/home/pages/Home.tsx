import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { authAPI } from '../../auth/api/auth.api';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../hooks/useAuth';

export default function Home() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const googleSuccess = searchParams.get('google');
    if (googleSuccess === 'success') {
      const handleGoogleSuccess = async () => {
        try {
          const user = await authAPI.me();
          if (user) {
            login(user);
            toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ''}!`);
          }
        } catch (error) {
          console.error('Failed to fetch user after Google login:', error);
          toast.error('Failed to complete Google login. Please try again.');
        } finally {
          // Remove the query param
          searchParams.delete('google');
          setSearchParams(searchParams);
        }
      };

      handleGoogleSuccess();
    }
  }, [searchParams, setSearchParams, login]);

  return <></>;
}
