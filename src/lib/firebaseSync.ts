import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { mockSettings, mockSubjects, mockMapNodes, mockLessons, mockPets, mockMiniGames, mockUsers, mockStudents } from '../data/mockData';

export async function initializeFirestoreData(set: any) {
  try {
    // Settings
    const settingsRef = doc(db, 'settings', 'config');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      set({ settings: settingsSnap.data() });
    } else {
      await setDoc(settingsRef, mockSettings);
    }

    // MiniGames
    const miniGamesSnap = await getDocs(collection(db, 'miniGames'));
    if (!miniGamesSnap.empty) {
      const miniGames = miniGamesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ miniGames });
    } else {
      for (const game of mockMiniGames) {
        await setDoc(doc(db, 'miniGames', game.id), game);
      }
    }

    // Subjects
    const subjectsSnap = await getDocs(collection(db, 'subjects'));
    if (!subjectsSnap.empty) {
      const subjects = subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ subjects });
    } else {
      for (const sub of mockSubjects) {
        await setDoc(doc(db, 'subjects', sub.id), sub);
      }
    }

    // MapNodes
    const mapNodesSnap = await getDocs(collection(db, 'mapNodes'));
    if (!mapNodesSnap.empty) {
      const mapNodes = mapNodesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ mapNodes });
    } else {
      for (const node of mockMapNodes) {
        await setDoc(doc(db, 'mapNodes', node.id), node);
      }
    }

    // Lessons
    const lessonsSnap = await getDocs(collection(db, 'lessons'));
    if (!lessonsSnap.empty) {
      const lessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ lessons });
    } else {
      for (const lesson of mockLessons) {
        await setDoc(doc(db, 'lessons', lesson.id), lesson);
      }
    }

    // Pets
    const petsSnap = await getDocs(collection(db, 'pets'));
    if (!petsSnap.empty) {
      const pets = petsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ pets });
    } else {
      for (const pet of mockPets) {
        await setDoc(doc(db, 'pets', pet.id), pet);
      }
    }

    // Users
    const usersSnap = await getDocs(collection(db, 'users'));
    if (!usersSnap.empty) {
      const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ users });
    } else {
      for (const user of mockUsers) {
        await setDoc(doc(db, 'users', user.id), user);
      }
    }

    // Students
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (!studentsSnap.empty) {
      const students = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ students });
    } else {
      for (const student of mockStudents) {
        await setDoc(doc(db, 'students', student.id), student);
      }
    }

  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
}
