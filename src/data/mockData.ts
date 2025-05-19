import { 
  User, UserRole, Course, Chapter, Notification, 
  Payment, Enrollment, Quiz, QuizAttempt 
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Student',
    email: 'student@example.com',
    role: UserRole.STUDENT,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    id: 'user-2',
    name: 'Jane Teacher',
    email: 'teacher@example.com',
    role: UserRole.TEACHER,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
];

// Mock Course Data
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Web Development Masterclass',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more! A comprehensive course for beginners to advance their web development skills.',
    thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 1999,
    instructorId: 'user-2',
    instructorName: 'Jane Teacher',
    duration: '24 hours',
    level: 'Beginner',
    rating: 4.7,
    totalStudents: 1250,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-05-20T15:30:00Z',
    chapters: [
      {
        id: 'chapter-1-1',
        title: 'Introduction to Web Development',
        description: 'Get an overview of web development basics and set up your development environment.',
        courseId: 'course-1',
        order: 1,
        isLocked: false,
        content: [
          {
            id: 'content-1-1-1',
            title: 'Course Overview',
            type: 'video',
            url: 'https://example.com/videos/course-overview',
            duration: 10,
            chapterId: 'chapter-1-1',
            order: 1,
            isCompleted: true,
          },
          {
            id: 'content-1-1-2',
            title: 'Setting Up Your Development Environment',
            type: 'video',
            url: 'https://example.com/videos/dev-setup',
            duration: 15,
            chapterId: 'chapter-1-1',
            order: 2,
            isCompleted: true,
          },
          {
            id: 'content-1-1-3',
            title: 'Introduction to HTML',
            type: 'video',
            url: 'https://example.com/videos/html-intro',
            duration: 20,
            chapterId: 'chapter-1-1',
            order: 3,
            isCompleted: false,
          },
        ],
        quiz: {
          id: 'quiz-1-1',
          title: 'HTML Basics Quiz',
          chapterId: 'chapter-1-1',
          passingScore: 70,
          questions: [
            {
              id: 'question-1-1-1',
              text: 'What does HTML stand for?',
              options: [
                'Hyper Text Markup Language',
                'High Tech Modern Language',
                'Hyper Transfer Markup Language',
                'Home Tool Markup Language'
              ],
              correctOption: 0,
              quizId: 'quiz-1-1',
            },
            {
              id: 'question-1-1-2',
              text: 'Which HTML tag is used for creating a paragraph?',
              options: ['<paragraph>', '<p>', '<para>', '<pre>'],
              correctOption: 1,
              quizId: 'quiz-1-1',
            },
            {
              id: 'question-1-1-3',
              text: 'Which HTML attribute is used to define inline styles?',
              options: ['class', 'styles', 'style', 'font'],
              correctOption: 2,
              quizId: 'quiz-1-1',
            },
          ],
        },
      },
      {
        id: 'chapter-1-2',
        title: 'CSS Fundamentals',
        description: 'Learn how to style your web pages using CSS.',
        courseId: 'course-1',
        order: 2,
        isLocked: true,
        content: [
          {
            id: 'content-1-2-1',
            title: 'Introduction to CSS',
            type: 'video',
            url: 'https://example.com/videos/css-intro',
            duration: 18,
            chapterId: 'chapter-1-2',
            order: 1,
          },
          {
            id: 'content-1-2-2',
            title: 'CSS Selectors',
            type: 'video',
            url: 'https://example.com/videos/css-selectors',
            duration: 22,
            chapterId: 'chapter-1-2',
            order: 2,
          },
        ],
        quiz: {
          id: 'quiz-1-2',
          title: 'CSS Fundamentals Quiz',
          chapterId: 'chapter-1-2',
          passingScore: 70,
          questions: [
            {
              id: 'question-1-2-1',
              text: 'Which CSS property is used to change the text color?',
              options: ['text-color', 'font-color', 'color', 'text-style'],
              correctOption: 2,
              quizId: 'quiz-1-2',
            },
            {
              id: 'question-1-2-2',
              text: 'Which CSS selector selects elements with a specific class?',
              options: ['.class', '#class', '*class', '&class'],
              correctOption: 0,
              quizId: 'quiz-1-2',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Data Science for Beginners',
    description: 'Start your journey in data science with Python, pandas, numpy, and matplotlib. Perfect for beginners!',
    thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 2499,
    instructorId: 'user-2',
    instructorName: 'Jane Teacher',
    duration: '30 hours',
    level: 'Beginner',
    rating: 4.5,
    totalStudents: 875,
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:20:00Z',
    chapters: [
      {
        id: 'chapter-2-1',
        title: 'Introduction to Python',
        description: 'Learn Python basics for data science.',
        courseId: 'course-2',
        order: 1,
        isLocked: false,
        content: [
          {
            id: 'content-2-1-1',
            title: 'Getting Started with Python',
            type: 'video',
            url: 'https://example.com/videos/python-intro',
            duration: 15,
            chapterId: 'chapter-2-1',
            order: 1,
          },
        ],
        quiz: {
          id: 'quiz-2-1',
          title: 'Python Basics Quiz',
          chapterId: 'chapter-2-1',
          passingScore: 70,
          questions: [
            {
              id: 'question-2-1-1',
              text: 'Which of the following is NOT a Python data type?',
              options: ['Integer', 'Float', 'Character', 'Boolean'],
              correctOption: 2,
              quizId: 'quiz-2-1',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Advanced React Development',
    description: 'Take your React skills to the next level with advanced concepts like hooks, context API, and Redux.',
    thumbnail: 'https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 3499,
    instructorId: 'user-2',
    instructorName: 'Jane Teacher',
    duration: '20 hours',
    level: 'Advanced',
    rating: 4.9,
    totalStudents: 550,
    createdAt: '2023-03-05T14:30:00Z',
    updatedAt: '2023-05-15T16:45:00Z',
    chapters: [
      {
        id: 'chapter-3-1',
        title: 'React Hooks in Depth',
        description: 'Master React hooks for functional components.',
        courseId: 'course-3',
        order: 1,
        isLocked: false,
        content: [],
        quiz: {
          id: 'quiz-3-1',
          title: 'React Hooks Quiz',
          chapterId: 'chapter-3-1',
          passingScore: 80,
          questions: [],
        },
      },
    ],
  },
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: 'course-1',
    progress: 35,
    enrolledAt: '2023-03-10T08:00:00Z',
    lastAccessedAt: '2023-06-15T10:30:00Z',
    completedChapters: ['chapter-1-1'],
  },
  {
    id: 'enrollment-2',
    userId: 'user-1',
    courseId: 'course-2',
    progress: 15,
    enrolledAt: '2023-04-05T14:20:00Z',
    lastAccessedAt: '2023-06-10T16:45:00Z',
    completedChapters: [],
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    userId: 'user-1',
    courseId: 'course-1',
    courseTitle: 'Complete Web Development Masterclass',
    amount: 1999,
    discount: 400,
    finalAmount: 1599,
    couponCode: 'WELCOME20',
    status: 'completed',
    paymentMethod: 'card',
    transactionId: 'txn-12345',
    createdAt: '2023-03-10T08:00:00Z',
  },
  {
    id: 'payment-2',
    userId: 'user-1',
    courseId: 'course-2',
    courseTitle: 'Data Science for Beginners',
    amount: 2499,
    finalAmount: 2499,
    status: 'completed',
    paymentMethod: 'upi',
    transactionId: 'txn-67890',
    createdAt: '2023-04-05T14:20:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notification-1',
    userId: 'user-1',
    title: 'New Content Available',
    message: 'A new chapter has been added to "Complete Web Development Masterclass"',
    isRead: false,
    type: 'info',
    createdAt: '2023-06-15T10:30:00Z',
  },
  {
    id: 'notification-2',
    userId: 'user-1',
    title: 'Quiz Result',
    message: 'You passed the "HTML Basics" quiz with a score of 90%',
    isRead: true,
    type: 'success',
    createdAt: '2023-06-10T16:45:00Z',
  },
  {
    id: 'notification-3',
    userId: 'user-1',
    title: 'Course Reminder',
    message: 'You haven\'t accessed "Data Science for Beginners" in 7 days',
    isRead: false,
    type: 'warning',
    createdAt: '2023-06-05T09:15:00Z',
  },
  {
    id: 'notification-4',
    userId: 'user-2',
    title: 'New Student Enrolled',
    message: 'A new student has enrolled in your "Complete Web Development Masterclass"',
    isRead: false,
    type: 'info',
    createdAt: '2023-06-14T14:20:00Z',
  },
  {
    id: 'notification-5',
    userId: 'user-3',
    title: 'New Teacher Registration',
    message: 'A new teacher account requires approval',
    isRead: true,
    type: 'info',
    createdAt: '2023-06-12T11:05:00Z',
  },
];

// Mock Quiz Attempts
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz-1-1',
    userId: 'user-1',
    score: 90,
    isPassed: true,
    answers: [
      {
        questionId: 'question-1-1-1',
        selectedOption: 0,
      },
      {
        questionId: 'question-1-1-2',
        selectedOption: 1,
      },
      {
        questionId: 'question-1-1-3',
        selectedOption: 2,
      },
    ],
    completedAt: '2023-06-10T16:30:00Z',
  },
];