import React, { useState } from 'react';
import { Box, Plus, Trash2, Edit3, Link } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../../components/Modal';
import { Space3D } from '../../types';

export default function AdminSpaces3D() {
  const { spaces3D, addSpace3D, updateSpace3D, deleteSpace3D } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space3D | null>(null);
  const [formData, setFormData] = useState<Partial<Space3D>>({ title: '', url: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpace) {
      updateSpace3D(editingSpace.id, formData);
    } else {
      addSpace3D({
        id: Date.now().toString(),
        title: formData.title || '',
        url: formData.url || '',
        description: formData.description || '',
        createdAt: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 flex-1 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#1E3A8A]">Quản lý Không Gian 3D</h1>
        <button 
          onClick={() => {
            setEditingSpace(null);
            setFormData({ title: '', url: '', description: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2"
        >
          <Plus size={20} /> Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
        {(spaces3D || []).map(space => (
          <div key={space.id} className="bg-white p-6 rounded-3xl shadow-md border-4 border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{space.title}</h3>
            {space.url && (
              <div className="text-sm text-blue-500 mb-4 flex items-center gap-1 truncate" title={space.url}>
                <Link size={14} /> {space.url.substring(0, 30)}...
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{space.description}</p>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => {
                  setEditingSpace(space);
                  setFormData(space);
                  setIsModalOpen(true);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <Edit3 size={16} /> Sửa
              </button>
              <button 
                onClick={() => {
                  if (confirm('Xác nhận xóa?')) deleteSpace3D(space.id);
                }}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={true} title={editingSpace ? "Sửa không gian 3D" : "Thêm không gian 3D"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên không gian</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Link iFrame / File (Sketchfab, 3D viewer, ...)</label>
              <input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả thêm</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none" rows={3}></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600">Lưu thông tin</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
