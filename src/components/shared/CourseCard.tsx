import { BookOpen, Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course, UserRole } from '../../types';

interface CourseCardProps {
  course: Course;
  role: UserRole;
  progress?: number;
}

const CourseCard = ({ course, role, progress }: CourseCardProps) => {
  const {
    id,
    title,
    instructorName,
    thumbnail,
    price,
    level,
    duration,
    rating,
    totalStudents,
  } = course;

  const basePath = role === UserRole.STUDENT ? '/student' : 
                  role === UserRole.TEACHER ? '/teacher' : '/admin';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`${basePath}/courses/${id}`} className="block">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 px-3 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-medium">Progress</span>
                <span className="text-white text-xs font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center text-xs mb-2">
          <span className={`
            px-2 py-1 rounded-full font-medium
            ${level === 'Beginner' ? 'bg-green-100 text-green-800' : 
              level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {level}
          </span>
        </div>
        
        <Link to={`${basePath}/courses/${id}`} className="block">
          <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mt-1">by {instructorName}</p>
        
        <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3">
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1" />
            <span>{totalStudents}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {price > 0 ? `₹${price.toLocaleString()}` : 'Free'}
          </div>
          <Link
            to={`${basePath}/courses/${id}`}
            className="px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
          >
            {role === UserRole.STUDENT ? (progress !== undefined ? 'Continue' : 'Enroll Now') : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;