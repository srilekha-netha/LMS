import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, CreditCard, Activity,
  BarChart, ChevronRight, TrendingUp, Bell
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockUsers, mockCourses, mockPayments } from '../../data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
  });
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const totalUsers = mockUsers.filter(u => u.role === UserRole.STUDENT).length;
      const totalTeachers = mockUsers.filter(u => u.role === UserRole.TEACHER).length;
      const totalCourses = mockCourses.length;
      const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.finalAmount, 0);
      
      setStats({
        totalUsers,
        totalTeachers,
        totalCourses,
        totalRevenue,
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <AppLayout role={UserRole.ADMIN}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse-slow">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout role={UserRole.ADMIN}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your platform and monitor key metrics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+8%</span> from last month
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Teachers</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalTeachers}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+2</span> from last month
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="p-2 bg-primary-50 rounded-md">
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+5</span> from last month
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+15%</span> from last month
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Registrations</h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Registration chart would appear here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Revenue chart would appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === UserRole.ADMIN 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === UserRole.TEACHER
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary-600 hover:text-primary-900">Edit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Activities</h2>
          
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-blue-100 rounded-md mr-3">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New teacher registration</p>
                <p className="text-xs text-gray-600">A new teacher account requires approval</p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-primary-100 rounded-md mr-3">
                <BookOpen className="h-4 w-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New course published</p>
                <p className="text-xs text-gray-600">Advanced React Development has been published</p>
                <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-green-100 rounded-md mr-3">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Payment processed</p>
                <p className="text-xs text-gray-600">5 new payments have been processed</p>
                <p className="text-xs text-gray-500 mt-1">12 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-yellow-100 rounded-md mr-3">
                <Bell className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">System notification</p>
                <p className="text-xs text-gray-600">Database backup completed successfully</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;