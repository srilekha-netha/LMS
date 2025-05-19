import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, DollarSign, Star, 
  BarChart2, TrendingUp, ChevronRight, 
  Clock, BookMarked
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import CourseCard from '../../components/shared/CourseCard';
import { UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses } from '../../data/mockData';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const courses = mockCourses.filter(course => course.instructorId === user?.id);
      setTeacherCourses(courses);
      
      // Calculate stats
      const totalStudents = courses.reduce((sum, course) => sum + course.totalStudents, 0);
      const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.totalStudents), 0);
      const ratings = courses.map(course => course.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;
      
      setStats({
        totalStudents,
        totalCourses: courses.length,
        totalRevenue,
        averageRating: avgRating,
      });
      
      setIsLoading(false);
    }, 1000);
  }, [user]);
  
  if (isLoading) {
    return (
      <AppLayout role={UserRole.TEACHER}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse-slow">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout role={UserRole.TEACHER}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-sm text-gray-600">Here's an overview of your teaching portfolio</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/teacher/courses/create"
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Create Course
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+12%</span> from last month
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
                <span className="text-success-600">+1</span> from last month
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
                <DollarSign className="h-5 w-5 text-green-600" />
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
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-md">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Based on student feedback</p>
            </div>
          </div>
        </div>

        {/* Course Enrollment Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Enrollment Trends</h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Enrollment chart would appear here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Trends</h2>
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

        {/* Your Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
            <Link
              to="/teacher/courses"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {teacherCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherCourses.slice(0, 3).map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  role={UserRole.TEACHER} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <BookMarked className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Create your first course and start teaching
              </p>
              <Link
                to="/teacher/courses/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Create a Course
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-blue-100 rounded-md mr-3">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New student enrolled</p>
                <p className="text-xs text-gray-600">A new student enrolled in Complete Web Development Masterclass</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-yellow-100 rounded-md mr-3">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New review received</p>
                <p className="text-xs text-gray-600">Your course received a 5-star rating</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-green-100 rounded-md mr-3">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Payment received</p>
                <p className="text-xs text-gray-600">You received a payment of ₹1,599</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-md">
              <div className="p-2 bg-primary-100 rounded-md mr-3">
                <Clock className="h-4 w-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Course reminder</p>
                <p className="text-xs text-gray-600">Time to update your "Data Science for Beginners" course</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeacherDashboard;