import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Clock as LockClosed, PlayCircle, BookOpen, Award, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/shared/Button';
import { UserRole, Course, Chapter, ChapterContent, Quiz, QuizAttempt } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockCourses, mockEnrollments, mockQuizAttempts } from '../../data/mockData';
import toast from 'react-hot-toast';

const CourseContent = () => {
  const { courseId, chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'notes'>('content');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null);
  const [contentCompleted, setContentCompleted] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call to get course and chapter details
    setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        const foundChapter = foundCourse.chapters.find(ch => ch.id === chapterId);
        if (foundChapter) {
          setCurrentChapter(foundChapter);
          
          // Find any previously completed content
          const enrollment = mockEnrollments.find(e => e.userId === user?.id && e.courseId === courseId);
          if (enrollment) {
            const completedContents = foundChapter.content.filter(c => c.isCompleted).map(c => c.id);
            setContentCompleted(completedContents);
          }
          
          // Find previous quiz attempt
          const attempt = mockQuizAttempts.find(
            a => a.quizId === foundChapter.quiz?.id && a.userId === user?.id
          );
          if (attempt) {
            setPreviousAttempt(attempt);
          }
        }
      }
      
      setIsLoading(false);
    }, 1000);
  }, [courseId, chapterId, user]);

  const markContentComplete = () => {
    const currentContent = currentChapter?.content[activeContentIndex];
    if (!currentContent || contentCompleted.includes(currentContent.id)) return;
    
    // In a real application, this would be an API call
    const updatedCompleted = [...contentCompleted, currentContent.id];
    setContentCompleted(updatedCompleted);
    
    // Check if all content is completed
    if (
      currentChapter && 
      updatedCompleted.length === currentChapter.content.length &&
      !previousAttempt?.isPassed
    ) {
      toast.success('All content viewed! Take the quiz to unlock the next chapter');
    } else {
      toast.success('Progress saved');
    }
  };

  const handleNextContent = () => {
    if (!currentChapter) return;
    
    // Mark current content as complete
    markContentComplete();
    
    // Move to next content item
    if (activeContentIndex < currentChapter.content.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    } else if (currentChapter.quiz && !previousAttempt?.isPassed) {
      // If all content is complete and there's a quiz, show it
      setShowQuiz(true);
    }
  };

  const handlePreviousContent = () => {
    if (showQuiz) {
      setShowQuiz(false);
      return;
    }
    
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    }
  };

  const handleQuizSubmit = () => {
    if (!currentChapter?.quiz) return;
    
    const quiz = currentChapter.quiz;
    let correctAnswers = 0;
    
    // Calculate score
    quiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passingScore;
    
    // Create result object
    const result: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      userId: user?.id || '',
      score,
      isPassed,
      answers: Object.entries(quizAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
      completedAt: new Date().toISOString(),
    };
    
    setQuizResult(result);
    setQuizSubmitted(true);
    
    // In a real app, this would be saved to the database
    mockQuizAttempts.push(result);
    
    if (isPassed) {
      // If passed, update completed chapters in enrollment
      const enrollmentIndex = mockEnrollments.findIndex(
        e => e.userId === user?.id && e.courseId === courseId
      );
      
      if (enrollmentIndex !== -1) {
        const updatedEnrollment = { ...mockEnrollments[enrollmentIndex] };
        if (!updatedEnrollment.completedChapters.includes(chapterId || '')) {
          updatedEnrollment.completedChapters.push(chapterId || '');
        }
        
        // Calculate new progress percentage
        if (course) {
          const progressPercentage = Math.round(
            (updatedEnrollment.completedChapters.length / course.chapters.length) * 100
          );
          updatedEnrollment.progress = progressPercentage;
        }
        
        mockEnrollments[enrollmentIndex] = updatedEnrollment;
        
        // Unlock next chapter
        if (course) {
          const currentIndex = course.chapters.findIndex(ch => ch.id === chapterId);
          if (currentIndex < course.chapters.length - 1) {
            const nextChapter = course.chapters[currentIndex + 1];
            nextChapter.isLocked = false;
          }
        }
      }
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const navigateToChapter = (chapter: Chapter) => {
    navigate(`/student/courses/${courseId}/chapter/${chapter.id}`);
    setActiveContentIndex(0);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const findNextChapter = () => {
    if (!course || !currentChapter) return null;
    
    const currentIndex = course.chapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex < course.chapters.length - 1) {
      return course.chapters[currentIndex + 1];
    }
    
    return null;
  };

  const findPreviousChapter = () => {
    if (!course || !currentChapter) return null;
    
    const currentIndex = course.chapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex > 0) {
      return course.chapters[currentIndex - 1];
    }
    
    return null;
  };

  const currentContent = currentChapter?.content[activeContentIndex];
  const nextChapter = findNextChapter();
  const previousChapter = findPreviousChapter();
  const allContentCompleted = 
    currentChapter && 
    currentChapter.content.length > 0 && 
    currentChapter.content.every(c => contentCompleted.includes(c.id));

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

  if (!course || !currentChapter) {
    return (
      <AppLayout role={UserRole.STUDENT}>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">Content not found</h2>
          <p className="mt-2 text-gray-600">The course or chapter you're looking for doesn't exist.</p>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white h-[64px] border-b border-gray-200 fixed top-0 left-0 w-full z-10 shadow-sm flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link 
            to={`/student/courses/${courseId}`}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h1>
            <p className="text-sm text-gray-600 truncate">{currentChapter.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <BookOpen className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <div className="pt-[64px] flex h-screen">
        {/* Chapter Sidebar */}
        <div 
          className={`bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          }`}
        >
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
            
            <div className="space-y-3">
              {course.chapters.map((chapter, chapterIndex) => {
                const enrollment = mockEnrollments.find(e => e.userId === user?.id && e.courseId === courseId);
                const isCompleted = enrollment?.completedChapters.includes(chapter.id);
                const isCurrentChapter = chapter.id === currentChapter.id;
                const isAccessible = !chapter.isLocked || isCompleted;
                
                return (
                  <div 
                    key={chapter.id}
                    className={`rounded-md overflow-hidden ${
                      isCurrentChapter ? 'border-2 border-primary-500' : 'border border-gray-200'
                    } ${isAccessible ? '' : 'bg-gray-50'}`}
                  >
                    <div 
                      className={`p-3 ${isCurrentChapter ? 'bg-primary-50' : ''}`}
                      onClick={() => isAccessible && navigateToChapter(chapter)}
                    >
                      <div className="flex items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-xs font-medium text-gray-700">{chapterIndex + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${
                            isCurrentChapter ? 'text-primary-700' : 'text-gray-900'
                          }`}>
                            {chapter.title}
                          </h3>
                        </div>
                        {!isAccessible && (
                          <LockClosed className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    
                    {isCurrentChapter && (
                      <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
                        <ul className="space-y-1">
                          {chapter.content.map((content, index) => (
                            <li 
                              key={content.id}
                              className={`flex items-center py-1 px-2 rounded ${
                                index === activeContentIndex && !showQuiz
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'hover:bg-gray-100 text-gray-700'
                              } cursor-pointer`}
                              onClick={() => {
                                setActiveContentIndex(index);
                                setShowQuiz(false);
                              }}
                            >
                              <div className="w-5 h-5 mr-2 flex-shrink-0">
                                {contentCompleted.includes(content.id) ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : content.type === 'video' ? (
                                  <PlayCircle className="h-4 w-4" />
                                ) : (
                                  <BookOpen className="h-4 w-4" />
                                )}
                              </div>
                              <span className="text-sm truncate">{content.title}</span>
                            </li>
                          ))}
                          
                          {chapter.quiz && (
                            <li 
                              className={`flex items-center py-1 px-2 rounded ${
                                showQuiz
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'hover:bg-gray-100 text-gray-700'
                              } cursor-pointer`}
                              onClick={() => {
                                if (allContentCompleted || previousAttempt) {
                                  setShowQuiz(true);
                                } else {
                                  toast.error('Complete all content before taking the quiz');
                                }
                              }}
                            >
                              <div className="w-5 h-5 mr-2 flex-shrink-0">
                                {previousAttempt?.isPassed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Award className="h-4 w-4" />
                                )}
                              </div>
                              <span className="text-sm truncate">{chapter.quiz.title}</span>
                              {previousAttempt?.isPassed && (
                                <span className="ml-auto text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                  Passed
                                </span>
                              )}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white h-[calc(100vh-64px)]">
          <div className="h-full flex flex-col">
            {/* Content Navigation Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'content'
                      ? 'text-primary-700 border-b-2 border-primary-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('content')}
                >
                  Content
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'text-primary-700 border-b-2 border-primary-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'notes'
                      ? 'text-primary-700 border-b-2 border-primary-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
              </div>
            </div>
            
            {/* Content Display Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'content' && (
                <>
                  {showQuiz ? (
                    <div className="max-w-3xl mx-auto">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{currentChapter.quiz?.title}</h2>
                        <p className="text-sm text-gray-600 mb-6">
                          Complete this quiz to unlock the next chapter. 
                          You need {currentChapter.quiz?.passingScore}% to pass.
                        </p>
                        
                        {quizSubmitted ? (
                          <div className="space-y-6">
                            <div className={`p-4 rounded-lg ${
                              quizResult?.isPassed 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}>
                              <h3 className={`font-bold text-lg ${
                                quizResult?.isPassed ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {quizResult?.isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
                              </h3>
                              <p className="mt-1 text-sm">
                                Your score: <span className="font-semibold">{quizResult?.score}%</span>
                              </p>
                              {quizResult?.isPassed && nextChapter && (
                                <p className="mt-3 text-sm">
                                  <span className="font-medium">Next chapter unlocked:</span> {nextChapter.title}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              {currentChapter.quiz?.questions.map((question, qIndex) => {
                                const userAnswer = quizAnswers[question.id];
                                const isCorrect = userAnswer === question.correctOption;
                                
                                return (
                                  <div 
                                    key={question.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                  >
                                    <div className="flex items-start">
                                      <span className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                                        {qIndex + 1}
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{question.text}</p>
                                        
                                        <div className="mt-3 space-y-2">
                                          {question.options.map((option, oIndex) => (
                                            <div 
                                              key={oIndex}
                                              className={`p-3 rounded-md flex items-center ${
                                                userAnswer === oIndex
                                                  ? isCorrect
                                                    ? 'bg-green-100 border border-green-200'
                                                    : 'bg-red-100 border border-red-200'
                                                  : question.correctOption === oIndex
                                                    ? 'bg-green-50 border border-green-200'
                                                    : 'bg-gray-50 border border-gray-200'
                                              }`}
                                            >
                                              <div className="mr-3">
                                                {userAnswer === oIndex ? (
                                                  isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                  ) : (
                                                    <ThumbsDown className="h-5 w-5 text-red-600" />
                                                  )
                                                ) : question.correctOption === oIndex ? (
                                                  <ThumbsUp className="h-5 w-5 text-green-600" />
                                                ) : (
                                                  <div className="w-5 h-5 rounded-full border border-gray-300" />
                                                )}
                                              </div>
                                              <span className="text-sm">{option}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex justify-between pt-4 border-t border-gray-200">
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                                onClick={() => {
                                  setQuizSubmitted(false);
                                  setQuizAnswers({});
                                }}
                              >
                                Retry Quiz
                              </button>
                              
                              {quizResult?.isPassed && nextChapter ? (
                                <button
                                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                                  onClick={() => navigateToChapter(nextChapter)}
                                >
                                  Next Chapter
                                </button>
                              ) : (
                                <button
                                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                                  onClick={() => setShowQuiz(false)}
                                >
                                  Back to Content
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                              <p className="text-sm text-yellow-800">
                                Answer all questions and submit to complete this chapter.
                              </p>
                            </div>
                            
                            {currentChapter.quiz?.questions.map((question, qIndex) => (
                              <div 
                                key={question.id}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex items-start">
                                  <span className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                                    {qIndex + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{question.text}</p>
                                    
                                    <div className="mt-3 space-y-2">
                                      {question.options.map((option, oIndex) => (
                                        <div 
                                          key={oIndex}
                                          className={`p-3 rounded-md flex items-center cursor-pointer ${
                                            quizAnswers[question.id] === oIndex
                                              ? 'bg-primary-50 border border-primary-200'
                                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                          }`}
                                          onClick={() => handleAnswerSelect(question.id, oIndex)}
                                        >
                                          <div className="mr-3">
                                            <div className={`w-5 h-5 rounded-full border ${
                                              quizAnswers[question.id] === oIndex
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-gray-300'
                                            }`}>
                                              {quizAnswers[question.id] === oIndex && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                  <div className="w-2 h-2 rounded-full bg-white" />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <span className="text-sm">{option}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex justify-between pt-4 border-t border-gray-200">
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                                onClick={handlePreviousContent}
                              >
                                Back to Content
                              </button>
                              
                              <button
                                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(quizAnswers).length !== currentChapter.quiz?.questions.length}
                              >
                                Submit Quiz
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : currentContent ? (
                    <div className="max-w-3xl mx-auto">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
                      <p className="text-sm text-gray-600 mb-6">
                        {currentContent.type === 'video' ? (
                          <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            <PlayCircle className="h-3 w-3 mr-1" /> Video
                          </span>
                        ) : currentContent.type === 'pdf' ? (
                          <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            <BookOpen className="h-3 w-3 mr-1" /> PDF
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            <BookOpen className="h-3 w-3 mr-1" /> Text
                          </span>
                        )}
                        {currentContent.duration && (
                          <span className="ml-2 text-gray-600">{currentContent.duration} min</span>
                        )}
                      </p>
                      
                      {currentContent.type === 'video' ? (
                        <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                          <div className="text-center text-white">
                            <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                            <p className="text-sm">Video content would appear here</p>
                          </div>
                        </div>
                      ) : currentContent.type === 'pdf' ? (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 mb-4 flex items-center justify-center">
                          <div className="text-center">
                            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                            <p className="text-sm text-gray-700">PDF document would be displayed here</p>
                            <button className="mt-4 inline-flex items-center px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                              <Download className="h-4 w-4 mr-1.5" />
                              Download PDF
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-blue max-w-none mb-4">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                          </p>
                          <h2>Section Heading</h2>
                          <p>
                            Cras mattis consectetur purus sit amet fermentum. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                          </p>
                          <pre className="bg-gray-100 p-4 rounded">
                            <code>
                              const greeting = "Hello, world!";<br />
                              console.log(greeting);
                            </code>
                          </pre>
                          <p>
                            Donec sed odio dui. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Maecenas sed diam eget risus varius blandit sit amet non magna.
                          </p>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-4 mt-6 flex items-center justify-between">
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => previousChapter ? navigateToChapter(previousChapter) : handlePreviousContent()}
                          disabled={activeContentIndex === 0 && !previousChapter}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1.5" />
                          Previous
                        </button>
                        
                        <div className="flex items-center">
                          <button
                            className={`px-3 py-1.5 rounded-md ${
                              contentCompleted.includes(currentContent.id)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } text-xs font-medium mr-2`}
                            onClick={markContentComplete}
                            disabled={contentCompleted.includes(currentContent.id)}
                          >
                            {contentCompleted.includes(currentContent.id) ? (
                              <span className="flex items-center">
                                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed
                              </span>
                            ) : (
                              'Mark as Complete'
                            )}
                          </button>
                          
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            onClick={handleNextContent}
                          >
                            {activeContentIndex < currentChapter.content.length - 1 ? (
                              <>Next <ChevronRight className="h-4 w-4 ml-1.5" /></>
                            ) : (
                              <>Go to Quiz <ChevronRight className="h-4 w-4 ml-1.5" /></>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-600">No content available for this chapter.</p>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'overview' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{currentChapter.title}</h2>
                  <p className="text-gray-700 mb-6">{currentChapter.description}</p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Chapter Content</h3>
                    <ul className="space-y-2">
                      {currentChapter.content.map((content) => (
                        <li key={content.id} className="flex items-center">
                          {content.type === 'video' ? (
                            <PlayCircle className="h-4 w-4 text-gray-500 mr-2" />
                          ) : content.type === 'pdf' ? (
                            <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-700">{content.title}</span>
                          {content.duration && (
                            <span className="ml-auto text-xs text-gray-500">{content.duration} min</span>
                          )}
                        </li>
                      ))}
                      
                      {currentChapter.quiz && (
                        <li className="flex items-center pt-2 border-t border-gray-200 mt-2">
                          <Award className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{currentChapter.quiz.title}</span>
                          <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            Quiz
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {previousChapter && (
                      <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => navigateToChapter(previousChapter)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" />
                        Previous Chapter
                      </button>
                    )}
                    
                    {nextChapter && (previousAttempt?.isPassed || !currentChapter.quiz) && (
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        onClick={() => navigateToChapter(nextChapter)}
                      >
                        Next Chapter <ChevronRight className="h-4 w-4 ml-1.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">My Notes</h2>
                  
                  <div className="mb-6">
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 h-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Take notes for this chapter here..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Clear
                    </button>
                    <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;