import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  Student,
  SystemSettings,
  Lesson,
  MapNode,
  Subject,
  Message,
  StudentTask,
  Space3D,
  MiniGame
} from "../types";
import {
  mockUsers,
  mockStudents,
  mockSettings,
  mockSubjects,
  mockMapNodes,
  mockLessons,
  mockPets,
  mockMiniGames,
} from "../data/mockData";
import { createCrudActions } from "./crudActions";
import { initializeFirestoreData } from "../lib/firebaseSync";
import { db, handleFirestoreError, OperationType, cleanFirestoreData } from "../lib/firebase";
import { doc, setDoc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { calculatePetLevel, calculatePetLevelByFeedings } from "../lib/petUtils";

interface AppState {
  currentUser: User | Student | null;
  settings: SystemSettings;
  subjects: Subject[];
  mapNodes: MapNode[];
  lessons: Lesson[];
  tests: any[];
  pets: any[];
  completedLessons: string[]; // array of lesson ids completed by current student
  users: User[];
  students: Student[];
  messages: Message[];
  studentTasks: StudentTask[];
  spaces3D: Space3D[];
  miniGames: MiniGame[];
  ratings: { id: string; stars: number; comment?: string; createdAt: string; userName?: string }[];
  levelUpInfo: { level: number; petName: string } | null;
  
  addRating: (stars: number, comment?: string) => void;
  clearLevelUpInfo: () => void;
  addSpace3D: (space: Space3D) => void;
  updateSpace3D: (id: string, space: Partial<Space3D>) => void;
  deleteSpace3D: (id: string) => void;
  
  addMiniGame: (game: MiniGame) => Promise<void>;
  updateMiniGame: (id: string, game: Partial<MiniGame>) => Promise<void>;
  deleteMiniGame: (id: string) => Promise<void>;

  login: (username: string) => void;
  guestLogin: () => void;
  logout: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  completeLesson: (lessonId: string) => void;
  feedPet: (
    hungerAmount: number,
    happinessAmount: number,
    cost: number,
  ) => void;
  playMiniGameReward: () => void;
  addPointsAndXP: (points: number, xp: number) => void;
  selectPet: (petId: string, petName: string) => void;
  resumePet: (instanceId: string) => void;
  deleteUser: (id: string, role: string) => void;

  addUser: (user: any) => Promise<void>;
  updateUser: (id: string, role: string, data: any) => Promise<void>;
  addLesson: (lesson: any) => Promise<void>;
  updateLesson: (id: string, data: any) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  addMapNode: (node: any) => Promise<void>;
  updateMapNode: (id: string, data: any) => Promise<void>;
  deleteMapNode: (id: string) => Promise<void>;
  addPet: (pet: any) => Promise<void>;
  updatePet: (id: string, data: any) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  addTest: (test: any) => Promise<void>;
  updateTest: (id: string, data: any) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;

  sendMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'isArchived'>) => void;
  archiveMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  addStudentTask: (task: Omit<StudentTask, 'id' | 'createdAt' | 'status'>) => void;
  rewardStudent: (studentId: string, points: number, xp: number, note?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      initializeFirestoreData(set);
      return {
      currentUser: null,
      settings: mockSettings,
      subjects: mockSubjects,
      mapNodes: mockMapNodes,
      lessons: mockLessons,
      tests: [],
      pets: mockPets,
      completedLessons: [],
      users: mockUsers,
      students: mockStudents,
      messages: [],
      studentTasks: [],
      spaces3D: [
        {
          id: 'space-1',
          title: 'Khối Hình Học 3D Cơ Bản (Diện Tích)',
          url: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_vi.html?embed',
          description: 'Khám phá và tương tác trực quan với các hình khối và diện tích.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'space-2',
          title: 'Không Gian Toán Học 3D',
          url: 'https://www.geogebra.org/3d?embed',
          description: 'Mô phỏng và quan sát hình học không gian 3D.',
          createdAt: new Date().toISOString()
        }
      ],
      miniGames: mockMiniGames,
      ratings: [],
      levelUpInfo: null,
      addRating: async (stars, comment) => {
        try {
          const newRating = {
            stars,
            comment,
            createdAt: new Date().toISOString(),
            userName: get().currentUser?.fullName || 'Khách'
          };
          const docRef = await addDoc(collection(db, 'ratings'), newRating);
          set((state) => ({
            ratings: [{ id: docRef.id, ...newRating }, ...state.ratings]
          }));
        } catch (error) {
          console.error("Error adding rating:", error);
        }
      },
      clearLevelUpInfo: () => set({ levelUpInfo: null }),

      addSpace3D: async (space) => {
        try {
          await setDoc(doc(db, 'spaces3D', space.id), space);
          set((state) => ({ spaces3D: [...state.spaces3D, space] }));
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'spaces3D');
        }
      },
      updateSpace3D: async (id, space) => {
        try {
          await updateDoc(doc(db, 'spaces3D', id), space);
          set((state) => ({ spaces3D: state.spaces3D.map(s => s.id === id ? { ...s, ...space } : s) }));
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'spaces3D');
        }
      },
      deleteSpace3D: async (id) => {
        try {
          await deleteDoc(doc(db, 'spaces3D', id));
          set((state) => ({ spaces3D: state.spaces3D.filter(s => s.id !== id) }));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, 'spaces3D');
        }
      },
      
      addMiniGame: async (game) => {
        try {
          await setDoc(doc(db, 'miniGames', game.id), game);
          set((state) => ({ miniGames: [...state.miniGames, game] }));
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'miniGames');
        }
      },
      updateMiniGame: async (id, game) => {
        try {
          await updateDoc(doc(db, 'miniGames', id), game);
          set((state) => ({ miniGames: state.miniGames.map(g => g.id === id ? { ...g, ...game } : g) }));
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'miniGames');
        }
      },
      deleteMiniGame: async (id) => {
        try {
          await deleteDoc(doc(db, 'miniGames', id));
          set((state) => ({ miniGames: state.miniGames.filter(g => g.id !== id) }));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, 'miniGames');
        }
      },

      ...createCrudActions(set),

      login: (username) =>
        set((state) => {
          const target = username.trim().toLowerCase();
          const user =
            state.users.find((u) => u.username?.toLowerCase() === target || u.email?.toLowerCase() === target) ||
            state.students.find((s) => s.username?.toLowerCase() === target || s.email?.toLowerCase() === target);
          if (user) {
            if (user.role === 'STUDENT') {
              const student = { ...(user as Student) };
              const savedLevel = student.petLevel || 1;
              const activePet = student.ownedPets?.find(p => p.id === student.currentPetId) || student.ownedPets?.[0];
              const petLevelFromOwned = activePet?.level || 1;
              const feedCount = student.petFeedCount || activePet?.feedCount || 0;
              const calculatedLevel = calculatePetLevelByFeedings(feedCount, state.settings.globalEvolutions);
              const finalLevel = Math.max(savedLevel, petLevelFromOwned, calculatedLevel);
              
              student.petLevel = finalLevel;
              student.petFeedCount = feedCount;
              if (activePet) {
                activePet.level = finalLevel;
                activePet.feedCount = feedCount;
              }
              const petCompleted: string[] = activePet?.completedLessons || [];
              return { currentUser: student, completedLessons: petCompleted };
            }
            return { currentUser: user };
          }
          return state;
        }),

      guestLogin: () =>
        set({
          currentUser: {
            id: "guest",
            username: "guest",
            fullName: "Khách",
            role: "GUEST", // Guest role for restricted features like mailbox
            class: "Chưa có",
            points: 50,
            xp: 0,
            streak: 0,
            petId: undefined,
            petLevel: 1,
            petHunger: 80,
            petHappiness: 80,
            petEnergy: 100,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          } as any,
          completedLessons: [],
        }),

      logout: () => set({ currentUser: null }),
      updateUser: async (id, role, data) => {
        try {
          const col = (role === 'TEACHER' || role === 'ADMIN') ? "users" : "students";
          await updateDoc(doc(db, col, id), data);
          set((state) => {
            if (role === 'TEACHER' || role === 'ADMIN') {
              return {
                users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
                currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser
              };
            } else {
              return {
                students: state.students.map(s => s.id === id ? { ...s, ...data } : s),
                currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser
              };
            }
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'users/students');
        }
      },


      updateSettings: async (newSettings) => {
        try {
          const updated = { ...get().settings, ...newSettings };
          await setDoc(doc(db, 'settings', 'config'), updated);
          set({ settings: updated });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'settings/config');
        }
      },

      completeLesson: (lessonId) =>
        set((state) => {
          const newCompleted = state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId];
          
          let updatedUser = state.currentUser;
          let updatedStudents = state.students;

          if (state.currentUser && state.currentUser.role === 'STUDENT') {
            const student = state.currentUser as Student;
            const ownedPets = student.ownedPets || [];
            const currentPetId = student.currentPetId;
            const newHunger = Math.max(0, (student.petHunger ?? 80) - 10);

            const updatedOwnedPets = ownedPets.map(p => {
              if (p.id === currentPetId || (!currentPetId && ownedPets.indexOf(p) === 0)) {
                return { ...p, completedLessons: newCompleted, hunger: Math.max(0, (p.hunger ?? 80) - 10) };
              }
              return p;
            });

            updatedUser = {
              ...student,
              petHunger: newHunger,
              ownedPets: updatedOwnedPets
            };

            updatedStudents = state.students.map(s => s.id === student.id ? (updatedUser as Student) : s);
            setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(err => {
              console.error("Error saving completeLesson to Firestore:", err);
            });
          }

          return { 
            completedLessons: newCompleted,
            currentUser: updatedUser as any,
            students: updatedStudents
          };
        }),

      feedPet: (hungerAmount, happinessAmount, cost) =>
        set((state) => {
          const user = state.currentUser;
          if (user && (user.role === "STUDENT" || user.role === "GUEST")) {
            const student = user as Student;
            if (student.points >= cost) {
              const currentFeedCount = (student.petFeedCount || 0) + 1;
              const calculatedLevel = calculatePetLevelByFeedings(currentFeedCount, state.settings.globalEvolutions);
              const oldLevel = student.petLevel || 1;
              // Never downgrade: ensure level is at least the highest level achieved
              const newLevel = Math.max(oldLevel, calculatedLevel);
              const isLevelUp = newLevel > oldLevel;

              let updatedOwnedPets = student.ownedPets || [];
              if (student.currentPetId) {
                updatedOwnedPets = updatedOwnedPets.map(p => {
                  if (p.id === student.currentPetId) {
                    return {
                      ...p,
                      level: newLevel,
                      feedCount: currentFeedCount,
                      hunger: Math.min(100, (p.hunger ?? student.petHunger ?? 50) + hungerAmount),
                      happiness: Math.min(100, (p.happiness ?? student.petHappiness ?? 50) + happinessAmount)
                    };
                  }
                  return p;
                });
              } else if (updatedOwnedPets.length > 0) {
                updatedOwnedPets[0] = {
                  ...updatedOwnedPets[0],
                  level: newLevel,
                  feedCount: currentFeedCount,
                  hunger: Math.min(100, (updatedOwnedPets[0].hunger ?? student.petHunger ?? 50) + hungerAmount),
                  happiness: Math.min(100, (updatedOwnedPets[0].happiness ?? student.petHappiness ?? 50) + happinessAmount)
                };
              } else if (student.petId) {
                const instanceId = Date.now().toString() + Math.random().toString().slice(2, 6);
                updatedOwnedPets = [{
                  id: instanceId,
                  templateId: student.petId,
                  name: student.petName || 'Pet',
                  level: newLevel,
                  hunger: Math.min(100, (student.petHunger ?? 50) + hungerAmount),
                  happiness: Math.min(100, (student.petHappiness ?? 50) + happinessAmount),
                  energy: student.petEnergy ?? 100,
                  feedCount: currentFeedCount,
                  completedLessons: state.completedLessons || [],
                  adoptedAt: new Date().toISOString()
                }];
              }

              const currentPetId = student.currentPetId || updatedOwnedPets[0]?.id;

              const updatedUser: Student = {
                ...student,
                currentPetId,
                points: student.points - cost,
                petFeedCount: currentFeedCount,
                petLevel: newLevel,
                petHunger: Math.min(100, (student.petHunger ?? 50) + hungerAmount),
                petHappiness: Math.min(100, (student.petHappiness ?? 50) + happinessAmount),
                ownedPets: updatedOwnedPets
              };

              const students = state.students.map(s => s.id === updatedUser.id ? updatedUser : s);
              setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(err => {
                console.error("Error saving feedPet to Firestore:", err);
              });

              return {
                currentUser: updatedUser as any,
                students,
                levelUpInfo: isLevelUp ? { level: newLevel, petName: student.petName || 'Pet' } : state.levelUpInfo
              };
            }
          }
          return state;
        }),

      playMiniGameReward: () =>
        set((state) => {
          const user = state.currentUser;
          if (user && (user.role === "STUDENT" || user.role === "GUEST")) {
            const student = user as Student;
            const newHunger = Math.min(100, (student.petHunger || 0) + 20);
            const newHappiness = Math.min(100, (student.petHappiness || 0) + 20);
            const newPoints = (student.points || 0) + 10;
            const newXp = (student.xp || 0) + 10;

            let updatedOwnedPets = student.ownedPets || [];
            if (student.currentPetId) {
              updatedOwnedPets = updatedOwnedPets.map(p => {
                if (p.id === student.currentPetId) {
                  return {
                    ...p,
                    hunger: newHunger,
                    happiness: newHappiness
                  };
                }
                return p;
              });
            } else if (updatedOwnedPets.length > 0) {
              updatedOwnedPets[0] = {
                ...updatedOwnedPets[0],
                hunger: newHunger,
                happiness: newHappiness
              };
            }

            const updatedUser = {
              ...student,
              petHunger: newHunger,
              petHappiness: newHappiness,
              points: newPoints,
              xp: newXp,
              ownedPets: updatedOwnedPets
            };

            const students = state.students.map(s => s.id === updatedUser.id ? (updatedUser as Student) : s);
            setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(() => {});

            return {
              currentUser: updatedUser as any,
              students,
            };
          }
          return state;
        }),

      addPointsAndXP: (points, xp) =>
        set((state) => {
          const user = state.currentUser;
          if (user && (user.role === "STUDENT" || user.role === "GUEST")) {
            const student = user as Student;
            const newXp = student.xp + xp;
            const newPoints = student.points + points;
            const calculatedLevel = calculatePetLevel(newXp, newPoints);
            const oldLevel = student.petLevel || 1;
            const newLevel = Math.max(oldLevel, calculatedLevel);
            const isLevelUp = newLevel > oldLevel;

            let updatedOwnedPets = student.ownedPets || [];
            if (student.currentPetId) {
              updatedOwnedPets = updatedOwnedPets.map(p => {
                if (p.id === student.currentPetId) {
                  return { ...p, level: newLevel };
                }
                return p;
              });
            }

            const updatedUser: Student = {
              ...student,
              points: newPoints,
              xp: newXp,
              petLevel: newLevel,
              ownedPets: updatedOwnedPets,
            };

            const students = state.students.map(s => s.id === updatedUser.id ? updatedUser : s);
            setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(err => {
              console.error("Error saving addPointsAndXP to Firestore:", err);
            });

            return {
              currentUser: updatedUser as any,
              students,
              levelUpInfo: isLevelUp ? { level: newLevel, petName: student.petName || 'Pet' } : state.levelUpInfo
            };
          }
          return state;
        }),

      selectPet: (petId, petName) =>
        set((state) => {
          const user = state.currentUser;
          if (user && (user.role === "STUDENT" || user.role === "GUEST")) {
            const student = user as Student;
            const instanceId = Date.now().toString() + Math.random().toString().slice(2, 6);
            const newPet = {
              id: instanceId,
              templateId: petId,
              name: petName,
              level: 1,
              hunger: 50,
              happiness: 50,
              energy: 100,
              completedLessons: [],
              adoptedAt: new Date().toISOString()
            };
            
            let existingOwnedPets = student.ownedPets || [];
            if (student.currentPetId) {
              existingOwnedPets = existingOwnedPets.map(p => {
                if (p.id === student.currentPetId) {
                  return {
                    ...p,
                    level: student.petLevel,
                    hunger: student.petHunger,
                    happiness: student.petHappiness,
                    energy: student.petEnergy,
                    completedLessons: state.completedLessons
                  };
                }
                return p;
              });
            }

            const newOwnedPets = [...existingOwnedPets, newPet];
            
            const updatedUser = {
                ...student,
                petId, 
                currentPetId: instanceId,
                petName,
                petLevel: 1,
                petHunger: 50,
                petHappiness: 50,
                petEnergy: 100,
                ownedPets: newOwnedPets
            };
            
            const students = state.students.map(s => s.id === updatedUser.id ? (updatedUser as Student) : s);
            setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(() => {});
            
            return {
              currentUser: updatedUser as any,
              students,
              completedLessons: []
            };
          }
          return state;
        }),

      resumePet: (instanceId: string) =>
        set((state) => {
          const user = state.currentUser as any;
          if (user && (user.role === "STUDENT" || user.role === "GUEST")) {
            const student = user as Student;
            const ownedPets = student.ownedPets || [];
            
            let updatedOwnedPets = ownedPets;
            if (student.currentPetId) {
              updatedOwnedPets = updatedOwnedPets.map(p => {
                if (p.id === student.currentPetId) {
                  return {
                    ...p,
                    level: student.petLevel,
                    hunger: student.petHunger,
                    happiness: student.petHappiness,
                    energy: student.petEnergy,
                    feedCount: student.petFeedCount || 0,
                    completedLessons: state.completedLessons
                  };
                }
                return p;
              });
            }

            const targetPet = updatedOwnedPets.find((p: any) => p.id === instanceId);
            if (targetPet) {
              const finalLevel = Math.max(student.petLevel || 1, targetPet.level || 1);
              const updatedUser = {
                ...student,
                petId: targetPet.templateId,
                currentPetId: targetPet.id,
                petName: targetPet.name,
                petLevel: finalLevel,
                petHunger: targetPet.hunger,
                petHappiness: targetPet.happiness,
                petEnergy: targetPet.energy,
                petFeedCount: targetPet.feedCount || 0,
                ownedPets: updatedOwnedPets
              };
              
              const students = state.students.map(s => s.id === updatedUser.id ? (updatedUser as Student) : s);
              setDoc(doc(db, 'students', updatedUser.id), cleanFirestoreData(updatedUser), { merge: true }).catch(() => {});
              return { 
                currentUser: updatedUser, 
                students,
                completedLessons: targetPet.completedLessons || []
              };
            }
          }
          return state;
        }),

      deleteUser: async (id, role) => {
        try {
          const col = (role === 'TEACHER' || role === 'ADMIN') ? "users" : "students";
          await deleteDoc(doc(db, col, id));
          set((state) => {
            if (role === "STUDENT") {
              return { students: state.students.filter((s) => s.id !== id) };
            }
            return { users: state.users.filter((u) => u.id !== id) };
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, 'users/students');
        }
      },
      sendMessage: (msg) => {
        const newMsg = {
          ...msg,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          isRead: false,
          isArchived: false,
        };
        setDoc(doc(db, 'messages', newMsg.id), cleanFirestoreData(newMsg)).catch((err) => {
          console.warn("Could not save message to Firestore:", err);
        });
        set((state) => ({
          messages: [newMsg, ...state.messages],
        }));
      },
      archiveMessage: (id) => {
        updateDoc(doc(db, 'messages', id), { isArchived: true }).catch((err) => {
          console.warn("Could not archive message in Firestore:", err);
        });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isArchived: true } : m
          ),
        }));
      },
      markMessageRead: (id) => {
        updateDoc(doc(db, 'messages', id), { isRead: true }).catch((err) => {
          console.warn("Could not mark message as read in Firestore:", err);
        });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          ),
        }));
      },
      addStudentTask: (task) => {
        const newTask = {
          ...task,
          id: Date.now().toString(),
          status: 'PENDING' as const,
          createdAt: new Date().toISOString(),
        };
        setDoc(doc(db, 'studentTasks', newTask.id), cleanFirestoreData(newTask)).catch((err) => {
          console.warn("Could not save studentTask to Firestore:", err);
        });
        set((state) => ({
          studentTasks: [newTask, ...state.studentTasks],
        }));
      },
      rewardStudent: (studentId, points, xp, note) => {
        const currentStudent = get().students.find((s) => s.id === studentId);
        if (currentStudent) {
          const updatedStudent = {
            ...currentStudent,
            points: (currentStudent.points || 0) + points,
            xp: (currentStudent.xp || 0) + xp,
          };
          setDoc(doc(db, 'students', studentId), cleanFirestoreData(updatedStudent), { merge: true }).catch((err) => {
            console.warn("Could not sync rewardStudent to Firestore:", err);
          });
          set((state) => ({
            students: state.students.map((s) =>
              s.id === studentId ? updatedStudent : s
            ),
            currentUser: state.currentUser?.id === studentId
              ? { ...state.currentUser, points: (state.currentUser as any).points + points, xp: (state.currentUser as any).xp + xp }
              : state.currentUser,
          }));
        }
      },
      };
    },
    {
      name: "vuong-quoc-pet-storage-v2",
    },
  ),
);
