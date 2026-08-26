import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export const createCrudActions = (set: any) => ({
  addUser: async (user: any) => {
    try {
      const col = user.role === "STUDENT" ? "students" : "users";
      await setDoc(doc(db, col, user.id), user);
      set((state: any) => {
        if (user.role === "STUDENT")
          return { students: [...state.students, user] };
        return { users: [...state.users, user] };
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
});
