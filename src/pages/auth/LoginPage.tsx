import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import FormField from '../../components/shared/FormField';
import Button from '../../components/shared/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  
  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    navigate(`/${role}`);
    return null;
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        toast.success('Login successful!');
        navigate(`/${role}`);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Forge IT LMS</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your learning dashboard</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.values(UserRole).map((userRole) => (
                <button
                  key={userRole}
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                    role === userRole
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  } transition-colors flex items-center justify-center gap-2`}
                  onClick={() => setRole(userRole)}
                >
                  <User className="h-4 w-4" />
                  <span className="capitalize">{userRole}</span>
                </button>
              ))}
            </div>
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              fullWidth
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              fullWidth
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={<LogIn className="h-4 w-4" />}
            fullWidth
          >
            Sign in
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 text-center">
            For demo purposes, use these credentials:
          </p>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p><span className="font-medium">Student:</span> student@example.com</p>
            <p><span className="font-medium">Teacher:</span> teacher@example.com</p>
            <p><span className="font-medium">Admin:</span> admin@example.com</p>
            <p><span className="font-medium">Password:</span> (any password will work for demo)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;