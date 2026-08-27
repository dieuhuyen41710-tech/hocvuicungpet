import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Settings as SettingsIcon, Save, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default function AdminSettings() {
  const { settings, updateSettings } = useAppStore();
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studyLimitMinutes" ? parseInt(value) || 0 : value,
    }));
    setIsSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingField(fieldName);
      try {
        const url = await uploadToCloudinary(file);
        setFormData(prev => ({ ...prev, [fieldName]: url }));
        setIsSaved(false);
      } catch (err: any) {
        alert('Tải ảnh lên Cloudinary thất bại: ' + err.message);
      } finally {
        setUploadingField(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-[#D97706]">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#92400E]">
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-[#D97706] font-bold">
            Thay đổi cấu hình của Học vui cùng Pet
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[32px] shadow-sm border-4 border-[#FDE68A] space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-black text-[#92400E] border-b-2 border-[#FEF3C7] pb-2">
            Thông tin chung & Lời chào mừng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Tên Website
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Trường Học
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Người Sáng Lập
              </label>
              <input
                type="text"
                name="founder"
                value={formData.founder}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Số Zalo Liên Hệ
              </label>
              <input
                type="text"
                name="zalo"
                value={formData.zalo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="text-sm font-bold text-gray-700 uppercase">
              Lời chào mừng quản trị viên (Tùy chỉnh theo giai đoạn sử dụng website)
            </label>
            <textarea
              name="adminWelcomeMessage"
              value={formData.adminWelcomeMessage || ''}
              onChange={(e: any) => {
                setFormData(prev => ({ ...prev, adminWelcomeMessage: e.target.value }));
                setIsSaved(false);
              }}
              rows={3}
              placeholder="Nhập lời chào mừng cho từng giai đoạn..."
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Tiêu đề Chào mừng trang chủ Học sinh
              </label>
              <input
                type="text"
                name="studentWelcomeTitle"
                value={formData.studentWelcomeTitle || ''}
                onChange={(e: any) => {
                  setFormData(prev => ({ ...prev, studentWelcomeTitle: e.target.value }));
                  setIsSaved(false);
                }}
                placeholder="VD: Chào mừng bạn đến với Vương quốc Pet tri thức!"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Phụ đề Chào mừng trang chủ Học sinh
              </label>
              <input
                type="text"
                name="studentWelcomeSubtitle"
                value={formData.studentWelcomeSubtitle || ''}
                onChange={(e: any) => {
                  setFormData(prev => ({ ...prev, studentWelcomeSubtitle: e.target.value }));
                  setIsSaved(false);
                }}
                placeholder="VD: Hãy học tập chăm chỉ để nuôi Pet lớn khôn..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
          </div>
        </div>

        {/* Global Pet Evolutions */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b-2 border-[#FEF3C7] pb-2">
            <h2 className="text-xl font-black text-[#92400E]">
              Cấp độ tiến hóa chung cho tất cả Thú Cưng
            </h2>
            <button
              type="button"
              onClick={() => {
                const currentEvos = formData.globalEvolutions || [];
                setFormData({
                  ...formData,
                  globalEvolutions: [
                    ...currentEvos,
                    { level: currentEvos.length + 2, name: '' }
                  ]
                });
                setIsSaved(false);
              }}
              className="bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold px-4 py-2 rounded-xl text-sm"
            >
              + Thêm cấp tiến hóa chung
            </button>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Thiết lập các cấp độ tiến hoá chung này để áp dụng nhanh cho tất cả các Pet trong hệ thống mà không cần lập trình từng Pet riêng lẻ.
          </p>

          <div className="space-y-3">
            {(formData.globalEvolutions || []).map((evo, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="w-24">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Cấp độ</label>
                  <input
                    type="number"
                    value={evo.level}
                    onChange={(e) => {
                      const currentEvos = [...(formData.globalEvolutions || [])];
                      currentEvos[idx] = { ...currentEvos[idx], level: parseInt(e.target.value) || 0 };
                      setFormData({ ...formData, globalEvolutions: currentEvos });
                      setIsSaved(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Tên dạng tiến hóa</label>
                  <input
                    type="text"
                    value={evo.name}
                    onChange={(e) => {
                      const currentEvos = [...(formData.globalEvolutions || [])];
                      currentEvos[idx] = { ...currentEvos[idx], name: e.target.value };
                      setFormData({ ...formData, globalEvolutions: currentEvos });
                      setIsSaved(false);
                    }}
                    placeholder="VD: Thỏ Tinh Anh"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-sm"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Số lần cho ăn</label>
                  <input
                    type="number"
                    value={evo.requiredFeedings ?? (evo.level * 3)}
                    onChange={(e) => {
                      const currentEvos = [...(formData.globalEvolutions || [])];
                      currentEvos[idx] = { ...currentEvos[idx], requiredFeedings: parseInt(e.target.value) || 0 };
                      setFormData({ ...formData, globalEvolutions: currentEvos });
                      setIsSaved(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-sm text-center"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const currentEvos = [...(formData.globalEvolutions || [])];
                    currentEvos.splice(idx, 1);
                    setFormData({ ...formData, globalEvolutions: currentEvos });
                    setIsSaved(false);
                  }}
                  className="mt-5 p-2 text-red-500 hover:bg-red-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-black text-[#92400E] border-b-2 border-[#FEF3C7] pb-2">
            Cấu hình Pet & Học tập
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Thời gian học tối đa (phút)
              </label>
              <input
                type="number"
                name="studyLimitMinutes"
                value={formData.studyLimitMinutes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Pet ngủ (Bắt đầu)
              </label>
              <input
                type="time"
                name="petSleepStart"
                value={formData.petSleepStart}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Pet ngủ (Kết thúc)
              </label>
              <input
                type="time"
                name="petSleepEnd"
                value={formData.petSleepEnd}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pt-8 border-t-2 border-[#FEF3C7]">
          {/* Logo */}
          <div className="space-y-2">
            <label className="block font-black text-gray-700 text-sm uppercase tracking-wide">
              Logo Website
            </label>
            <div className="flex items-center gap-4">
              {formData.logoUrl && (
                <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded border-2 border-gray-200" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl || ''}
                  onChange={handleChange}
                  placeholder="Link ảnh (VD: https://...)"
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937] text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logoUrl')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#FEF3C7] file:text-[#92400E] hover:file:bg-[#FDE68A]"
                />
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <label className="block font-black text-gray-700 text-sm uppercase tracking-wide">
              Ảnh Nền Đăng nhập / Giao diện chính
            </label>
            <div className="flex items-center gap-4">
              {formData.backgroundUrl && (
                <img src={formData.backgroundUrl} alt="Bg" className="w-16 h-16 object-cover rounded border-2 border-gray-200" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  name="backgroundUrl"
                  value={formData.backgroundUrl || ''}
                  onChange={handleChange}
                  placeholder="Link ảnh (VD: https://...)"
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FCD34D] font-bold text-[#1F2937] text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'backgroundUrl')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#FEF3C7] file:text-[#92400E] hover:file:bg-[#FDE68A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Poster Website Giới thiệu (Hiển thị trang đăng nhập) */}
        <div className="space-y-2 pt-6 border-t-2 border-[#FEF3C7]">
          <label className="block font-black text-gray-700 text-sm uppercase tracking-wide">
            Ảnh Poster Giới thiệu Website (Hiển thị nguyên bản ở nửa trái trang Đăng nhập)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
            {formData.posterUrl && (
              <img src={formData.posterUrl} alt="Poster" className="w-32 h-32 object-cover rounded-xl border-2 border-amber-300 shadow" />
            )}
            <div className="flex-1 space-y-2 w-full">
              <input
                type="text"
                name="posterUrl"
                value={formData.posterUrl || ''}
                onChange={handleChange}
                placeholder="Link ảnh poster (VD: https://... hoặc tải lên)"
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-[#D97706] font-bold text-[#1F2937] text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'posterUrl')}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-[#F59E0B] file:text-white hover:file:bg-[#D97706] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-[#FEF3C7] flex items-center justify-between">
          {isSaved ? (
            <span className="font-bold text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2">
              ✓ Đã lưu thay đổi thành công!
            </span>
          ) : (
            <span className="text-sm text-gray-400 font-medium">
              Nhấn lưu để áp dụng thay đổi toàn hệ thống.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 bg-[#F59E0B] text-white font-black rounded-xl hover:bg-[#D97706] transition-colors shadow-[0_4px_0_#B45309] hover:translate-y-1 hover:shadow-none"
          >
            <Save size={20} /> LƯU CÀI ĐẶT
          </button>
        </div>
      </form>
    </div>
  );
}
