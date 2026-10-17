import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { Home, Users, BookOpen, FileText, Mail, LogOut, Settings, BarChart2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import AppTitleLogo from '../AppTitleLogo';

export default function TeacherLayout() {
  const { logout, currentUser, settings } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/teacher', icon: <Home size={28} />, label: 'Tổng quan' },
    { to: '/teacher/students', icon: <Users size={28} />, label: 'Học sinh' },
    { to: '/teacher/lessons', icon: <BookOpen size={28} />, label: 'Bài giảng' },
    { to: '/teacher/tests', icon: <FileText size={28} />, label: 'Đề kiểm tra' },
    { to: '/teacher/analytics', icon: <BarChart2 size={28} />, label: 'Thống kê' },
    { to: '/teacher/mailbox', icon: <Mail size={28} />, label: 'Hòm thư' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F0FDF4] text-[#1F2937] font-sans flex flex-col select-none relative overflow-x-hidden" style={settings.backgroundUrl ? { backgroundImage: `url(${settings.backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
      {settings.backgroundUrl && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0"></div>}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
      <header className="h-20 bg-white border-b-4 border-[#D1FAE5] px-4 md:px-6 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#34D399] to-[#10B981] rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shrink-0 cursor-pointer" onClick={() => navigate('/teacher')}>👨‍🏫</div>
          <div className="hidden lg:block">
            <AppTitleLogo size="sm" roleSuffix="Giáo Viên" />
          </div>
        </div>

        <div className="flex items-center gap-4 lg:border-l-2 lg:border-[#E5E7EB] lg:pl-6 shrink-0 ml-auto">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-gray-400 uppercase">Giáo viên</p>
            <p className="font-bold text-[#065F46]">{currentUser?.fullName}</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Đăng xuất"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#A7F3D0] rounded-full border-2 md:border-4 border-white shadow-inner flex items-center justify-center text-[#065F46] hover:scale-105 transition-transform"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        <nav className="w-20 md:w-24 bg-white border-r-4 border-[#D1FAE5] hidden md:flex flex-col items-center py-8 gap-6 z-10 sticky top-20 h-[calc(100vh-5rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/teacher'}
              className={({ isActive }) =>
                `w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#D1FAE5] text-[#059669] shadow-md hover:scale-110 border-2 border-[#6EE7B7]'
                    : 'bg-[#F0FDF4] text-gray-400 hover:bg-[#D1FAE5] hover:text-[#059669]'
                }`
              }
              title={item.label}
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 flex justify-center relative">
          <div className="w-full max-w-6xl pb-20 md:pb-0 flex flex-col">
             <Outlet />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#D1FAE5] flex justify-around p-2 z-40 pb-safe">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/teacher'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#D1FAE5] text-[#059669] shadow-md -translate-y-2'
                    : 'opacity-50 hover:opacity-100 text-gray-400 hover:bg-[#F0FDF4]'
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
      </div>
      </div>
    </div>
  );
}
