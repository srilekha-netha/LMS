import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Layers, ChevronRight, Award, 
  BarChart, BookMarked
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import CourseCard from '../../components/shared/CourseCard';
import { UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses, mockEnrollments } from '../../data/mockData';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get data
    setTimeout(() => {
      // Get courses the student is enrolled in
      const userEnrollments = mockEnrollments.filter(enrollment => 
        enrollment.userId === user?.id
      );
      
      const enrolledCoursesWithProgress = userEnrollments.map(enrollment => {
        const course = mockCourses.find(c => c.id === enrollment.courseId);
        return {
          ...course,
          progress: enrollment.progress,
        };
      }).filter(Boolean);
      
      // Get recommended courses (those not enrolled in)
      const enrolledIds = userEnrollments.map(e => e.courseId);
      const recommended = mockCourses
        .filter(course => !enrolledIds.includes(course.id))
        .slice(0, 3);
      
      setEnrolledCourses(enrolledCoursesWithProgress);
      setRecommendedCourses(recommended);
      setRecentActivity([
        { type: 'quiz', title: 'HTML Basics Quiz', score: '90%', date: '2 days ago' },
        { type: 'course', title: 'Completed Chapter 1: Introduction to Web Development', date: '3 days ago' },
        { type: 'enrollment', title: 'Enrolled in Data Science for Beginners', date: '1 week ago' },
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [user]);

  if (isLoading) {
    return (
      <AppLayout role={UserRole.STUDENT}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse-slow">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role={UserRole.STUDENT}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-sm text-gray-600">Here's your learning summary and updates</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/student/courses"
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              My Courses
            </Link>
            <Link
              to="/student/explore"
              className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Courses Enrolled</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
              </div>
              <div className="p-2 bg-primary-50 rounded-md">
                <BookOpen className="h-5 w-5 text-primary-600" />
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
                <p className="text-sm font-medium text-gray-500">Quizzes Completed</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">5</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <Layers className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+3</span> from last month
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Learning Hours</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">12h</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-md">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+4h</span> from last week
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">0</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Complete courses to earn certificates</p>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
            <Link
              to="/student/courses"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.slice(0, 3).map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  role={UserRole.STUDENT} 
                  progress={course.progress} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <BookMarked className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Explore our catalog and start your learning journey
              </p>
              <Link
                to="/student/explore"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Courses Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            <Link
              to="/student/explore"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                role={UserRole.STUDENT} 
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                <div className={`p-2 rounded-md mr-3 ${
                  activity.type === 'quiz' ? 'bg-yellow-100' :
                  activity.type === 'course' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'quiz' ? (
                    <Layers className={`h-4 w-4 text-yellow-600`} />
                  ) : activity.type === 'course' ? (
                    <BookOpen className={`h-4 w-4 text-green-600`} />
                  ) : (
                    <BarChart className={`h-4 w-4 text-blue-600`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                  {activity.score && (
                    <p className="text-xs text-gray-600">Score: {activity.score}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;