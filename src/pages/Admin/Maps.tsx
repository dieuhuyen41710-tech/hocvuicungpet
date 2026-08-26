import React, { useState } from "react";
import { Map, Plus, Edit3, Trash2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";

export default function AdminMaps() {
  const { mapNodes, subjects, addMapNode, updateMapNode, deleteMapNode } =
    useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subjectId: subjects[0]?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNode) {
      updateMapNode(editingNode.id, formData);
    } else {
      addMapNode({
        id: Date.now().toString(),
        ...formData,
        order: mapNodes.length + 1,
      });
    }
    setIsModalOpen(false);
  };

  const openAdd = () => {
    setEditingNode(null);
    setFormData({
      name: "",
      description: "",
      subjectId: subjects[0]?.id || "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (node: any) => {
    setEditingNode(node);
    setFormData({
      name: node.name,
      description: node.description,
      subjectId: node.subjectId,
    });
    setIsModalOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <Map size={32} className="text-[#F59E0B]" />
          Quản Lý Bản Đồ (Chặng học)
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
        >
          <Plus size={20} /> Thêm Bản Đồ
        </button>
      </div>
      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#FDE68A] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEF3C7] text-[#92400E]">
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Thứ tự
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Tên Chặng / Bản Đồ
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Môn học
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A] text-right">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {mapNodes.length > 0 ? (
              mapNodes.map((node: any, idx: number) => (
                <tr
                  key={node.id}
                  className="border-b border-gray-100 hover:bg-orange-50"
                >
                  <td className="p-4 font-bold text-gray-500">#{idx + 1}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{node.name}</div>
                    <div className="text-xs text-gray-500">
                      {node.description}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#1E3A8A]">
                    {subjects.find((s) => s.id === node.subjectId)?.name ||
                      "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(node)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(node.id)}
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
                  Chưa có bản đồ học tập nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNode ? "Sửa Bản Đồ" : "Thêm Bản Đồ Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên chặng / bản đồ
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              placeholder="VD: Chương 1: Số hữu tỉ"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Thuộc môn học
            </label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({ ...formData, subjectId: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none h-24"
            />
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
              {editingNode ? "Lưu Thay Đổi" : "Tạo Mới"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if(deleteId) deleteMapNode(deleteId); }}
        title="Xóa Bản Đồ"
        message="Bạn có chắc chắn muốn xóa bản đồ này? Các bài học bên trong có thể bị mất liên kết."
      />
    </div>
  );
}
