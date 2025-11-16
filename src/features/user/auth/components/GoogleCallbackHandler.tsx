import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../hooks/useAuth';
import { authAPI } from '../api/auth.api';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';
import { Spinner } from '../../../../components/ui/Spinner';

export default function GoogleCallbackHandler() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setStatus('loading');
        
        // Wait a moment for the backend to set the HTTP-only cookie
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user is authenticated after Google OAuth redirect
        const user = await authAPI.me();
        
        if (user) {
          login(user);
          setStatus('success');
          toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ''}!`);
          
          // Redirect to previous path or home
          const preOAuthPath = localStorage.getItem('preOAuthPath') || '/';
          localStorage.removeItem('preOAuthPath');
          
          setTimeout(() => {
            navigate(preOAuthPath, { replace: true });
          }, 1500);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        setStatus('error');
        toast.error('Google authentication failed. Please try again.');
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    handleGoogleCallback();
  }, [login, navigate]);

  const getContent = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Completing Google Sign In',
          description: 'Please wait while we authenticate your account...',
          icon: <Spinner size="lg" className="mx-auto" />
        };
      case 'success':
        return {
          title: 'Success!',
          description: 'You have been successfully signed in. Redirecting...',
          icon: <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        };
      case 'error':
        return {
          title: 'Authentication Failed',
          description: 'Google authentication failed. Redirecting to login...',
          icon: <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        };
      default:
        return {
          title: 'Processing...',
          description: 'Please wait...',
          icon: <Spinner size="lg" className="mx-auto" />
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {content.icon}
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription className="text-lg">
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">
              This may take a few seconds...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}