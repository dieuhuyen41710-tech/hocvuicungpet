import React, { useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, Video, Gamepad2, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import { Question } from "../../types";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";

export default function TeacherLessons() {
  const { lessons, mapNodes, addLesson, updateLesson, deleteLesson, currentUser } =
    useAppStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SELF_DESIGNED'>('ALL');
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
    questions: [] as Question[],
  });

  const filteredLessons = lessons.filter(lesson => {
    if (!currentUser) return false;
    const isReviewer = lesson.reviewerId === currentUser.id;
    const isAuthor = lesson.authorId === currentUser.id;

    if (activeTab === 'ALL') return isReviewer || isAuthor;
    if (activeTab === 'PENDING') return isReviewer && lesson.status === 'PENDING';
    if (activeTab === 'APPROVED') return (isReviewer || isAuthor) && (lesson.status === 'APPROVED' || lesson.status === 'PUBLISHED');
    if (activeTab === 'REJECTED') return (isReviewer || isAuthor) && lesson.status === 'REJECTED';
    if (activeTab === 'SELF_DESIGNED') return isAuthor;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      updateLesson(editingLesson.id, formData);
    } else {
      const newLesson = {
        ...formData,
        id: Date.now().toString(),
        authorId: currentUser?.id || 'teacher1',
        order: lessons.length,
        status: "PUBLISHED", // Teacher's own lessons might be published automatically or need admin review. Let's assume published.
      };
      addLesson(newLesson as any);
    }
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const openEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      name: lesson.name,
      description: lesson.description || "",
      mapNodeId: lesson.mapNodeId,
      rewardXp: lesson.rewardXp || 50,
      rewardPoints: lesson.rewardPoints || 10,
      videoUrl: lesson.videoUrl || "",
      gameUrl: lesson.gameUrl || "",
      questions: lesson.questions || [],
    });
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingLesson(null);
    setFormData({
      name: "",
      description: "",
      mapNodeId: mapNodes[0]?.id || "",
      rewardXp: 50,
      rewardPoints: 10,
      videoUrl: "",
      gameUrl: "",
      questions: [],
    });
    setIsModalOpen(true);
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      type: "MULTIPLE_CHOICE",
      content: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      level: "RECOGNITION",
      status: "PUBLISHED" as any
    };
    setFormData({ ...formData, questions: [...formData.questions, newQ] });
  };

  const updateQuestion = (idx: number, data: Partial<Question>) => {
    const newQs = [...formData.questions];
    newQs[idx] = { ...newQs[idx], ...data };
    setFormData({ ...formData, questions: newQs });
  };

  const removeQuestion = (idx: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== idx),
    });
  };

  const handleApprove = (lessonId: string) => {
    updateLesson(lessonId, { status: 'APPROVED' });
  };

  const handleReject = (lessonId: string) => {
    updateLesson(lessonId, { status: 'REJECTED' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#065F46] flex items-center gap-3">
          <BookOpen size={32} className="text-[#10B981]" />
          Quản Lý Bài Học
        </h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#059669] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#047857] transition-colors"
        >
          <Plus size={20} /> Tạo Bài Học Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border-4 border-[#D1FAE5] flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'PENDING', label: 'Chờ duyệt' },
          { id: 'APPROVED', label: 'Đã duyệt' },
          { id: 'REJECTED', label: 'Từ chối' },
          { id: 'SELF_DESIGNED', label: 'Tự thiết kế' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors border-2 ${
              activeTab === tab.id 
                ? 'bg-[#D1FAE5] text-[#059669] border-[#6EE7B7]' 
                : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#D1FAE5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#ECFDF5] text-[#065F46]">
              <th className="p-4 font-black border-b border-[#D1FAE5]">
                Tên Bài Học
              </th>
              <th className="p-4 font-black border-b border-[#D1FAE5]">
                Thuộc Chặng
              </th>
              <th className="p-4 font-black border-b border-[#D1FAE5]">
                Trạng Thái
              </th>
              <th className="p-4 font-black border-b border-[#D1FAE5] text-right">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson, idx) => (
                <tr
                  key={lesson.id}
                  className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-4">
                    <span className="font-bold text-gray-800 block">
                      {lesson.name}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-500">
                      {lesson.videoUrl && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <Video size={14} /> Video
                        </span>
                      )}
                      {lesson.gameUrl && (
                        <span className="flex items-center gap-1 text-purple-500">
                          <Gamepad2 size={14} /> Trò chơi
                        </span>
                      )}
                      {lesson.questions && lesson.questions.length > 0 && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <HelpCircle size={14} /> {lesson.questions.length} CH
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 font-bold">
                    {mapNodes.find((n) => n.id === lesson.mapNodeId)?.name ||
                      "---"}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lesson.status === "PUBLISHED" || lesson.status === "APPROVED" 
                        ? "bg-green-100 text-green-600" 
                        : lesson.status === "REJECTED" 
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {lesson.status === "PUBLISHED" || lesson.status === "APPROVED" ? "Đã Xuất Bản" : lesson.status === "PENDING" ? "Chờ Duyệt" : lesson.status === "REJECTED" ? "Từ Chối" : lesson.status}
                    </span>
                    {lesson.authorId !== currentUser?.id && (
                      <span className="block text-[10px] text-gray-400 mt-1 uppercase">Từ Quản trị viên</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {lesson.status === 'PENDING' && lesson.reviewerId === currentUser?.id && (
                        <>
                          <button
                            onClick={() => handleApprove(lesson.id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg flex items-center gap-1 font-bold text-sm border border-transparent hover:border-green-200"
                            title="Duyệt bài"
                          >
                            <CheckCircle size={18} /> Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(lesson.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1 font-bold text-sm border border-transparent hover:border-red-200"
                            title="Từ chối"
                          >
                            <XCircle size={18} /> Từ chối
                          </button>
                        </>
                      )}
                      {(lesson.authorId === currentUser?.id || lesson.reviewerId === currentUser?.id) && (
                        <button
                          onClick={() => openEdit(lesson)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                      {lesson.authorId === currentUser?.id && (
                        <button
                          onClick={() => setDeleteId(lesson.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Link Trò chơi
                </label>
                <CloudinaryUploadButton
                  accept="image/*,video/*,.html,.zip"
                  label="Tải game/tài nguyên"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none h-20"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#065F46]">
                Câu hỏi ôn tập (Ngân hàng câu hỏi bài học)
              </label>
              <button
                type="button"
                onClick={addQuestion}
                className="text-sm bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg font-bold flex items-center gap-1"
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
                  <div className="space-y-2 pl-4 border-l-2 border-emerald-200">
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctOptionIndex === optIdx}
                          onChange={() => updateQuestion(idx, { correctOptionIndex: optIdx })}
                          className="w-4 h-4 text-emerald-500"
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
              className="px-6 py-3 rounded-xl font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-md"
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
