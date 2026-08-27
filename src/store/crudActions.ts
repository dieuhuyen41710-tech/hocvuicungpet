import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const createCrudActions = (set: any) => ({
  addUser: async (user: any) => {
    try {
      const col = user.role === "STUDENT" ? "students" : "users";
      let finalUser = { ...user };

      // Create in Firebase Auth using secondary app so login works immediately without logging out current admin
      try {
        const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp_" + Date.now());
        const secondaryAuth = getAuth(secondaryApp);
        const pass = user.password && user.password.length >= 6 ? user.password : (user.username ? user.username + "123" : "123456");
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, user.email, pass);
        const authUid = userCredential.user.uid;
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);
        finalUser.id = authUid;
      } catch (authErr: any) {
        console.warn("Firebase Auth creation info (may already exist):", authErr.message);
      }

      await setDoc(doc(db, col, finalUser.id), finalUser);
      set((state: any) => {
        if (user.role === "STUDENT")
          return { students: [...state.students, finalUser] };
        return { users: [...state.users, finalUser] };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users/students');
    }
  },

  addLesson: async (lesson: any) => {
    try {
      await setDoc(doc(db, 'lessons', lesson.id), lesson);
      set((state: any) => ({ lessons: [...state.lessons, lesson] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'lessons');
    }
  },
  updateLesson: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'lessons', id), data);
      set((state: any) => ({
        lessons: state.lessons.map((l: any) =>
          l.id === id ? { ...l, ...data } : l,
        ),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'lessons');
    }
  },
  deleteLesson: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'lessons', id));
      set((state: any) => ({
        lessons: state.lessons.filter((l: any) => l.id !== id),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'lessons');
    }
  },

  addMapNode: async (node: any) => {
    try {
      await setDoc(doc(db, 'mapNodes', node.id), node);
      set((state: any) => ({ mapNodes: [...state.mapNodes, node] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'mapNodes');
    }
  },
  updateMapNode: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'mapNodes', id), data);
      set((state: any) => ({
        mapNodes: state.mapNodes.map((n: any) =>
          n.id === id ? { ...n, ...data } : n,
        ),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'mapNodes');
    }
  },
  deleteMapNode: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'mapNodes', id));
      set((state: any) => ({
        mapNodes: state.mapNodes.filter((n: any) => n.id !== id),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'mapNodes');
    }
  },

  addPet: async (pet: any) => {
    try {
      await setDoc(doc(db, 'pets', pet.id), pet);
      set((state: any) => ({ pets: [...(state.pets || []), pet] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pets');
    }
  },
  updatePet: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'pets', id), data);
      set((state: any) => ({
        pets: (state.pets || []).map((p: any) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'pets');
    }
  },
  deletePet: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pets', id));
      set((state: any) => ({
        pets: (state.pets || []).filter((p: any) => p.id !== id),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'pets');
    }
  },

  addTest: async (test: any) => {
    try {
      await setDoc(doc(db, 'tests', test.id), test);
      set((state: any) => ({ tests: [...(state.tests || []), test] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tests');
    }
  },
  updateTest: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'tests', id), data);
      set((state: any) => ({
        tests: (state.tests || []).map((t: any) =>
          t.id === id ? { ...t, ...data } : t,
        ),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tests');
    }
  },
  deleteTest: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tests', id));
      set((state: any) => ({
        tests: (state.tests || []).filter((t: any) => t.id !== id),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tests');
    }
  },

  addSubject: async (subject: any) => {
    try {
      await setDoc(doc(db, 'subjects', subject.id), subject);
      set((state: any) => ({ subjects: [...(state.subjects || []), subject] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'subjects');
    }
  },
  updateSubject: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'subjects', id), data);
      set((state: any) => ({
        subjects: (state.subjects || []).map((s: any) =>
          s.id === id ? { ...s, ...data } : s,
        ),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'subjects');
    }
  },
  deleteSubject: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
      set((state: any) => ({
        subjects: (state.subjects || []).filter((s: any) => s.id !== id),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'subjects');
    }
  },
});
