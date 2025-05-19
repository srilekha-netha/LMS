import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import CourseCard from '../../components/shared/CourseCard';
import Button from '../../components/shared/Button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

function TeacherCourses() {
  // This would typically fetch the teacher's courses from your API
  const courses = []; // Placeholder for course data

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <Link to="/teacher/courses/create">
            <Button variant="primary" className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Course
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses created yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating your first course and begin teaching today
            </p>
            <Link to="/teacher/courses/create">
              <Button variant="primary" className="flex items-center gap-2 mx-auto">
                <PlusCircle className="w-5 h-5" />
                Create Your First Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                actionButton={
                  <Link to={`/teacher/courses/${course.id}`}>
                    <Button variant="secondary" fullWidth>
                      Manage Course
                    </Button>
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TeacherCourses;