import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BookOpen, ChevronDown, LogOut, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import NotificationDropdown from '../shared/NotificationDropdown';

interface HeaderProps {
  role: UserRole;
}

const Header = ({ role }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const basePath = `/${role}`;

  return (
    <header className="bg-white h-[64px] border-b border-gray-200 fixed top-0 left-0 w-full z-10 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <Link to={basePath} className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="font-bold text-xl text-gray-800">Forge IT LMS</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </div>
          
          <div className="relative">
            <button
              className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                {user?.name.charAt(0)}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 animate-fade-in">
                <Link
                  to={`${basePath}/profile`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;