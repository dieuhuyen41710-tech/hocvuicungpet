import { Student } from '../types';

export const getHighestPetLevel = (student: Student) => {
  if (!student.ownedPets || student.ownedPets.length === 0) return 0;
  return Math.max(...student.ownedPets.map(p => p.level));
};

export const getActivityScore = (student: Student) => {
  // Simple formula: completed lessons + streak factor
  return (student.completedLessons?.length || 0) + (student.streak || 0) * 2;
};
