import React from 'react';
import { Navigate } from 'react-router';
import { useAppStore } from '../store/useAppStore';

export default function Home() {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'STUDENT') return <Navigate to="/student" replace />;
  if (currentUser.role === 'TEACHER') return <Navigate to="/teacher" replace />;
  if (currentUser.role === 'ADMIN') return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
}
