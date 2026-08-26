import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { User, Users, Shield, Settings, Activity } from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const currentUser = useAppStore((state) => state.currentUser);
  const settings = useAppStore((state) => state.settings);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] shadow-sm border-4 border-[#FDE68A]">
        <div className="w-16 h-16 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-[#D97706] text-3xl">
          🛡️
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#92400E]">
            Quản trị hệ thống, {currentUser?.fullName}!
          </h1>
          <p className="text-[#D97706] font-bold mt-1">
            {settings.adminWelcomeMessage || "Quản lý tổng quan - Pet Tri Thức"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4 cursor-pointer hover:border-[#D97706] hover:scale-105 transition-all"
          onClick={() => navigate("/admin/users")}
        >
          <div className="w-12 h-12 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">
              Tổng người dùng
            </p>
            <p className="text-2xl font-black text-[#92400E]">1,248</p>
          </div>
        </div>
        <div
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4 cursor-pointer hover:border-[#D97706] hover:scale-105 transition-all"
          onClick={() => navigate("/admin/settings")}
        >
          <div className="w-12 h-12 bg-[#E0E7FF] text-[#4F46E5] rounded-xl flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">
              Cấu hình hệ thống
            </p>
            <p className="text-xl font-black text-[#3730A3]">
              Hoạt động ổn định
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ECFCCB] text-[#65A30D] rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Máy chủ</p>
            <p className="text-2xl font-black text-[#3F6212]">Trực tuyến</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border-4 border-[#FDE68A] p-8">
        <h2 className="text-2xl font-black text-[#92400E] mb-6">
          Trạng thái gần đây
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-[#F9FAFB] rounded-2xl border border-gray-100">
            <h3 className="font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <User size={18} className="text-[#3B82F6]" /> Người dùng mới (Hôm
              nay)
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-[#3B82F6]">+42</span>
              <span className="text-sm font-bold text-gray-400 mb-1">
                học sinh
              </span>
            </div>
          </div>
          <div className="p-5 bg-[#F9FAFB] rounded-2xl border border-gray-100">
            <h3 className="font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <Shield size={18} className="text-[#10B981]" /> Cảnh báo bảo mật
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
                ✓
              </div>
              <p className="font-bold text-[#065F46]">
                Không có vấn đề bảo mật nào được phát hiện trong 7 ngày qua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
