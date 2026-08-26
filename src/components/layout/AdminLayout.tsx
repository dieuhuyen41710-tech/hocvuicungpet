import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { Home, Users, Settings, LogOut, Shield } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AdminLayout() {
  const { logout, currentUser, settings } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <Home size={28} />, label: 'Tổng quan' },
    { to: '/admin/users', icon: <Users size={28} />, label: 'Người dùng' },
    { to: '/admin/maps', icon: <span className="text-2xl font-bold">🗺️</span>, label: 'Bản đồ học tập' },
    { to: '/admin/lessons', icon: <span className="text-2xl font-bold">📚</span>, label: 'Bài học' },
    { to: '/admin/tests', icon: <span className="text-2xl font-bold">📝</span>, label: 'Đề kiểm tra' },
    { to: '/admin/pets', icon: <span className="text-2xl font-bold">🐾</span>, label: 'Thú cưng' },
    { to: '/admin/mailbox', icon: <span className="text-2xl font-bold">✉️</span>, label: 'Hòm thư' },
    { to: '/admin/spaces3d', icon: <span className="text-2xl font-bold">🧊</span>, label: 'Không gian 3D' },
    { to: '/admin/minigames', icon: <span className="text-2xl font-bold">🎮</span>, label: 'Mini Games' },
    { to: '/admin/settings', icon: <Settings size={28} />, label: 'Cài đặt hệ thống' },
  ];

  return (
    <div className="h-screen w-full bg-[#FFFBEB] text-[#1F2937] font-sans flex flex-col overflow-hidden select-none" style={settings.backgroundUrl ? { backgroundImage: `url(${settings.backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {settings.backgroundUrl && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0"></div>}
      <div className="relative z-10 w-full h-full flex flex-col">
      <header className="h-20 bg-white border-b-4 border-[#FEF3C7] px-4 md:px-6 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shrink-0 cursor-pointer overflow-hidden" onClick={() => navigate('/admin')}>
  {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : '🛡️'}
</div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-black text-[#92400E] tracking-tight uppercase leading-none">Học vui cùng Pet (Quản Trị)</h1>
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest">"Trường THCS Bằng Doãn"</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:border-l-2 lg:border-[#E5E7EB] lg:pl-6 shrink-0 ml-auto">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-gray-400 uppercase">Admin</p>
            <p className="font-bold text-[#92400E]">{currentUser?.fullName}</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Đăng xuất"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#FDE68A] rounded-full border-2 md:border-4 border-white shadow-inner flex items-center justify-center text-[#92400E] hover:scale-105 transition-transform"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <nav className="w-20 md:w-24 bg-white border-r-4 border-[#FEF3C7] hidden md:flex flex-col items-center py-8 gap-6 z-10 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#FEF3C7] text-[#D97706] shadow-md hover:scale-110 border-2 border-[#FCD34D]'
                    : 'bg-[#FFFBEB] text-gray-400 hover:bg-[#FEF3C7] hover:text-[#D97706]'
                }`
              }
              title={item.label}
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative">
          <div className="w-full max-w-6xl pb-20 md:pb-0 flex flex-col h-full">
             <Outlet />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#FEF3C7] flex justify-start p-2 z-40 pb-safe overflow-x-auto gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] w-14 h-14 shrink-0 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#FEF3C7] text-[#D97706] shadow-md -translate-y-2'
                    : 'opacity-50 hover:opacity-100 text-gray-400 hover:bg-[#FFFBEB]'
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
