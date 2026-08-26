import React, { useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, Video, Gamepad2, HelpCircle } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import { Question } from "../../types";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";

export default function AdminLessons() {
  const { lessons, mapNodes, users, addLesson, updateLesson, deleteLesson, currentUser } =
    useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mapNodeId: mapNodes[0]?.id || "",
    rewardXp: 50,
    rewardPoints: 10,
    videoUrl: "",
    gameUrl: "",
    reviewerId: "",
    status: "PENDING" as any,
    questions: [] as Question[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStatus = formData.reviewerId ? "PENDING" : "PUBLISHED";
    const dataToSave = { ...formData, status: finalStatus };
    
    if (editingLesson) {
      updateLesson(editingLesson.id, dataToSave);
    } else {
      addLesson({
        id: Date.now().toString(),
        ...dataToSave,
        order: lessons.length + 1,
        authorId: currentUser?.id || "admin",
      });
    }
    setIsModalOpen(false);
  };

  const openAdd = () => {
    setEditingLesson(null);
    setFormData({
      name: "",
      description: "",
      mapNodeId: mapNodes[0]?.id || "",
      rewardXp: 50,
      rewardPoints: 10,
      videoUrl: "",
      gameUrl: "",
      reviewerId: "",
      status: "PENDING" as any,
      questions: [],
    });
    setIsModalOpen(true);
  };

  const openEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      name: lesson.name || lesson.title,
      description: lesson.description || "",
      mapNodeId: lesson.mapNodeId || mapNodes[0]?.id || "",
      rewardXp: lesson.rewardXp || 50,
      rewardPoints: lesson.rewardPoints || 10,
      videoUrl: lesson.videoUrl || "",
      gameUrl: lesson.gameUrl || "",
      reviewerId: lesson.reviewerId || "",
      status: lesson.status,
      questions: lesson.questions || [],
    });
    setIsModalOpen(true);
  };

  const teachers = users.filter(u => u.role === "TEACHER");

  const addQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      type: "MULTIPLE_CHOICE",
      content: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      level: "RECOGNITION",
      status: "PUBLISHED"
    };
    setFormData({ ...formData, questions: [...formData.questions, newQ] });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQs = [...formData.questions];
    newQs[index] = { ...newQs[index], ...updates };
    setFormData({ ...formData, questions: newQs });
  };

  const removeQuestion = (index: number) => {
    const newQs = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQs });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <BookOpen size={32} className="text-[#F59E0B]" />
          Quản Lý Bài Học
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
        >
          <Plus size={20} /> Thêm Bài Học
        </button>
      </div>
      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#FDE68A] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEF3C7] text-[#92400E]">
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Tên bài học
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Thuộc Chặng
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Nội dung
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A] text-right">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.length > 0 ? (
              lessons.map((lesson: any) => (
                <tr
                  key={lesson.id}
                  className="border-b border-gray-100 hover:bg-orange-50"
                >
                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {lesson.name || lesson.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {lesson.description}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#1E3A8A]">
                    {mapNodes.find((n) => n.id === lesson.mapNodeId)?.name ||
                      "Chưa gán"}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600 flex gap-2">
                    {lesson.videoUrl && <Video size={16} className="text-blue-500" title="Có video" />}
                    {lesson.gameUrl && <Gamepad2 size={16} className="text-purple-500" title="Có trò chơi" />}
                    {lesson.questions?.length > 0 && (
                      <span className="flex items-center gap-1 text-orange-500" title="Có câu hỏi">
                        <HelpCircle size={16} /> {lesson.questions.length}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(lesson)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteId(lesson.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-400 font-bold"
                >
                  Chưa có bài học nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLesson ? "Sửa Bài Học" : "Thêm Bài Học Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên bài học
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Thuộc Chặng / Bản đồ
            </label>
            <select
              required
              value={formData.mapNodeId}
              onChange={(e) =>
                setFormData({ ...formData, mapNodeId: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            >
              <option value="">-- Chọn chặng học --</option>
              {mapNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Gửi duyệt cho (Chọn Giáo viên)
              </label>
              <select
                value={formData.reviewerId}
                onChange={(e) =>
                  setFormData({ ...formData, reviewerId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="">-- Không cần duyệt (Xuất bản luôn) --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Link Video bài giảng
                </label>
                <CloudinaryUploadButton
                  accept="video/*,audio/*"
                  label="Tải video/audio"
                  onUploadSuccess={(url) => setFormData({ ...formData, videoUrl: url })}
                />
              </div>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Link Trò chơi
                </label>
                <CloudinaryUploadButton
                  accept="image/*,video/*,.html,.zip"
                  label="Tải tài nguyên game"
                  onUploadSuccess={(url) => setFormData({ ...formData, gameUrl: url })}
                />
              </div>
              <input
                type="url"
                value={formData.gameUrl}
                onChange={(e) =>
                  setFormData({ ...formData, gameUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Mô tả (Không bắt buộc)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none h-20"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#92400E]">
                Câu hỏi ôn tập (Ngân hàng câu hỏi bài học)
              </label>
              <button
                type="button"
                onClick={addQuestion}
                className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-bold flex items-center gap-1"
              >
                <Plus size={16} /> Thêm câu hỏi
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.questions.map((q, idx) => (
                <div key={q.id} className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    required
                    type="text"
                    placeholder="Nhập nội dung câu hỏi..."
                    value={q.content}
                    onChange={(e) => updateQuestion(idx, { content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3"
                  />
                  <div className="space-y-2 pl-4 border-l-2 border-orange-200">
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctOptionIndex === optIdx}
                          onChange={() => updateQuestion(idx, { correctOptionIndex: optIdx })}
                          className="w-4 h-4 text-orange-500"
                        />
                        <input
                          required
                          type="text"
                          placeholder={`Đáp án ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(q.options || [])];
                            newOpts[optIdx] = e.target.value;
                            updateQuestion(idx, { options: newOpts });
                          }}
                          className="flex-1 px-3 py-1 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {formData.questions.length === 0 && (
                <div className="text-center text-sm text-gray-500 italic py-4">
                  Chưa có câu hỏi ôn tập nào.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4 sticky bottom-0 bg-white pb-2">
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
              {editingLesson ? "Lưu Thay Đổi" : "Tạo Mới"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if(deleteId) deleteLesson(deleteId); }}
        title="Xóa Bài Học"
        message="Bạn có chắc chắn muốn xóa bài học này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
