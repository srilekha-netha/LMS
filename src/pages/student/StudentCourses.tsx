import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import CourseCard from '../../components/shared/CourseCard';
import { UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses, mockEnrollments } from '../../data/mockData';
import Pagination from '../../components/shared/Pagination';

const StudentCourses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

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
      
      setEnrolledCourses(enrolledCoursesWithProgress);
      setFilteredCourses(enrolledCoursesWithProgress);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses(enrolledCourses);
    } else {
      const filtered = enrolledCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, enrolledCourses]);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-sm text-gray-600">Continue learning where you left off</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              defaultValue=""
            >
              <option value="">Sort by</option>
              <option value="recent">Recently Accessed</option>
              <option value="name">Course Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {currentCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  role={UserRole.STUDENT} 
                  progress={course.progress} 
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Search className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? `No courses match "${searchTerm}". Try using different keywords or browse all courses.`
                : "You haven't enrolled in any courses yet. Explore our catalog to find courses that interest you."}
            </p>
            <button
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              onClick={() => setSearchTerm('')}
            >
              {searchTerm ? 'Clear Search' : 'Explore Courses'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentCourses;