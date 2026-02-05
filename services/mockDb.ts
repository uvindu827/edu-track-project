
import { Teacher } from '../types';

const STORAGE_KEY = 'edutrack_teachers';

const getStoredTeachers = (): Teacher[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setStoredTeachers = (teachers: Teacher[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
};

export const teacherService = {
  getAll: async (): Promise<Teacher[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredTeachers()), 300);
    });
  },

  getById: async (id: string): Promise<Teacher | undefined> => {
    return new Promise((resolve) => {
      const teachers = getStoredTeachers();
      setTimeout(() => resolve(teachers.find(t => t.id === id)), 200);
    });
  },

  add: async (teacher: Omit<Teacher, 'id' | 'createdAt'>): Promise<Teacher> => {
    return new Promise((resolve) => {
      const teachers = getStoredTeachers();
      const newTeacher: Teacher = {
        ...teacher,
        id: 'TCH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: Date.now(),
      };
      const updated = [...teachers, newTeacher];
      setStoredTeachers(updated);
      setTimeout(() => resolve(newTeacher), 400);
    });
  },

  update: async (id: string, updates: Partial<Teacher>): Promise<void> => {
    return new Promise((resolve) => {
      const teachers = getStoredTeachers();
      const updated = teachers.map(t => t.id === id ? { ...t, ...updates } : t);
      setStoredTeachers(updated);
      setTimeout(resolve, 300);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const teachers = getStoredTeachers();
      const filtered = teachers.filter(t => t.id !== id);
      setStoredTeachers(filtered);
      setTimeout(resolve, 300);
    });
  }
};
