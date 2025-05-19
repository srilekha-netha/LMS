import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Users, Award, BookOpen, CheckCircle, Clock as LockClosed, PlayCircle, Calendar, CreditCard } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/shared/Button';
import { UserRole, Course, Chapter, Enrollment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses, mockEnrollments } from '../../data/mockData';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    // Simulate API call to get course details
    setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        setFinalPrice(foundCourse.price);
        
        // Check if user is enrolled
        const userEnrollment = mockEnrollments.find(e => 
          e.userId === user?.id && e.courseId === courseId
        );
        setEnrollment(userEnrollment || null);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [courseId, user]);

  const handleEnroll = () => {
    if (!course) return;
    
    if (course.price > 0) {
      setShowPaymentModal(true);
    } else {
      // For free courses, enroll immediately
      handleEnrollCompletion();
    }
  };

  const handleEnrollCompletion = () => {
    // In a real app, this would be an API call to create an enrollment
    toast.success('Enrolled successfully!');
    
    // Create a mock enrollment for the session
    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      userId: user?.id || '',
      courseId: course?.id || '',
      progress: 0,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completedChapters: [],
    };
    
    // Add to mock data for this session
    mockEnrollments.push(newEnrollment);
    setEnrollment(newEnrollment);
    setShowPaymentModal(false);
  };

  const applyCoupon = () => {
    if (!couponCode.trim() || !course) return;
    
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'WELCOME20') {
      const discount = Math.floor(course.price * 0.2);
      setDiscountAmount(discount);
      setFinalPrice(course.price - discount);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
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

  if (!course) {
    return (
      <AppLayout role={UserRole.STUDENT}>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/student/courses" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Courses
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role={UserRole.STUDENT}>
      <div className="space-y-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-600">
              by <span className="font-medium">{course.instructorName}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="p-5">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
                    <span className="text-sm text-gray-700">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1.5" />
                    <span className="text-sm text-gray-700">{course.rating.toFixed(1)} Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1.5" />
                    <span className="text-sm text-gray-700">{course.totalStudents} Students</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-gray-500 mr-1.5" />
                    <span className="text-sm text-gray-700">{course.level}</span>
                  </div>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About this course</h2>
                <p className="text-gray-700 mb-4">{course.description}</p>
                
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">What you'll learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Build responsive websites with HTML and CSS</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Create interactive web applications with JavaScript</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Build modern UIs with React</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Implement server-side logic with Node.js</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-20">
              {enrollment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Your Progress</h3>
                    <span className="text-sm font-medium text-primary-700">{enrollment.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  
                  <Link 
                    to={`/student/courses/${course.id}/chapter/${course.chapters[0].id}`}
                    className="block w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-center font-medium rounded-md transition-colors"
                  >
                    {enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Course includes:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        {course.duration} of content
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        {course.chapters.length} chapters
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <PlayCircle className="h-4 w-4 text-gray-500 mr-2" />
                        24/7 access
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {course.price > 0 ? `₹${course.price.toLocaleString()}` : 'Free'}
                    </h3>
                    {course.price > 0 && (
                      <p className="text-sm text-gray-600 mt-1">One-time payment, lifetime access</p>
                    )}
                  </div>
                  
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleEnroll}
                  >
                    {course.price > 0 ? 'Enroll Now' : 'Enroll for Free'}
                  </Button>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Course includes:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        {course.duration} of content
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        {course.chapters.length} chapters
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <PlayCircle className="h-4 w-4 text-gray-500 mr-2" />
                        24/7 access
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Award className="h-4 w-4 text-gray-500 mr-2" />
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Curriculum</h2>
          
          <div className="space-y-3">
            {course.chapters.map((chapter: Chapter, index: number) => {
              const isCompleted = enrollment?.completedChapters.includes(chapter.id);
              const isAccessible = !chapter.isLocked || isCompleted;
              
              return (
                <div 
                  key={chapter.id} 
                  className={`border rounded-md overflow-hidden ${
                    isAccessible ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {isAccessible ? (
                        enrollment ? (
                          <Link
                            to={`/student/courses/${course.id}/chapter/${chapter.id}`}
                            className="px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
                          >
                            {isCompleted ? 'Revisit' : 'Start'}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">Preview</span>
                        )
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <LockClosed className="h-4 w-4 mr-1" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isAccessible && (
                    <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                      <div className="text-sm text-gray-700 space-y-1">
                        {chapter.content.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {item.type === 'video' ? (
                                <PlayCircle className="h-4 w-4 text-gray-500 mr-2" />
                              ) : item.type === 'pdf' ? (
                                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                              )}
                              <span>{item.title}</span>
                            </div>
                            {item.duration && (
                              <span className="text-xs text-gray-500">{item.duration} min</span>
                            )}
                          </div>
                        ))}
                        
                        {chapter.content.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{chapter.content.length - 2} more items
                          </p>
                        )}
                        
                        {chapter.quiz && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-center">
                              <Award className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="font-medium">{chapter.quiz.title}</span>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              Quiz
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Your Enrollment</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Course: {course.title}</h3>
              
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md mr-3">
                  <img 
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instructor: {course.instructorName}</p>
                  <p className="text-sm text-gray-600">{course.duration} • {course.level}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Course Price</span>
                  <span className="text-sm font-medium">₹{course.price.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Discount</span>
                    <span className="text-sm font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 my-2 pt-2 flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">₹{finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="block flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md transition-colors"
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
              <div className="space-y-2">
                <div className="border border-gray-300 rounded-md p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="upi" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-900">UPI</span>
                  </label>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="border border-gray-300 rounded-md p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="card" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
                  </label>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                onClick={handleEnrollCompletion}
              >
                Pay ₹{finalPrice.toLocaleString()}
              </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default CourseDetails;