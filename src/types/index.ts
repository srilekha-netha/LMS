export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructorId: string;
  instructorName: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  totalStudents: number;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  isLocked: boolean;
  content: ChapterContent[];
  quiz?: Quiz;
}

export type ContentType = 'video' | 'pdf' | 'text';

export interface ChapterContent {
  id: string;
  title: string;
  type: ContentType;
  url?: string;
  content?: string;
  duration?: number;
  chapterId: string;
  order: number;
  isCompleted?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  chapterId: string;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  quizId: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  lastAccessedAt: string;
  completedChapters: string[];
  enrolledAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  discount?: number;
  finalAmount: number;
  couponCode?: string;
  status: 'completed' | 'failed' | 'pending';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  courseId?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  chapterId: string;
  dueDate: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  fileUrl: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  isPassed: boolean;
  answers: {
    questionId: string;
    selectedOption: number;
  }[];
  completedAt: string;
}