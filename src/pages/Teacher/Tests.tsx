import React, { useState } from "react";
import { FileText, Plus, Edit3, Trash2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";
import { Question } from "../../types";

export default function TeacherTests() {
  const { tests, addTest, updateTest, deleteTest, currentUser, lessons, mapNodes, users } = useAppStore();
  const teachers = users.filter(u => u.role === 'TEACHER');

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SELF_DESIGNED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 15,
    reviewerId: "",
    lessonId: "",
    mapNodeId: "",
    questions: [] as any[],
  });

  const filteredTests = tests.filter((test: any) => {
    if (!currentUser) return false;
    const isReviewer = test.reviewerId === currentUser.id;
    const isAuthor = test.authorId === currentUser.id || !test.authorId;

    if (activeTab === 'ALL') return isReviewer || isAuthor;
    if (activeTab === 'PENDING') return isReviewer && (test.status === 'PENDING' || test.status === 'PENDING_REVIEW');
    if (activeTab === 'APPROVED') return (isReviewer || isAuthor) && (test.status === 'APPROVED' || test.status === 'PUBLISHED');
    if (activeTab === 'REJECTED') return (isReviewer || isAuthor) && test.status === 'REJECTED';
    if (activeTab === 'SELF_DESIGNED') return isAuthor;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStatus = formData.reviewerId ? "PENDING_REVIEW" : "PUBLISHED";
    if (editingTest) {
      updateTest(editingTest.id, { ...formData, status: finalStatus });
    } else {
      addTest({
        id: Date.now().toString(),
        authorId: currentUser?.id,
        ...formData,
        status: finalStatus,
      } as any);
    }
    setIsModalOpen(false);
    setEditingTest(null);
  };

  const openAdd = () => {
    setEditingTest(null);
    setFormData({ title: "", description: "", duration: 15, reviewerId: '', lessonId: '', mapNodeId: '', questions: [] });
    setIsModalOpen(true);
  };

  const openEdit = (test: any) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || "",
      duration: test.duration || 15,
      reviewerId: test.reviewerId || "",
      lessonId: test.lessonId || '',
      mapNodeId: test.mapNodeId || '',
      questions: test.questions || [],
    });
    setIsModalOpen(true);
  };

  const addQuestion = (type: string) => {
    const newQuestion: any = {
      id: Date.now().toString(),
      type,
      content: "",
      level: "RECOGNITION",
      status: formData.reviewerId ? "PENDING_REVIEW" : "PUBLISHED",
    };

    if (type === "MULTIPLE_CHOICE") {
      newQuestion.options = ["", "", "", ""];
      newQuestion.correctOptionIndex = 0;
    } else if (type === "TRUE_FALSE") {
      newQuestion.options = ["Đúng", "Sai"];
      newQuestion.correctOptionIndex = 0;
    } else if (type === "FILL_BLANK") {
      newQuestion.fillBlankAnswers = [""];
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleApprove = (testId: string) => {
    updateTest(testId, { status: 'APPROVED' });
  };

  const handleReject = (testId: string) => {
    updateTest(testId, { status: 'REJECTED' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#065F46] flex items-center gap-3">
          <FileText size={32} className="text-[#10B981]" />
          Quản Lý Đề Kiểm Tra & Duyệt Đề
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#059669] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#047857] transition-colors"
        >
          <Plus size={20} /> Tạo Đề Kiểm Tra
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
              <th className="p-4 font-black border-b border-[#D1FAE5]">Tên Đề Kiểm Tra</th>
              <th className="p-4 font-black border-b border-[#D1FAE5]">Thời gian</th>
              <th className="p-4 font-black border-b border-[#D1FAE5]">Số câu hỏi</th>
              <th className="p-4 font-black border-b border-[#D1FAE5]">Trạng thái</th>
              <th className="p-4 font-black border-b border-[#D1FAE5] text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test: any, idx: number) => (
                <tr
                  key={test.id}
                  className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-4">
                    <span className="font-bold text-gray-800 block text-lg">
                      {test.title}
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      {test.description || "Không có mô tả"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-600">
                    {test.duration} Phút
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600">
                    {(test.questions || []).length} Câu
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      test.status === "PUBLISHED" || test.status === "APPROVED" 
                        ? "bg-green-100 text-green-600" 
                        : test.status === "REJECTED" 
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {test.status === "PUBLISHED" || test.status === "APPROVED" ? "Đã Xuất Bản" : test.status === "PENDING" || test.status === "PENDING_REVIEW" ? "Chờ Duyệt" : test.status === "REJECTED" ? "Từ Chối" : test.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {(test.status === 'PENDING' || test.status === 'PENDING_REVIEW') && test.reviewerId === currentUser?.id && (
                        <>
                          <button
                            onClick={() => handleApprove(test.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 font-bold text-sm border border-green-200"
                            title="Duyệt đề"
                          >
                            <CheckCircle size={18} /> Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(test.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 font-bold text-sm border border-red-200"
                            title="Từ chối"
                          >
                            <XCircle size={18} /> Từ chối
                          </button>
                        </>
                      )}
                      {(test.authorId === currentUser?.id || !test.authorId || test.reviewerId === currentUser?.id) && (
                        <button
                          onClick={() => openEdit(test)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                      {(test.authorId === currentUser?.id || !test.authorId) && (
                        <button
                          onClick={() => setDeleteId(test.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Xóa"
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
                <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                  Không có đề kiểm tra nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTest ? "Sửa Đề Kiểm Tra" : "Tạo Đề Kiểm Tra Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên đề kiểm tra</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Thời gian (Phút)</label>
              <input
                required
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Gửi duyệt cho giáo viên (Tùy chọn)</label>
              <select
                value={formData.reviewerId || ''}
                onChange={(e) => setFormData({ ...formData, reviewerId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              >
                <option value="">-- Không cần duyệt (Xuất bản luôn) --</option>
                {teachers.filter(t => t.id !== currentUser?.id).map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Gắn với bài học</label>
              <select
                value={formData.lessonId || ''}
                onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              >
                <option value="">-- Không gắn bài học cụ thể --</option>
                {lessons.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả / Hướng dẫn làm bài</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#059669] focus:outline-none"
              placeholder="Nhập mô tả đề kiểm tra..."
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-800">
                  Danh sách câu hỏi ({formData.questions.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addQuestion('MULTIPLE_CHOICE')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-bold text-xs border border-emerald-200"
                  >
                    + Trắc nghiệm
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion('TRUE_FALSE')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-xs border border-blue-200"
                  >
                    + Đúng/Sai
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion('FILL_BLANK')}
                    className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-bold text-xs border border-purple-200"
                  >
                    + Điền khuyết
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {formData.questions.map((q: any, qIdx: number) => (
                <div key={q.id || qIdx} className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-200 relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#065F46] text-sm">
                      Câu hỏi {qIdx + 1} ({q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.type === 'TRUE_FALSE' ? 'Đúng/Sai' : 'Điền khuyết'})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nội dung câu hỏi</label>
                    <textarea
                      rows={2}
                      value={q.content}
                      onChange={(e) => updateQuestion(qIdx, 'content', e.target.value)}
                      placeholder="Nhập nội dung câu hỏi..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#059669] focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-600">Hình ảnh minh họa (Tùy chọn)</label>
                        <CloudinaryUploadButton
                          accept="image/*"
                          label="Tải ảnh"
                          onUploadSuccess={(url) => updateQuestion(qIdx, 'imageUrl', url)}
                        />
                      </div>
                      <input
                        type="url"
                        value={q.imageUrl || ''}
                        onChange={(e) => updateQuestion(qIdx, 'imageUrl', e.target.value)}
                        placeholder="Link ảnh minh họa..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#059669] focus:outline-none text-sm"
                      />
                      {q.imageUrl && (
                        <div className="mt-2 h-20 w-auto inline-block border rounded-lg overflow-hidden bg-white">
                          <img src={q.imageUrl} alt="Preview" className="h-full w-auto object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {q.type === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-600">Các đáp án (chọn đáp án đúng)</label>
                      {q.options.map((opt: string, oIdx: number) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={q.correctOptionIndex === oIdx}
                            onChange={() => updateQuestion(qIdx, 'correctOptionIndex', oIdx)}
                            className="w-4 h-4 text-[#059669]"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[oIdx] = e.target.value;
                              updateQuestion(qIdx, 'options', newOpts);
                            }}
                            placeholder={`Đáp án ${oIdx + 1}`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#059669]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'TRUE_FALSE' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-600">Đáp án đúng</label>
                      <select
                        value={q.correctOptionIndex ?? 0}
                        onChange={(e) => updateQuestion(qIdx, 'correctOptionIndex', parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#059669]"
                      >
                        <option value={0}>Đúng</option>
                        <option value={1}>Sai</option>
                      </select>
                    </div>
                  )}

                  {q.type === 'FILL_BLANK' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Đáp án điền khuyết chính xác</label>
                      <input
                        type="text"
                        value={q.fillBlankAnswers?.[0] || ''}
                        onChange={(e) => updateQuestion(qIdx, 'fillBlankAnswers', [e.target.value])}
                        placeholder="Nhập từ/cụm từ đáp án..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#059669]"
                      />
                    </div>
                  )}
                </div>
              ))}

              {formData.questions.length === 0 && (
                <div className="text-center py-6 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                  Chưa có câu hỏi nào. Hãy bấm thêm câu hỏi phía trên.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#047857]"
            >
              Lưu Đề Kiểm Tra
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteTest(deleteId);
            setDeleteId(null);
          }
        }}
        title="Xóa đề kiểm tra"
        message="Bạn có chắc chắn muốn xóa đề kiểm tra này không?"
      />
    </div>
  );
}
