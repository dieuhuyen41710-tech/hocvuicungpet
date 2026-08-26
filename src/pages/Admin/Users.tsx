import React, { useState, useRef } from "react";
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Trash2,
  Edit3,
  Shield,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import * as XLSX from "xlsx";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";

export default function AdminUsers() {
  const { users, students, deleteUser, addUser, updateUser } = useAppStore();
  const allUsers = [...users, ...students];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
    class: "7A",
    subject: "Toán học",
  });

  const generateUsername = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return "user" + Date.now().toString().slice(-4);
    const last = parts.pop() || "";
    const initials = parts.map((p) => p[0]).join("");
    const base = (last + initials)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    return base + Math.floor(Math.random() * 1000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      let count = 0;
      data.forEach((row: any) => {
        const name = row["Họ Tên"] || row["Họ tên"] || row["Name"] || row["Tên"] || row["fullname"];
        const userClass = row["Lớp"] || row["Class"] || row["class"] || "7A";
        
        if (name && String(name).trim() !== "") {
          const username = generateUsername(String(name));
          const email = `${username}@school.local`;
          const password = username;
          addUser({
            id: Date.now().toString() + Math.random().toString(),
            fullName: String(name).trim(),
            username,
            email,
            password,
            role: "STUDENT",
            createdAt: new Date().toISOString(),
            class: String(userClass).trim(),
            points: 0,
            xp: 0,
            streak: 0,
            petLevel: 1,
            petHunger: 100,
            petHappiness: 100,
            petEnergy: 100,
          });
          count++;
        }
      });
      if (count > 0) {
        alert(`Đã nhập thành công ${count} tài khoản học sinh!`);
      } else {
        alert("Không tìm thấy dữ liệu hợp lệ trong file. Vui lòng kiểm tra lại mẫu (Cột 'Họ Tên' và 'Lớp').");
      }
    } catch (err) {
      alert("Có lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng.");
      console.error(err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, editingUser.role, formData);
      alert("Cập nhật thành công!");
    } else {
      addUser({
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        ...(formData.role === "STUDENT"
          ? {
              points: 0,
              xp: 0,
              streak: 0,
              petLevel: 1,
              petHunger: 100,
              petHappiness: 100,
              petEnergy: 100,
            }
          : {}),
      });
      alert("Thêm thành công!");
    }
    setIsModalOpen(false);
  };

  const openAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "STUDENT",
      class: "7A",
      subject: "Toán học",
    });
    setIsModalOpen(true);
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      password: user.password || "",
      role: user.role || "STUDENT",
      class: user.class || "7A",
      subject: user.subject || "Toán học",
    });
    setIsModalOpen(true);
  };

  const [deleteData, setDeleteData] = useState<{id: string, role: string} | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <Users size={32} className="text-[#F59E0B]" />
          Quản Lý Người Dùng & Phân Quyền
        </h1>
        <div className="flex gap-3 flex-wrap">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => {
              const ws = XLSX.utils.json_to_sheet([{ "Họ Tên": "Nguyễn Văn A", "Lớp": "7A" }]);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "DanhSach");
              XLSX.writeFile(wb, "Template_HocSinh.xlsx");
            }}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors"
          >
            <FileSpreadsheet size={20} /> Tải Mẫu
          </button>
          <button
            onClick={() => {
              const exportData = allUsers.map(u => ({
                "Họ Tên": u.fullName,
                "Tài Khoản": u.username,
                "Email": u.email || "",
                "Mật Khẩu": (u as any).password || u.username,
                "Vai Trò": u.role,
                "Thông Tin Chi Tiết": u.role === 'STUDENT' ? (u as any).class : (u.role === 'TEACHER' ? (u as any).subject : 'Admin')
              }));
              const ws = XLSX.utils.json_to_sheet(exportData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "DanhSachTaiKhoan");
              XLSX.writeFile(wb, "DanhSachTatCaTaiKhoan.xlsx");
            }}
            className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-[#059669] transition-colors"
          >
            <FileSpreadsheet size={20} /> Xuất Danh Sách
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#8B5CF6] text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-[#7C3AED] transition-colors"
          >
            <FileSpreadsheet size={20} /> Nhập Excel
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
          >
            <UserPlus size={20} /> Thêm Tài Khoản
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#FEF3C7] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEF3C7] text-[#92400E]">
              <th className="p-4 font-black border-b border-amber-100">Họ và Tên</th>
              <th className="p-4 font-black border-b border-amber-100">Tài khoản / Email</th>
              <th className="p-4 font-black border-b border-amber-100">Phân quyền (Role)</th>
              <th className="p-4 font-black border-b border-amber-100">Thông tin động</th>
              <th className="p-4 font-black border-b border-amber-100 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.length > 0 ? (
              allUsers.map((user: any, idx: number) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-100 hover:bg-amber-50/50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      {user.fullName?.[0] || 'U'}
                    </div>
                    <div>
                      <span>{user.fullName}</span>
                      <span className="block text-xs text-gray-400 font-normal">ID: {user.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-700 block text-sm">{user.username}</span>
                    <span className="text-xs text-blue-600 font-medium">{user.email || 'Chưa có email'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'TEACHER'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield size={12} />
                      {user.role === 'ADMIN' ? 'Admin (Quản trị)' : user.role === 'TEACHER' ? 'User loại 1 (Giáo viên)' : 'User loại 2 (Học sinh)'}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-600">
                    {user.role === 'STUDENT' && <span className="text-blue-600">Lớp: {user.class || '7A'}</span>}
                    {user.role === 'TEACHER' && <span className="text-emerald-600">Chuyên môn: {user.subject || 'Chưa cập nhật'}</span>}
                    {user.role === 'ADMIN' && <span className="text-purple-600">Toàn quyền hệ thống</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Sửa"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteData({ id: user.id, role: user.role })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                  Chưa có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Sửa Tài Khoản & Phân Quyền" : "Thêm Tài Khoản Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Họ & Tên
            </label>
            <input
              required
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email (Dùng đăng nhập Firebase Auth)
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="example@school.edu.vn"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tên đăng nhập (Username)
              </label>
              <input
                required
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="VD: nguyenvana"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
                placeholder="Mật khẩu tài khoản"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Phân Quyền (Role)
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none font-bold text-[#92400E]"
              >
                <option value="STUDENT">User loại 2 (Học sinh)</option>
                <option value="TEACHER">User loại 1 (Giáo viên)</option>
                <option value="ADMIN">Admin (Quản trị viên)</option>
              </select>
            </div>

            {formData.role === "TEACHER" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Thông tin A (Môn giảng dạy / Chuyên môn)
                </label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="VD: Toán, Ngữ văn, Tin học..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            )}

            {formData.role === "STUDENT" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Thông tin B (Lớp)
                </label>
                <input
                  required
                  type="text"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  placeholder="VD: 7A, 8B..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] shadow-md"
            >
              {editingUser ? "Cập Nhật" : "Thêm Mới"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteData} 
        onClose={() => setDeleteData(null)}
        onCancel={() => setDeleteData(null)}
        onConfirm={() => { if(deleteData) deleteUser(deleteData.id, deleteData.role); }}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
