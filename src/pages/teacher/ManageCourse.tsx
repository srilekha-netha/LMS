import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Users, Star, Clock, 
  Plus, Trash, Edit, ChevronUp, ChevronDown,
  PlayCircle, FileText, Award, Settings
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/shared/Button';
import { UserRole, Course, Chapter } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses } from '../../data/mockData';
import toast from 'react-hot-toast';

const ManageCourse = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'students' | 'settings'>('content');
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to get course details
    setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse && foundCourse.instructorId === user?.id) {
        setCourse(foundCourse);
      }
      setIsLoading(false);
    }, 1000);
  }, [courseId, user]);

  const handleChapterExpand = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleAddChapter = () => {
    if (!course) return;

    // In a real app, this would be an API call
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: 'New Chapter',
      description: 'Chapter description goes here',
      courseId: course.id,
      order: course.chapters.length + 1,
      isLocked: true,
      content: [],
    };

    const updatedCourse = {
      ...course,
      chapters: [...course.chapters, newChapter],
    };

    setCourse(updatedCourse);
    setExpandedChapter(newChapter.id);
    toast.success('Chapter added successfully');
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!course) return;

    const updatedChapters = course.chapters.filter(ch => ch.id !== chapterId);
    const updatedCourse = {
      ...course,
      chapters: updatedChapters,
    };

    setCourse(updatedCourse);
    toast.success('Chapter deleted successfully');
  };

  const handleAddContent = (chapterId: string) => {
    if (!course) return;

    const updatedChapters = course.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          content: [
            ...chapter.content,
            {
              id: `content-${Date.now()}`,
              title: 'New Content',
              type: 'video',
              url: '',
              duration: 0,
              chapterId: chapter.id,
              order: chapter.content.length + 1,
            },
          ],
        };
      }
      return chapter;
    });

    setCourse({
      ...course,
      chapters: updatedChapters,
    });

    toast.success('Content added successfully');
  };

  const handleDeleteContent = (chapterId: string, contentId: string) => {
    if (!course) return;

    const updatedChapters = course.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          content: chapter.content.filter(content => content.id !== contentId),
        };
      }
      return chapter;
    });

    setCourse({
      ...course,
      chapters: updatedChapters,
    });

    toast.success('Content deleted successfully');
  };

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

  if (!course) {
    return (
      <AppLayout role={UserRole.TEACHER}>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have permission to manage it.</p>
          <Link 
            to="/teacher/courses" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Courses
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role={UserRole.TEACHER}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">Manage your course content and settings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to={`/teacher/courses/${course.id}/preview`}
              className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Preview Course
            </Link>
            <Button
              variant="primary"
              onClick={() => toast.success('Course published successfully')}
            >
              Publish Changes
            </Button>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{course.totalStudents}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="text-success-600">+5</span> this week
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Chapters</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{course.chapters.length}</p>
              </div>
              <div className="p-2 bg-primary-50 rounded-md">
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Last updated {new Date(course.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{course.rating.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-md">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">From {course.totalStudents} reviews</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Duration</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{course.duration}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Across all chapters</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Course Content
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Course Chapters</h2>
              <Button
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleAddChapter}
              >
                Add Chapter
              </Button>
            </div>
            
            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <div 
                  key={chapter.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => handleChapterExpand(chapter.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        className="p-1 hover:bg-gray-100 rounded-full mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(chapter.id);
                        }}
                      >
                        <Trash className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded-full mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit chapter logic
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      {expandedChapter === chapter.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedChapter === chapter.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus className="h-4 w-4" />}
                          onClick={() => handleAddContent(chapter.id)}
                        >
                          Add Content
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {chapter.content.map((content, contentIndex) => (
                          <div 
                            key={content.id}
                            className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                          >
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-md mr-3">
                                {content.type === 'video' ? (
                                  <PlayCircle className="h-4 w-4 text-primary-600" />
                                ) : (
                                  <FileText className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{content.title}</h4>
                                {content.duration && (
                                  <p className="text-xs text-gray-500">{content.duration} minutes</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full mr-2"
                                onClick={() => handleDeleteContent(chapter.id, content.id)}
                              >
                                <Trash className="h-4 w-4 text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onClick={() => {
                                  // Edit content logic
                                }}
                              >
                                <Edit className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {chapter.quiz && (
                          <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center">
                              <div className="p-2 bg-yellow-100 rounded-md mr-3">
                                <Award className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{chapter.quiz.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {chapter.quiz.questions.length} questions • Passing score: {chapter.quiz.passingScore}%
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onClick={() => {
                                  // Edit quiz logic
                                }}
                              >
                                <Edit className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Enrolled Students</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Mock student data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                          JS
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">John Smith</div>
                          <div className="text-sm text-gray-500">john@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">60%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Jan 15, 2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 days ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">View Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Course Settings</h2>
                  <p className="text-sm text-gray-600">Update your course details and preferences</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-md">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Visibility
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Progression
                  </label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="sequential"
                        name="progression"
                        type="radio"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="sequential" className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">Sequential</span>
                        <span className="block text-sm text-gray-500">Students must complete chapters in order</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="flexible"
                        name="progression"
                        type="radio"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="flexible" className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">Flexible</span>
                        <span className="block text-sm text-gray-500">Students can access any chapter at any time</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Settings
                  </label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="enable-certificate"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enable-certificate" className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">Enable Course Certificate</span>
                        <span className="block text-sm text-gray-500">Students receive a certificate upon completion</span>
                      </label>
                    </div>
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Completion Percentage
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>80%</option>
                        <option>85%</option>
                        <option>90%</option>
                        <option>95%</option>
                        <option>100%</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Archive Course</h3>
                    <p className="text-sm text-gray-500">Hide this course from the course listing</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Archive
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Delete Course</h3>
                    <p className="text-sm text-gray-500">Permanently delete this course and all its data</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-error-600 hover:bg-error-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageCourse;