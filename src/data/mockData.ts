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
  { id: 'node2', subjectId: 'sub1', name: 'Chương 2: Hình khối trong thực tiễn', order: 2, description: 'Hình hộp chữ nhật, hình lập phương, lăng trụ đứng' },
  { id: 'node3', subjectId: 'sub2', name: 'Chương 1: Thơ và Khúc giao mùa', order: 1, description: 'Tìm hiểu về các thể loại thơ' }
];

export const mockQuestions: Question[] = [
  { 
    id: 'q1', 
    lessonId: 'lesson1', 
    content: 'Số hữu tỉ là số có thể viết được dưới dạng nào sau đây?', 
    type: 'MULTIPLE_CHOICE', 
    options: [
      'A. Phân số a/b với a, b ∈ ℤ và b ≠ 0', 
      'B. Phân số a/b với a, b là số tự nhiên', 
      'C. Căn bậc hai của một số nguyên tố', 
      'D. Số thập phân vô hạn không tuần hoàn'
    ], 
    correctOptionIndex: 0, 
    level: 'RECOGNITION', 
    status: 'PUBLISHED',
    explanation: 'Theo định nghĩa, số hữu tỉ là số viết được dưới dạng phân số a/b với a, b ∈ ℤ, b ≠ 0.'
  },
  { 
    id: 'q2', 
    lessonId: 'lesson1', 
    content: 'Số đối của phân số -3/5 là:', 
    type: 'MULTIPLE_CHOICE', 
    options: [
      'A. -5/3', 
      'B. 3/5', 
      'C. 5/3', 
      'D. -3/5'
    ], 
    correctOptionIndex: 1, 
    level: 'UNDERSTANDING', 
    status: 'PUBLISHED',
    explanation: 'Số đối của số x là -x. Vì vậy số đối của -3/5 chính là -(-3/5) = 3/5. (Chú ý không nhầm với số nghịch đảo -5/3).'
  },
  { 
    id: 'q3', 
    lessonId: 'lesson2', 
    content: 'Một hình hộp chữ nhật có chiều dài 5 cm, chiều rộng 3 cm và chiều cao 4 cm. Diện tích xung quanh của hình hộp chữ nhật đó là:', 
    type: 'MULTIPLE_CHOICE', 
    options: [
      'A. 64 cm²', 
      'B. 94 cm²', 
      'C. 60 cm³', 
      'D. 32 cm²'
    ], 
    correctOptionIndex: 0, 
    level: 'APPLICATION', 
    status: 'PUBLISHED',
    explanation: 'Công thức diện tích xung quanh: Sxq = 2 × (dài + rộng) × cao = 2 × (5 + 3) × 4 = 64 cm². Lưu ý: 94 cm² là diện tích toàn phần, 60 cm³ là thể tích!'
  },
  { 
    id: 'q4', 
    lessonId: 'lesson2', 
    content: 'Một bể chứa nước dạng hình hộp chữ nhật có chiều dài 2 m, chiều rộng 1,5 m và chiều cao 10 dm. Tính thể tích bể nước theo đơn vị m³:', 
    type: 'MULTIPLE_CHOICE', 
    options: [
      'A. 30 m³', 
      'B. 3 m³', 
      'C. 300 m³', 
      'D. 7 m³'
    ], 
    correctOptionIndex: 1, 
    level: 'APPLICATION', 
    status: 'PUBLISHED',
    explanation: 'Chú ý đổi cùng đơn vị: Chiều cao h = 10 dm = 1 m. Thể tích V = dài × rộng × cao = 2 × 1.5 × 1 = 3 m³. Nếu quên đổi đơn vị (lấy 2 × 1.5 × 10 = 30) sẽ bị sai!'
  },
  { 
    id: 'q5', 
    lessonId: 'lesson2', 
    content: 'Một khối gỗ hình lập phương có cạnh bằng 4 cm. Thể tích của khối gỗ đó là:', 
    type: 'MULTIPLE_CHOICE', 
    options: [
      'A. 16 cm²', 
      'B. 96 cm²', 
      'C. 64 cm³', 
      'D. 48 cm'
    ], 
    correctOptionIndex: 2, 
    level: 'UNDERSTANDING', 
    status: 'PUBLISHED',
    explanation: 'Thể tích hình lập phương cạnh a là V = a³ = 4³ = 64 cm³. (16 cm² là diện tích một mặt, 96 cm² là diện tích toàn phần).'
  }
];

export const mockLessons: Lesson[] = [
  { 
    id: 'lesson1', 
    mapNodeId: 'node1', 
    name: 'Tập hợp các số hữu tỉ', 
    description: 'Khái niệm, biểu diễn trên trục số và số đối của số hữu tỉ', 
    content: '1. Khái niệm số hữu tỉ:\nSố hữu tỉ là số viết được dưới dạng phân số a/b với a, b thuộc Z, b khác 0.\nTập hợp các số hữu tỉ được kí hiệu là Q.\n\n2. Số đối của số hữu tỉ:\nMỗi số hữu tỉ x đều có một số đối duy nhất, kí hiệu là -x.\nSố đối của 0 là 0.\nChú ý: Đừng nhầm lẫn giữa số đối (đổi dấu: x thành -x) và số nghịch đảo (đổi tử mẫu: a/b thành b/a).',
    status: 'PUBLISHED', 
    order: 1, 
    authorId: 'teacher1', 
    rewardXp: 50, 
    rewardPoints: 10,
    questions: [mockQuestions[0], mockQuestions[1]]
  },
  { 
    id: 'lesson2', 
    mapNodeId: 'node2', 
    name: 'Diện tích xung quanh và thể tích của hình hộp chữ nhật', 
    description: 'Công thức tính diện tích xung quanh Sxq = 2(a+b)h và thể tích V = a.b.h cùng các bẫy thường gặp', 
    content: '1. Diện tích xung quanh của hình hộp chữ nhật:\nSxq = 2.(a + b).h = Chu vi đáy × Chiều cao\nTrong đó:\n- a là chiều dài\n- b là chiều rộng\n- h là chiều cao (các kích thước phải CÙNG ĐƠN VỊ ĐO)\n\n2. Diện tích toàn phần:\nStp = Sxq + 2.Sđáy = Sxq + 2.(a.b)\n\n3. Thể tích của hình hộp chữ nhật:\nV = a.b.h = Diện tích đáy × Chiều cao\n\n⚠️ CÁC LỖI SAI HỌC SINH THƯỜNG MẮC:\n- Nhầm lẫn giữa Sxq (diện tích xung quanh) và Stp (diện tích toàn phần).\n- Nhầm công thức diện tích với công thức thể tích V.\n- Quên quy đổi về cùng đơn vị đo (ví dụ dm sang m hoặc cm sang m).\n- Quên nhân 2 trong công thức tính chu vi đáy khi tính Sxq.',
    status: 'PUBLISHED', 
    order: 1, 
    authorId: 'teacher1', 
    rewardXp: 60, 
    rewardPoints: 15,
    questions: [mockQuestions[2], mockQuestions[3], mockQuestions[4]]
  }
];

export const mockFoods: Food[] = [
  { id: 'food1', name: 'Táo Đỏ', icon: '🍎', price: 10, hungerRestore: 20, happinessRestore: 5 },
  { id: 'food2', name: 'Bánh Kem', icon: '🍰', price: 25, hungerRestore: 15, happinessRestore: 30 },
  { id: 'food3', name: 'Cà Rốt', icon: '🥕', price: 15, hungerRestore: 25, happinessRestore: 5 },
  { id: 'food4', name: 'Cá Hồi', icon: '🍣', price: 30, hungerRestore: 40, happinessRestore: 20 },
];
