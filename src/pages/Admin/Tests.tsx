import React, { useState } from "react";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  PlusCircle,
  AlignLeft,
  CheckSquare,
  Layers,
  HelpCircle,
  PenTool,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";

export default function AdminTests() {
  const { tests, addTest, updateTest, deleteTest, users, lessons, mapNodes } = useAppStore();
  const teachers = users.filter(u => u.role === 'TEACHER');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 15,
    reviewerId: "",
    lessonId: "",
    mapNodeId: "",
    questions: [] as any[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTest) {
      updateTest(editingTest.id, { ...formData, status: formData.reviewerId ? "PENDING_REVIEW" : "PUBLISHED" });
    } else {
      addTest({
        id: Date.now().toString(),
        ...formData,
        status: formData.reviewerId ? "PENDING_REVIEW" : "PUBLISHED",
      });
    }
    setIsModalOpen(false);
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

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
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
    } else if (type === "MATCHING") {
      newQuestion.matchingPairs = [
        { left: "", right: "" },
        { left: "", right: "" },
      ];
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <FileText size={32} className="text-[#F59E0B]" />
          Quản Lý Đề Kiểm Tra
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
        >
          <Plus size={20} /> Tạo Đề Kiểm Tra
        </button>
      </div>
      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#FDE68A] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEF3C7] text-[#92400E]">
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Tên Đề
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Thời Gian
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Số câu hỏi
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A] text-right">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {(tests || []).length > 0 ? (
              (tests || []).map((test: any) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 hover:bg-orange-50"
                >
                  <td className="p-4 font-bold text-gray-800">
                    {test.title}
                    <div className="text-xs text-gray-500 font-normal">
                      {test.description}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-600">
                    {test.duration} Phút
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600">
                    {(test.questions || []).length} Câu
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(test)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
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
                  Chưa có đề kiểm tra nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTest ? "Sửa Đề Kiểm Tra" : "Tạo Đề Kiểm Tra"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tên đề kiểm tra
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Thời gian (Phút)
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 15,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Gửi duyệt cho (Chọn Giáo viên)
              </label>
              <select
                value={formData.reviewerId || ''}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Gắn với Bài học tương ứng (Bắt buộc làm sau khi học bài)
              </label>
              <select
                value={formData.lessonId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, lessonId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="">-- Không gắn bài học cụ thể --</option>
                {lessons.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Gắn với Bản đồ học tập / Chủ đề
              </label>
              <select
                value={formData.mapNodeId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, mapNodeId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="">-- Không gắn chủ đề bản đồ --</option>
                {mapNodes.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-lg font-black text-gray-800">
                Danh sách câu hỏi ({formData.questions.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion("MULTIPLE_CHOICE")}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
                >
                  <CheckSquare size={16} /> Trắc nghiệm 4 PA
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("TRUE_FALSE")}
                  className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-green-100 transition-colors"
                >
                  <Layers size={16} /> Đúng / Sai
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("MATCHING")}
                  className="flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-purple-100 transition-colors"
                >
                  <PlusCircle size={16} /> Ghép nối
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("FILL_BLANK")}
                  className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-orange-100 transition-colors"
                >
                  <AlignLeft size={16} /> Điền khuyết
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("ESSAY")}
                  className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-rose-100 transition-colors"
                >
                  <PenTool size={16} /> Tự luận
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {formData.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gray-200 text-gray-700 font-black px-3 py-1 rounded-lg text-sm">
                      Câu {idx + 1}
                    </span>
                    <span className="font-bold text-[#F59E0B] text-sm">
                      {q.type === "MULTIPLE_CHOICE"
                        ? "Trắc nghiệm 4 Phương án"
                        : q.type === "TRUE_FALSE"
                          ? "Trắc nghiệm Đúng / Sai"
                          : q.type === "MATCHING"
                            ? "Trắc nghiệm Ghép nối"
                            : q.type === "FILL_BLANK"
                              ? "Trắc nghiệm Điền khuyết"
                              : "Câu hỏi Tự luận"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        Nội dung câu hỏi
                      </label>
                      <textarea
                        required
                        value={q.content}
                        onChange={(e) =>
                          updateQuestion(idx, "content", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#F59E0B] focus:outline-none text-sm min-h-[60px]"
                        placeholder="Nhập nội dung câu hỏi..."
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-500">
                          Ảnh minh hoạ câu hỏi (Tùy chọn)
                        </label>
                        <CloudinaryUploadButton
                          accept="image/*"
                          label="Tải ảnh Cloudinary"
                          onUploadSuccess={(url) => updateQuestion(idx, 'imageUrl', url)}
                        />
                      </div>
                      <input
                        type="text"
                        value={q.imageUrl || ''}
                        onChange={(e) =>
                          updateQuestion(idx, "imageUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#F59E0B] focus:outline-none text-sm"
                        placeholder="Link ảnh hoặc Cloudinary URL"
                      />
                      {q.imageUrl && (
                        <div className="mt-2 relative inline-block">
                          <img src={q.imageUrl} alt="Question illustration" className="h-20 w-auto rounded-lg object-cover border" />
                        </div>
                      )}
                    </div>

                    {q.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">
                          Các phương án (Chọn PA đúng)
                        </label>
                        {q.options?.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() =>
                                updateQuestion(
                                  idx,
                                  "correctOptionIndex",
                                  optIdx,
                                )
                              }
                              className="w-5 h-5 accent-[#F59E0B]"
                            />
                            <input
                              required
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...(q.options || [])];
                                newOpts[optIdx] = e.target.value;
                                updateQuestion(idx, "options", newOpts);
                              }}
                              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${q.correctOptionIndex === optIdx ? "border-[#F59E0B] bg-orange-50" : "border-gray-300"}`}
                              placeholder={`Phương án ${String.fromCharCode(65 + optIdx)}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === "TRUE_FALSE" && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">
                          Chọn phương án ĐÚNG
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <input
                              type="radio"
                              checked={q.correctOptionIndex === 0}
                              onChange={() =>
                                updateQuestion(idx, "correctOptionIndex", 0)
                              }
                              className="w-5 h-5 accent-[#F59E0B]"
                            />
                            <span className="font-bold text-green-600">
                              ĐÚNG
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <input
                              type="radio"
                              checked={q.correctOptionIndex === 1}
                              onChange={() =>
                                updateQuestion(idx, "correctOptionIndex", 1)
                              }
                              className="w-5 h-5 accent-[#F59E0B]"
                            />
                            <span className="font-bold text-red-600">SAI</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {q.type === "MATCHING" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-gray-500">
                            Các cặp ghép nối (Cột Trái - Cột Phải)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestion(idx, "matchingPairs", [
                                ...(q.matchingPairs || []),
                                { left: "", right: "" },
                              ])
                            }
                            className="text-xs font-bold text-blue-500"
                          >
                            + Thêm cặp
                          </button>
                        </div>
                        {q.matchingPairs?.map((pair: any, pIdx: number) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <input
                              required
                              type="text"
                              value={pair.left}
                              onChange={(e) => {
                                const newPairs = [...(q.matchingPairs || [])];
                                newPairs[pIdx].left = e.target.value;
                                updateQuestion(idx, "matchingPairs", newPairs);
                              }}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                              placeholder="Mục vế trái"
                            />
                            <span className="text-gray-400 font-bold">-</span>
                            <input
                              required
                              type="text"
                              value={pair.right}
                              onChange={(e) => {
                                const newPairs = [...(q.matchingPairs || [])];
                                newPairs[pIdx].right = e.target.value;
                                updateQuestion(idx, "matchingPairs", newPairs);
                              }}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                              placeholder="Mục vế phải tương ứng"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPairs = [...(q.matchingPairs || [])];
                                newPairs.splice(pIdx, 1);
                                updateQuestion(idx, "matchingPairs", newPairs);
                              }}
                              className="p-2 text-red-400 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === "FILL_BLANK" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-gray-500">
                            Các đáp án điền khuyết (Theo thứ tự [1], [2]...)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestion(idx, "fillBlankAnswers", [
                                ...(q.fillBlankAnswers || []),
                                "",
                              ])
                            }
                            className="text-xs font-bold text-blue-500"
                          >
                            + Thêm chỗ trống
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 italic mb-2">
                          Ghi chú: Trong nội dung câu hỏi, dùng{" "}
                          <strong>___</strong> để biểu diễn chỗ trống.
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {q.fillBlankAnswers?.map(
                            (ans: string, aIdx: number) => (
                              <div
                                key={aIdx}
                                className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg pl-2 pr-1 py-1"
                              >
                                <span className="text-xs font-bold text-gray-400">
                                  [{aIdx + 1}]
                                </span>
                                <input
                                  required
                                  type="text"
                                  value={ans}
                                  onChange={(e) => {
                                    const newAns = [
                                      ...(q.fillBlankAnswers || []),
                                    ];
                                    newAns[aIdx] = e.target.value;
                                    updateQuestion(
                                      idx,
                                      "fillBlankAnswers",
                                      newAns,
                                    );
                                  }}
                                  className="w-24 px-2 text-sm outline-none"
                                  placeholder="Đáp án"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newAns = [
                                      ...(q.fillBlankAnswers || []),
                                    ];
                                    newAns.splice(aIdx, 1);
                                    updateQuestion(
                                      idx,
                                      "fillBlankAnswers",
                                      newAns,
                                    );
                                  }}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {q.type === "ESSAY" && (
                      <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200 flex gap-2">
                        <HelpCircle size={18} className="shrink-0 mt-0.5" />
                        <span>
                          Câu hỏi tự luận sẽ yêu cầu học sinh nhập văn bản dài.
                          Giáo viên sẽ cần chấm điểm thủ công cho câu hỏi này.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {formData.questions.length === 0 && (
                <div className="text-center text-gray-400 font-bold py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  Hãy thêm câu hỏi để hoàn thiện đề kiểm tra
                </div>
              )}
            </div>
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
              {editingTest ? "Lưu Thay Đổi" : "Tạo Đề Kiểm Tra"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if(deleteId) deleteTest(deleteId); }}
        title="Xóa Bài Kiểm Tra"
        message="Bạn có chắc chắn muốn xóa bài kiểm tra này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
