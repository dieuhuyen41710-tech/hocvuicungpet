import React, { useState } from 'react';
import { Gamepad2, Plus, Trash2, Edit3, Link as LinkIcon, Map, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../../components/Modal';
import { MiniGame } from '../../types';
import CloudinaryUploadButton from '../../components/CloudinaryUploadButton';

export default function AdminMiniGames() {
  const { miniGames, addMiniGame, updateMiniGame, deleteMiniGame, lessons, mapNodes, updateLesson } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [editingGame, setEditingGame] = useState<MiniGame | null>(null);
  const [formData, setFormData] = useState<Partial<MiniGame> & { mapNodeId?: string; lessonId?: string }>({ 
    title: '', url: '', description: '', mapNodeId: '', lessonId: '' 
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGame) {
      updateMiniGame(editingGame.id, {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        thumbnail: formData.thumbnail
      });
      if (formData.lessonId) {
        updateLesson(formData.lessonId, { gameUrl: formData.url });
      }
    } else {
      const newGame = {
        id: Date.now().toString(),
        title: formData.title || '',
        url: formData.url || '',
        description: formData.description || '',
        thumbnail: formData.thumbnail || '',
        createdAt: new Date().toISOString()
      };
      addMiniGame(newGame);
      if (formData.lessonId) {
        updateLesson(formData.lessonId, { gameUrl: newGame.url });
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 flex-1 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#1E3A8A]">Quản lý Mini Game</h1>
        <button 
          onClick={() => {
            setEditingGame(null);
            setFormData({ title: '', url: '', description: '', mapNodeId: '', lessonId: '' });
            setIsModalOpen(true);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2"
        >
          <Plus size={20} /> Thêm Game mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
        {(miniGames || []).map(game => {
          // Find attached lesson if any
          const attachedLesson = lessons.find(l => l.gameUrl === game.url);
          
          return (
          <div key={game.id} className="bg-white p-6 rounded-3xl shadow-md border-4 border-gray-100 flex flex-col">
            {game.thumbnail ? (
              <img src={game.thumbnail} className="w-full h-32 object-cover rounded-2xl mb-4 border-2 border-gray-100" alt={game.title} />
            ) : (
              <div className="w-full h-32 bg-purple-50 rounded-2xl mb-4 flex items-center justify-center border-2 border-purple-100">
                <Gamepad2 size={40} className="text-purple-200" />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Gamepad2 className="text-purple-500 shrink-0" size={20} /> <span className="truncate">{game.title}</span>
            </h3>
            {game.url && (
              <div className="text-sm text-purple-500 mb-4 flex items-center gap-1 truncate" title={game.url}>
                <LinkIcon size={14} /> {game.url.substring(0, 30)}...
              </div>
            )}
            
            {attachedLesson && (
              <div className="mb-4 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                <Map size={14} /> Đã gắn: {attachedLesson.name}
              </div>
            )}

            <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{game.description}</p>
            
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => {
                  setEditingGame(game);
                  const relatedLesson = lessons.find(l => l.gameUrl === game.url);
                  setFormData({ 
                    ...game, 
                    mapNodeId: relatedLesson?.mapNodeId || '',
                    lessonId: relatedLesson?.id || ''
                  });
                  setIsModalOpen(true);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <Edit3 size={16} /> Sửa
              </button>
              <button 
                onClick={() => {
                  if (confirm('Xác nhận xóa?')) deleteMiniGame(game.id);
                }}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        )})}
      </div>

      {isModalOpen && (
        <Modal isOpen={true} title={editingGame ? "Sửa Mini Game" : "Thêm Mini Game"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên Game</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Link Game (URL hoặc iFrame)</label>
              <input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả thêm</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl resize-none" rows={2}></textarea>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">Ảnh minh họa</label>
                <CloudinaryUploadButton
                  accept="image/*"
                  label="Tải ảnh Cloudinary"
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                />
              </div>
              <input 
                type="text" 
                value={formData.thumbnail || ''} 
                onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                placeholder="https://link-anh... hoặc tải lên tự động" 
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl font-medium text-sm" 
              />
              {formData.thumbnail && (
                <div className="mt-2 relative inline-block">
                  <img src={formData.thumbnail} alt="Preview" className="h-20 w-auto rounded-xl object-cover border-2 border-gray-200 shadow-sm" />
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t-2 border-gray-100 mt-4">
               <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Map size={16}/> Tùy chọn gắn vào bài học</h4>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bản đồ (Map Node)</label>
                  <select 
                     value={formData.mapNodeId} 
                     onChange={e => setFormData({...formData, mapNodeId: e.target.value, lessonId: ''})} 
                     className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                  >
                     <option value="">-- Không gắn --</option>
                     {mapNodes.map(node => (
                     <option key={node.id} value={node.id}>{node.name}</option>
                     ))}
                  </select>
               </div>
               {formData.mapNodeId && (
                  <div className="mt-3">
                     <label className="block text-sm font-bold text-gray-700 mb-1">Bài học (Bắt buộc nếu chọn bản đồ)</label>
                     <select 
                     required={!!formData.mapNodeId}
                     value={formData.lessonId} 
                     onChange={e => setFormData({...formData, lessonId: e.target.value})} 
                     className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                     >
                     <option value="">-- Chọn Bài học --</option>
                     {lessons.filter(l => l.mapNodeId === formData.mapNodeId).map(lesson => (
                        <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                     ))}
                     </select>
                  </div>
               )}
            </div>

            <button type="submit" className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 mt-6">Lưu Game</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
