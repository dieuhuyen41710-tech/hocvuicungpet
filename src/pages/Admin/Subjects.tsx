import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../../components/Modal';
import { Subject } from '../../types';
import CloudinaryUploadButton from '../../components/CloudinaryUploadButton';

export default function AdminSubjects() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppStore() as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    description: '',
    grade: 'Khối 6',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: formData.name,
        description: formData.description || '',
        grade: formData.grade || 'Khối 6',
        imageUrl: formData.imageUrl || ''
      });
    } else {
      const newSubject: Subject = {
        id: 'sub_' + Date.now(),
        name: formData.name,
        description: formData.description || '',
        grade: formData.grade || 'Khối 6',
        imageUrl: formData.imageUrl || ''
      };
      addSubject(newSubject);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 flex-1 h-full flex flex-col">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border-4 border-[#FEF3C7]">
        <div>
          <h1 className="text-3xl font-black text-[#1E3A8A] uppercase tracking-tight">Quản lý Môn học</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Thêm và cấu trúc các môn học cho bản đồ học tập</p>
        </div>
        <button 
          onClick={() => {
            setEditingSubject(null);
            setFormData({ name: '', description: '', grade: 'Khối 6', imageUrl: '' });
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_#B45309] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 uppercase text-sm tracking-wider"
        >
          <Plus size={20} /> Thêm Môn Học
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
        {(subjects || []).map((sub: Subject) => (
          <div key={sub.id} className="bg-white p-6 rounded-[28px] shadow-lg border-4 border-[#FEF3C7] flex flex-col hover:border-amber-300 transition-all">
            {sub.imageUrl ? (
              <img src={sub.imageUrl} alt={sub.name} className="w-full h-40 object-cover rounded-2xl mb-4 border-2 border-amber-200 shadow" />
            ) : (
              <div className="w-full h-40 bg-amber-50 rounded-2xl mb-4 flex items-center justify-center border-2 border-amber-200 text-amber-500 shadow-inner">
                <BookOpen size={56} />
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {sub.grade || 'Môn học chung'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#1E3A8A] mb-2">{sub.name}</h3>
            <p className="text-sm font-medium text-gray-600 mb-6 flex-1">{sub.description || 'Chưa có mô tả môn học.'}</p>

            <div className="flex gap-2 pt-4 border-t-2 border-amber-100 mt-auto">
              <button 
                onClick={() => {
                  setEditingSubject(sub);
                  setFormData(sub);
                  setIsModalOpen(true);
                }}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-sm"
              >
                <Edit3 size={16} /> Sửa
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Xác nhận xóa môn học "${sub.name}"?`)) {
                    deleteSubject(sub.id);
                  }
                }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-sm"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={true} title={editingSubject ? "Sửa thông tin Môn học" : "Thêm Môn học mới"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tên Môn học</label>
              <input 
                required 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="VD: Toán học 6, Ngữ văn 6..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-800 focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Khối lớp / Cấp độ</label>
              <select 
                value={formData.grade || 'Khối 6'} 
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-800 focus:border-amber-500 focus:outline-none bg-white"
              >
                <option value="Khối 6">Khối 6</option>
                <option value="Khối 7">Khối 7</option>
                <option value="Khối 8">Khối 8</option>
                <option value="Khối 9">Khối 9</option>
                <option value="Tất cả khối">Tất cả khối</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mô tả môn học</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Giới thiệu ngắn gọn về môn học..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-800 focus:border-amber-500 focus:outline-none resize-none" 
                rows={3}
              ></textarea>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 uppercase">Ảnh đại diện môn học</label>
                <CloudinaryUploadButton
                  accept="image/*"
                  label="Tải ảnh Cloudinary"
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
              </div>
              <input 
                type="text" 
                value={formData.imageUrl || ''} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="Hoặc dán URL ảnh trực tiếp..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-amber-500 focus:outline-none" 
              />
              {formData.imageUrl && (
                <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border-2 border-amber-200">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-md transition-all uppercase tracking-wider"
              >
                {editingSubject ? "Lưu thay đổi" : "Thêm môn học"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
