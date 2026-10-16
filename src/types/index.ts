export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST';

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  fullName: string;
  role: Role;
  subject?: string; // For Teacher / User Type 1
  avatar?: string;
  createdAt: string;
  isLocked?: boolean;
  violationCount?: number;
}

export interface StudentPet {
  id: string; // usually same as templateId for simplicity, or unique uuid
  templateId: string;
  name: string;
  level: number;
  hunger: number;
  happiness: number;
  energy: number;
  feedCount?: number;
  completedLessons?: string[];
  adoptedAt: string;
}

export interface Student extends User {
  role: 'STUDENT';
  class: string;
  points: number;
  xp: number;
  streak: number;
  petId?: string; // current active pet template id
  currentPetId?: string;
  petName?: string;
  petLevel: number;
  petHunger: number;
  petHappiness: number;
  petEnergy: number;
  petFeedCount?: number;
  lastLogin: string;
  ownedPets?: StudentPet[];
}

export type ContentStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export interface Subject {
  id: string;
  name: string;
  description: string;
  grade?: string;
  imageUrl?: string;
}

export interface MapNode {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  description: string;
  grade?: string;
}

export interface Lesson {
  id: string;
  mapNodeId: string;
  name: string;
  description: string;
  content?: string;
  grade?: string;
  videoUrl?: string;
  gameUrl?: string;
  status: ContentStatus;
  reviewerId?: string;
  order: number;
  authorId: string;
  rewardXp?: number;
  rewardPoints?: number;
  questions?: Question[];
}

export interface KnowledgeUnit {
  id: string;
  lessonId: string;
  title: string;
  content: string; // Markdown or HTML
  order: number;
}

export interface Question {
  id: string;
  lessonId?: string;
  unitId?: string;
  content: string;
  imageUrl?: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'FILL_BLANK' | 'ESSAY';
  options?: string[]; // Multiple choice options
  correctOptionIndex?: number;
  matchingPairs?: { left: string, right: string }[]; // For matching
  fillBlankAnswers?: string[]; // Ordered list of blanks
  level: 'RECOGNITION' | 'UNDERSTANDING' | 'APPLICATION' | 'HIGH_APPLICATION';
  status: ContentStatus;
  reviewerId?: string;
  explanation?: string;
}

export interface Scene3DCommand {
  command: 'HIGHLIGHT_FACES' | 'UNFOLD' | 'RESET';
  shape: 'box' | 'cylinder' | 'sphere' | 'cone';
  faces?: number[];
  action?: 'unfold' | 'fold';
}

export interface PetDiagnosticContext {
  lessonName: string;
  questionContent: string;
  options: string[];
  selectedOptionIndex: number;
  selectedOptionText: string;
  correctOptionIndex?: number;
  correctOptionText?: string;
  lessonContent?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  grade?: string;
  duration: number; // minutes
  lessonId?: string;
  mapNodeId?: string;
  status: ContentStatus;
  reviewerId?: string;
  questions: Question[];
}

export interface Game {
  id: string;
  lessonId?: string;
  name: string;
  description: string;
  grade?: string;
  type: string;
  status: ContentStatus;
  reviewerId?: string;
}

export interface PetEvolution {
  level: number;
  name: string;
  imageUrl: string;
  requiredXp?: number;
  requiredFeedings?: number;
}

export interface PetTemplate {
  id: string;
  name: string;
  description: string;
  grade?: string;
  baseImageUrl: string;
  maxLevel: number;
  element: string;
  evolutions: PetEvolution[];
}

export interface Food {
  id: string;
  name: string;
  icon: string;
  price: number;
  hungerRestore: number;
  happinessRestore: number;
}

export interface RewardHistory {
  id: string;
  userId: string;
  activityId: string;
  activityType: 'LESSON' | 'QUIZ' | 'GAME' | 'DAILY_QUEST' | 'TEACHER_REWARD';
  points: number;
  xp: number;
  timestamp: string;
  note?: string; // e.g. "Thư khen từ cô giáo"
}

export interface Space3D {
  id: string;
  title: string;
  url: string; // iframe URL or file path
  description?: string;
  createdAt: string;


}

export interface MiniGame {
  id: string;
  title: string;
  url: string; // iframe URL or file path
  description?: string;
  thumbnail?: string;
  mapNodeId?: string;
  subjectId?: string;
  createdAt: string;
}

export interface SystemSettings {
  siteName: string;
  founder: string;
  school: string;
  zalo: string;
  studyLimitMinutes: number;
  petSleepStart: string; // HH:mm format
  petSleepEnd: string;
  logoUrl?: string;
  backgroundUrl?: string;
  adminWelcomeMessage?: string;
  studentWelcomeTitle?: string;
  studentWelcomeSubtitle?: string;
  posterUrl?: string;
  globalEvolutions?: PetEvolution[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
}

export interface StudentTask {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  description: string;
  grade?: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}
