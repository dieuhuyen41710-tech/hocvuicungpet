import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, cleanFirestoreData } from './firebase';
import { mockSettings, mockSubjects, mockMapNodes, mockLessons, mockPets, mockMiniGames, mockUsers, mockStudents } from '../data/mockData';
import { calculatePetLevelByFeedings } from './petUtils';

export async function initializeFirestoreData(set: any) {
  try {
    // 1. Ratings
    try {
      const ratingsSnap = await getDocs(collection(db, 'ratings'));
      const ratings = ratingsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ ratings });
    } catch (err) {
      console.warn("Could not sync ratings from Firestore:", err);
    }

    // 2. Settings
    try {
      const settingsRef = doc(db, 'settings', 'config');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const firestoreData = settingsSnap.data() || {};
        set({ settings: { ...mockSettings, ...firestoreData } });
      } else {
        await setDoc(settingsRef, mockSettings);
        set({ settings: mockSettings });
      }
    } catch (err) {
      console.warn("Could not sync settings from Firestore, using defaults:", err);
      set({ settings: mockSettings });
    }

    // 3. MiniGames
    try {
      const miniGamesSnap = await getDocs(collection(db, 'miniGames'));
      if (!miniGamesSnap.empty) {
        const miniGames = miniGamesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ miniGames });
      } else {
        for (const game of mockMiniGames) {
          await setDoc(doc(db, 'miniGames', game.id), game);
        }
        set({ miniGames: mockMiniGames });
      }
    } catch (err) {
      console.warn("Could not sync miniGames from Firestore:", err);
      set({ miniGames: mockMiniGames });
    }

    // 4. Subjects
    try {
      const subjectsSnap = await getDocs(collection(db, 'subjects'));
      if (!subjectsSnap.empty) {
        const subjects = subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ subjects });
      } else {
        for (const sub of mockSubjects) {
          await setDoc(doc(db, 'subjects', sub.id), sub);
        }
        set({ subjects: mockSubjects });
      }
    } catch (err) {
      console.warn("Could not sync subjects from Firestore:", err);
      set({ subjects: mockSubjects });
    }

    // 5. MapNodes
    try {
      const mapNodesSnap = await getDocs(collection(db, 'mapNodes'));
      if (!mapNodesSnap.empty) {
        const mapNodes = mapNodesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ mapNodes });
      } else {
        for (const node of mockMapNodes) {
          await setDoc(doc(db, 'mapNodes', node.id), node);
        }
        set({ mapNodes: mockMapNodes });
      }
    } catch (err) {
      console.warn("Could not sync mapNodes from Firestore:", err);
      set({ mapNodes: mockMapNodes });
    }

    // 6. Lessons
    try {
      const lessonsSnap = await getDocs(collection(db, 'lessons'));
      if (!lessonsSnap.empty) {
        const lessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ lessons });
      } else {
        for (const lesson of mockLessons) {
          await setDoc(doc(db, 'lessons', lesson.id), lesson);
        }
        set({ lessons: mockLessons });
      }
    } catch (err) {
      console.warn("Could not sync lessons from Firestore:", err);
      set({ lessons: mockLessons });
    }

    // 7. Spaces3D
    try {
      const spaces3DSnap = await getDocs(collection(db, 'spaces3D'));
      if (!spaces3DSnap.empty) {
        const spaces3D = spaces3DSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ spaces3D });
      } else {
        const initialSpaces = [
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
        ];
        for (const space of initialSpaces) {
          await setDoc(doc(db, 'spaces3D', space.id), space);
        }
        set({ spaces3D: initialSpaces });
      }
    } catch (err) {
      console.warn("Could not sync spaces3D from Firestore:", err);
    }

    // 8. Pets
    try {
      const petsSnap = await getDocs(collection(db, 'pets'));
      if (!petsSnap.empty) {
        const pets = petsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ pets });
      } else {
        for (const pet of mockPets) {
          await setDoc(doc(db, 'pets', pet.id), pet);
        }
        set({ pets: mockPets });
      }
    } catch (err) {
      console.warn("Could not sync pets from Firestore:", err);
      set({ pets: mockPets });
    }

    // 9. Users
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ users });
      } else {
        for (const user of mockUsers) {
          await setDoc(doc(db, 'users', user.id), user);
        }
        set({ users: mockUsers });
      }
    } catch (err) {
      console.warn("Could not sync users from Firestore:", err);
      set({ users: mockUsers });
    }

    // 10. Students
    try {
      const studentsSnap = await getDocs(collection(db, 'students'));
      if (!studentsSnap.empty) {
        const students = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set((state: any) => {
          let updatedCurrentUser = state.currentUser;
          if (updatedCurrentUser && updatedCurrentUser.role === 'STUDENT') {
            const fresh = students.find((s: any) => s.id === updatedCurrentUser.id || (s.username && s.username.toLowerCase() === updatedCurrentUser.username?.toLowerCase()));
            if (fresh) {
              const savedLevel = Math.max(updatedCurrentUser.petLevel || 1, (fresh as any).petLevel || 1);
              const activePet = (fresh as any).ownedPets?.find((p: any) => p.id === (fresh as any).currentPetId) || (fresh as any).ownedPets?.[0];
              const petLevelFromOwned = activePet?.level || 1;
              const feedCount = (fresh as any).petFeedCount || activePet?.feedCount || 0;
              const calculatedFeedLevel = calculatePetLevelByFeedings(feedCount, state.settings?.globalEvolutions);
              const finalLevel = Math.max(savedLevel, petLevelFromOwned, calculatedFeedLevel);
              
              updatedCurrentUser = { ...updatedCurrentUser, ...fresh, petLevel: finalLevel, petFeedCount: feedCount };
              if (activePet) {
                activePet.level = finalLevel;
                activePet.feedCount = feedCount;
              }
            }
          }
          return { students, currentUser: updatedCurrentUser };
        });
      } else {
        for (const student of mockStudents) {
          await setDoc(doc(db, 'students', student.id), cleanFirestoreData(student));
        }
        set({ students: mockStudents });
      }
    } catch (err) {
      console.warn("Could not sync students from Firestore:", err);
      set({ students: mockStudents });
    }

    // 11. Tests
    try {
      const testsSnap = await getDocs(collection(db, 'tests'));
      if (!testsSnap.empty) {
        const tests = testsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ tests });
      }
    } catch (err) {
      console.warn("Could not sync tests from Firestore:", err);
    }

    // 12. Messages (Mailbox)
    try {
      const messagesSnap = await getDocs(collection(db, 'messages'));
      if (!messagesSnap.empty) {
        const messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        messages.sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        set({ messages });
      }
    } catch (err) {
      console.warn("Could not sync messages from Firestore:", err);
    }

    // 13. Student Tasks
    try {
      const tasksSnap = await getDocs(collection(db, 'studentTasks'));
      if (!tasksSnap.empty) {
        const studentTasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ studentTasks });
      }
    } catch (err) {
      console.warn("Could not sync studentTasks from Firestore:", err);
    }

  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
}

