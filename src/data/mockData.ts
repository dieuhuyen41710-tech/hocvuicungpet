import { Role, Student, User, Subject, MapNode, Lesson, Question, Game, PetTemplate, Food, SystemSettings, MiniGame } from '../types';

export const mockUsers: User[] = [
  { id: 'admin1', username: 'admin', email: 'dieuhuyen41710@gmail.com', password: 'admin', fullName: 'Nguyễn Diệu Huyền', role: 'ADMIN', createdAt: new Date().toISOString() },
  { id: 'teacher1', username: 'teacher', email: 'teacher@school.local', password: '123456', fullName: 'Thầy Cường', role: 'TEACHER', createdAt: new Date().toISOString() },
  { id: 'teacher2', username: 'teacher2', email: 'teacher2@school.local', password: '123456', fullName: 'Cô Lan', role: 'TEACHER', createdAt: new Date().toISOString() },
];

export const mockStudents: Student[] = [
  {
    id: 'student1', username: 'student', email: 'student@school.local', password: '123456', fullName: 'Nguyễn Minh Anh', role: 'STUDENT', class: '7A', points: 150, xp: 450, streak: 5, petLevel: 1, petHunger: 80, petHappiness: 90, petEnergy: 100, lastLogin: new Date().toISOString(), createdAt: new Date().toISOString()
  },
  {
    id: 'student2', username: 'student2', email: 'student2@school.local', password: '123456', fullName: 'Lê Hoàng Nam', role: 'STUDENT', class: '7A', points: 20, xp: 50, streak: 1, petLevel: 1, petHunger: 40, petHappiness: 50, petEnergy: 60, lastLogin: new Date().toISOString(), createdAt: new Date().toISOString()
  },
];

export const mockSettings: SystemSettings = {
  siteName: 'Học vui cùng Pet',
  founder: 'Nguyễn Diệu Huyền',
  school: 'Trường THCS Bằng Doãn - Xã Bằng Luân - Tỉnh Phú Thọ',
  zalo: '0974668640',
  studyLimitMinutes: 45,
  petSleepStart: '21:30',
  petSleepEnd: '07:00',
  adminWelcomeMessage: 'Chào mừng Quản trị viên đến với hệ thống Học vui cùng Pet! Chúc bạn có một ngày làm việc hiệu quả, sáng tạo và quản lý trường học thành công.',
  studentWelcomeTitle: 'Chào mừng bạn đến với Vương quốc Pet tri thức!',
  studentWelcomeSubtitle: 'Hãy học tập chăm chỉ để nuôi Pet lớn khôn mỗi ngày bạn nhé!',
  globalEvolutions: [
    { level: 2, name: 'Cấp 2: Tinh Anh', imageUrl: '⭐' },
    { level: 3, name: 'Cấp 3: Siêu Cấp', imageUrl: '🔥' },
    { level: 4, name: 'Cấp 4: Huyền Thoại', imageUrl: '👑' },
    { level: 5, name: 'Cấp 5: Thần Thánh', imageUrl: '🌟' }
  ]
};

export const mockMiniGames: MiniGame[] = [
  {
    id: 'game1',
    title: 'Khám phá hình hộp chữ nhật',
    url: 'https://wordwall.net/embed/example',
    description: 'Trò chơi tương tác ôn tập kiến thức hình học không gian lớp 7.',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: new Date().toISOString()
  },
  {
    id: 'game2',
    title: 'Khủng long tìm trứng',
    url: 'https://wordwall.net/embed/example2',
    description: 'Nhận biết hình lăng trụ đứng tam giác và tứ giác.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: new Date().toISOString()
  }
];

export const mockPets: PetTemplate[] = [
  { id: 'pet1', name: 'Thỏ Tri Thức', description: 'Nhanh nhẹn và thông minh', baseImageUrl: '🐰', maxLevel: 5, element: 'Mộc', evolutions: [{ level: 2, name: 'Thỏ Tinh Anh', imageUrl: '🐇' }] },
  { id: 'pet2', name: 'Mèo Mực', description: 'Bí ẩn và sắc sảo', baseImageUrl: '🐱', maxLevel: 5, element: 'Hỏa', evolutions: [{ level: 2, name: 'Mèo Lửa', imageUrl: '🐈' }] },
  { id: 'pet3', name: 'Cún Thông Minh', description: 'Trung thành và ngoan ngoãn', baseImageUrl: '🐶', maxLevel: 5, element: 'Thủy', evolutions: [{ level: 2, name: 'Cún Biển', imageUrl: '🐕' }] },
];

export const mockSubjects: Subject[] = [
  { id: 'sub1', name: 'Toán Học 7', description: 'Chương trình Toán học lớp 7', grade: '7' },
  { id: 'sub2', name: 'Ngữ Văn 7', description: 'Chương trình Ngữ Văn lớp 7', grade: '7' },
  { id: 'sub3', name: 'Toán Học 6', description: 'Chương trình Toán học lớp 6', grade: '6' },
  { id: 'sub4', name: 'Ngữ Văn 6', description: 'Chương trình Ngữ Văn lớp 6', grade: '6' },
];

export const mockMapNodes: MapNode[] = [
  { id: 'node1', subjectId: 'sub1', name: 'Chương 1: Số hữu tỉ', order: 1, description: 'Cơ bản về số hữu tỉ' },
  { id: 'node2', subjectId: 'sub1', name: 'Chương 2: Số thực', order: 2, description: 'Nâng cao với số thực' },
  { id: 'node3', subjectId: 'sub2', name: 'Chương 1: Thơ và Khúc giao mùa', order: 1, description: 'Tìm hiểu về các thể loại thơ' }
];

export const mockLessons: Lesson[] = [
  { id: 'lesson1', mapNodeId: 'node1', name: 'Tập hợp các số hữu tỉ', description: 'Giới thiệu về tập hợp Q', status: 'PUBLISHED', order: 1, authorId: 'teacher1', rewardXp: 50, rewardPoints: 10 }
];

export const mockFoods: Food[] = [
  { id: 'food1', name: 'Táo Đỏ', icon: '🍎', price: 10, hungerRestore: 20, happinessRestore: 5 },
  { id: 'food2', name: 'Bánh Kem', icon: '🍰', price: 25, hungerRestore: 15, happinessRestore: 30 },
  { id: 'food3', name: 'Cà Rốt', icon: '🥕', price: 15, hungerRestore: 25, happinessRestore: 5 },
  { id: 'food4', name: 'Cá Hồi', icon: '🍣', price: 30, hungerRestore: 40, happinessRestore: 20 },
];

export const mockQuestions: Question[] = [
  { id: 'q1', lessonId: 'lesson1', content: 'Số hữu tỉ là gì?', type: 'MULTIPLE_CHOICE', options: ['Là số nguyên', 'Là số tự nhiên', 'Là số viết được dưới dạng a/b (a,b thuộc Z, b khác 0)', 'Là số vô tỉ'], correctOptionIndex: 2, level: 'RECOGNITION', status: 'PUBLISHED' }
];
