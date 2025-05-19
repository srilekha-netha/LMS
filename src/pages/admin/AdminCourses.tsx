import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import CourseCard from '../../components/shared/CourseCard';
import Pagination from '../../components/shared/Pagination';
import { Search, Filter } from 'lucide-react';

function AdminCourses() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          
          <div className="flex space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Filter Button */}
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Course Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Courses', value: '156' },
            { label: 'Active Courses', value: '124' },
            { label: 'Pending Review', value: '18' },
            { label: 'Inactive Courses', value: '14' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCard key={index} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Pagination />
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminCourses;