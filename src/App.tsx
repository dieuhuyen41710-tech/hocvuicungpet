/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import StudentLayout from './components/layout/StudentLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';

// Student Pages
import StudentHome from './pages/Student/Home';
import StudentDashboard from './pages/Student/Dashboard';
import PetCare from './pages/Student/PetCare';
import PetWorld from './pages/Student/PetWorld';
import DigitalTools from './pages/Student/DigitalTools';
import StudentMap from './pages/Student/Map';
import LessonView from './pages/Student/LessonView';
import Mailbox from './pages/Student/Mailbox';
import Achievements from './pages/Student/Achievements';
import MiniGame from './pages/Student/MiniGame';
import ThreeDViewer from './pages/Student/ThreeDViewer';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherStudents from './pages/Teacher/Students';
import TeacherLessons from './pages/Teacher/Lessons';
import TeacherTests from './pages/Teacher/Tests';
import TeacherMailbox from './pages/Teacher/Mailbox';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminSettings from './pages/Admin/Settings';
import AdminSpaces3D from './pages/Admin/Spaces3D';
import AdminMiniGames from './pages/Admin/MiniGames';
import AdminMaps from './pages/Admin/Maps';
import AdminLessons from './pages/Admin/Lessons';
import AdminTests from './pages/Admin/Tests';
import AdminPets from './pages/Admin/Pets';
import AdminMailbox from './pages/Admin/Mailbox';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'GUEST']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="pet" element={<PetCare />} />
            <Route path="pet-world" element={<PetWorld />} />
            <Route path="tools" element={<DigitalTools />} />
            <Route path="map" element={<StudentMap />} />
            <Route path="lesson/:id" element={<LessonView />} />
            <Route path="mailbox" element={<Mailbox />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="minigame" element={<MiniGame />} />
            <Route path="3d-viewer" element={<ThreeDViewer />} />
            <Route path="profile" element={<div className="p-8 text-center text-gray-500">Hồ sơ - Đang phát triển</div>} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="lessons" element={<TeacherLessons />} />
            <Route path="tests" element={<TeacherTests />} />
            <Route path="mailbox" element={<TeacherMailbox />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="maps" element={<AdminMaps />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="pets" element={<AdminPets />} />
            <Route path="mailbox" element={<AdminMailbox />} />
            <Route path="spaces3d" element={<AdminSpaces3D />} />
            <Route path="minigames" element={<AdminMiniGames />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="/403" element={<div className="p-8 text-center"><h1>403 - Không có quyền truy cập</h1></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

