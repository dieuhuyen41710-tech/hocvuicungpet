import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Shield,
  PlusCircle,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";
import PetAvatar from "../../components/PetAvatar";

export default function AdminPets() {
  const { pets, addPet, updatePet, deletePet, settings } = useAppStore();

  const handleApplyGlobalToAll = () => {
    if (confirm("Xác nhận áp dụng cấp độ tiến hóa chung từ Cài đặt hệ thống cho TẤT CẢ các Thú Cưng hiện có?")) {
      const globalEvos = settings.globalEvolutions || [];
      pets.forEach((pet: any) => {
        updatePet(pet.id, { evolutions: globalEvos });
      });
      alert("Đã áp dụng tiến hóa chung cho toàn bộ thú cưng thành công!");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    baseImageUrl: "🦄",
    description: "",
    element: "Mộc",
    maxLevel: 5,
    evolutions: [] as { level: number; name: string; imageUrl: string }[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPet) {
      updatePet(editingPet.id, formData);
    } else {
      addPet({
        id: Date.now().toString(),
        ...formData,
      });
    }
    setIsModalOpen(false);
  };

  const openAdd = () => {
    setEditingPet(null);
    setFormData({
      name: "",
      baseImageUrl: "🦄",
      description: "",
      element: "Mộc",
      maxLevel: 5,
      evolutions: [],
    });
    setIsModalOpen(true);
  };

  const openEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      baseImageUrl: pet.baseImageUrl,
      description: pet.description || "",
      element: pet.element || "Mộc",
      maxLevel: pet.maxLevel || 5,
      evolutions: pet.evolutions || [],
    });
    setIsModalOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const addEvolution = () => {
    setFormData({
      ...formData,
      evolutions: [
        ...formData.evolutions,
        { level: formData.evolutions.length + 2, name: "", imageUrl: "✨" },
      ],
    });
  };

  const updateEvolution = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newEvolutions = [...formData.evolutions];
    newEvolutions[index] = { ...newEvolutions[index], [field]: value };
    setFormData({ ...formData, evolutions: newEvolutions });
  };

  const removeEvolution = (index: number) => {
    const newEvolutions = [...formData.evolutions];
    newEvolutions.splice(index, 1);
    setFormData({ ...formData, evolutions: newEvolutions });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <Sparkles size={32} className="text-[#F59E0B]" />
          Quản Lý Thú Cưng
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyGlobalToAll}
            className="flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 px-5 py-3 rounded-xl font-bold hover:bg-amber-200 transition-colors shadow-sm"
          >
            ⚡ Áp dụng tiến hóa chung cho tất cả Pet
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
          >
            <Plus size={20} /> Thêm Thú Cưng
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#FDE68A] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FEF3C7] text-[#92400E]">
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Thú Cưng
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A]">Hệ</th>
              <th className="p-4 font-black border-b border-[#FDE68A]">
                Tiến Hóa
              </th>
              <th className="p-4 font-black border-b border-[#FDE68A] text-right">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {(pets || []).length > 0 ? (
              (pets || []).map((pet: any) => (
                <tr
                  key={pet.id}
                  className="border-b border-gray-100 hover:bg-orange-50"
                >
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                      <PetAvatar src={pet.baseImageUrl} className="w-full h-full text-3xl" imgClassName="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        {pet.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pet.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs">
                      {pet.element || "Cơ bản"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-600">
                    Cấp tối đa: {pet.maxLevel || 5} <br />
                    {(pet.evolutions || []).length} dạng tiến hóa
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(pet)}
                        className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
                        title="Sửa Thú Cưng"
                      >
                        <Edit3 size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-red-200"
                        title="Xóa Thú Cưng"
                      >
                        <Trash2 size={16} /> Xóa
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
                  Chưa có thú cưng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPet ? "Sửa Thú Cưng" : "Thêm Thú Cưng Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tên thú cưng
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Biểu tượng / Ảnh Pet (Emoji hoặc URL)
                </label>
                <CloudinaryUploadButton
                  accept="image/*"
                  label="Tải ảnh Cloudinary"
                  onUploadSuccess={(url) => setFormData({ ...formData, baseImageUrl: url })}
                />
              </div>
              <input
                required
                type="text"
                value={formData.baseImageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, baseImageUrl: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
                placeholder="Nhập emoji (🦄) hoặc link ảnh / Cloudinary"
              />
              {formData.baseImageUrl && formData.baseImageUrl.startsWith('http') && (
                <div className="mt-2 relative inline-block">
                  <img src={formData.baseImageUrl} alt="Preview" className="h-16 w-auto rounded-xl object-cover border-2 border-gray-200 shadow-sm" />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Hệ / Thuộc tính
              </label>
              <input
                required
                type="text"
                value={formData.element}
                onChange={(e) =>
                  setFormData({ ...formData, element: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Cấp độ tối đa
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.maxLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxLevel: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none h-20"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <label className="block text-sm font-bold text-gray-700">
                Các dạng tiến hóa
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, evolutions: settings.globalEvolutions || [] })}
                  className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  ⚡ Dùng tiến hóa chung
                </button>
                <button
                  type="button"
                  onClick={addEvolution}
                  className="flex items-center gap-1 text-sm font-bold text-[#F59E0B] hover:text-[#D97706]"
                >
                  <PlusCircle size={16} /> Thêm tiến hóa
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.evolutions.map((evo, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="w-24">
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Cấp độ
                    </label>
                    <input
                      type="number"
                      value={evo.level}
                      onChange={(e) =>
                        updateEvolution(
                          idx,
                          "level",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#F59E0B] focus:outline-none text-sm font-bold text-center"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-500">
                        Hình ảnh minh họa (URL / Cloudinary)
                      </label>
                      <CloudinaryUploadButton
                        accept="image/*"
                        label="Tải ảnh"
                        onUploadSuccess={(url) => updateEvolution(idx, "imageUrl", url)}
                      />
                    </div>
                    <input
                      type="text"
                      value={evo.imageUrl}
                      onChange={(e) =>
                        updateEvolution(idx, "imageUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#F59E0B] focus:outline-none text-sm"
                      placeholder="Link hình ảnh hoặc emoji"
                    />
                    {evo.imageUrl && (
                      <div className="mt-2 h-12 w-12 overflow-hidden rounded-xl border-2 border-amber-200 bg-white flex items-center justify-center shadow-sm">
                        <PetAvatar src={evo.imageUrl} className="w-full h-full text-xl" imgClassName="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvolution(idx)}
                    className="mt-6 p-2 text-red-500 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {formData.evolutions.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  Chưa có dạng tiến hóa nào được thiết lập.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
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
              {editingPet ? "Lưu Thay Đổi" : "Tạo Mới"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { if(deleteId) deletePet(deleteId); }}
        title="Xóa Thú Cưng"
        message="Bạn có chắc chắn muốn xóa Thú cưng này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
