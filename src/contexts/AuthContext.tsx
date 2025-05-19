import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('forgeUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('forgeUser');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API call with mock data
      const foundUser = mockUsers.find(u => u.email === email && u.role === role);
      
      if (foundUser) {
        // In a real app, you would verify password here
        setUser(foundUser);
        localStorage.setItem('forgeUser', JSON.stringify(foundUser));

        // Redirect to the appropriate dashboard
        const dashboardRoute = `/${foundUser.role}`;
        navigate(dashboardRoute);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const userExists = mockUsers.some(u => u.email === email);
      if (userExists) {
        return false;
      }

      // Create a new user (in a real app, this would be an API call)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: UserRole.STUDENT, // New users are students by default
      };

      // In a real app, you would send this to the server
      // For now, we'll just add it to our mock data for the session
      mockUsers.push(newUser);
      
      // Automatically log in the new user
      setUser(newUser);
      localStorage.setItem('forgeUser', JSON.stringify(newUser));
      
      // Redirect to student dashboard
      navigate('/student');
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forgeUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitialized,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};