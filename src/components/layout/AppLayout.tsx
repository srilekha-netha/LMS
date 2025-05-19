import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { UserRole } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const AppLayout = ({ children, role }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={role} />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 ml-sidebar content-height overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;