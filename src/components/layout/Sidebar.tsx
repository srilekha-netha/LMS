import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, Book, BookOpen, CreditCard, 
  Home, LayoutGrid, Users, PlusCircle, Settings
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  role: UserRole;
}

interface NavItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

const Sidebar = ({ role }: SidebarProps) => {
  const { user } = useAuth();
  
  const navItems = useMemo(() => {
    const items: Record<UserRole, NavItem[]> = {
      [UserRole.STUDENT]: [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/student' },
        { icon: <BookOpen className="w-5 h-5" />, label: 'My Courses', path: '/student/courses' },
        { icon: <LayoutGrid className="w-5 h-5" />, label: 'Explore Courses', path: '/student/explore' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Payments', path: '/student/payments' },
      ],
      [UserRole.TEACHER]: [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/teacher' },
        { icon: <Book className="w-5 h-5" />, label: 'My Courses', path: '/teacher/courses' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Create Course', path: '/teacher/courses/create' },
        { icon: <Users className="w-5 h-5" />, label: 'Students', path: '/teacher/students' },
      ],
      [UserRole.ADMIN]: [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
        { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
        { icon: <BookOpen className="w-5 h-5" />, label: 'Courses', path: '/admin/courses' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Payments', path: '/admin/payments' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Reports', path: '/admin/reports' },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
      ],
    };

    return items[role] || [];
  }, [role]);

  return (
    <aside className="w-sidebar bg-white border-r border-gray-200 fixed left-0 top-[64px] h-screen-minus-header overflow-y-auto z-10 shadow-sm">
      <nav className="p-4">
        <div className="mb-6">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-2">
              {user?.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
        
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;