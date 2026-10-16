import React, { useState } from 'react';
import { Box, Play, RotateCw, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ThreeDViewer() {
  const { spaces3D, active3DCommand, setScene3DCommand } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeSpace = (spaces3D || [])[activeIndex];

  // Auto-close overlay after 5 seconds
  React.useEffect(() => {
    if (active3DCommand) {
      const timer = setTimeout(() => setScene3DCommand(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [active3DCommand, setScene3DCommand]);

  return (
    <div className="space-y-4 w-full h-full flex flex-col flex-1">
      <div className="bg-white p-4 md:p-6 rounded-[32px] shadow-sm border-4 border-[#DBEAFE] flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EFF6FF] rounded-2xl flex items-center justify-center border-4 border-[#3B82F6] shadow-inner text-[#3B82F6]">
              <Box size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1E3A8A]">Không Gian 3D Trực Quan</h1>
              <p className="text-[#3B82F6] font-bold text-xs md:text-sm">Khám phá mô hình không gian 360/3D chi tiết</p>
            </div>
          </div>

          {(spaces3D || []).length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
              {(spaces3D || []).map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 py-2 rounded-xl border-2 font-bold text-xs md:text-sm transition-colors whitespace-nowrap ${
                    idx === activeIndex 
                      ? 'bg-[#EFF6FF] border-[#3B82F6] text-[#1E3A8A] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 bg-gray-900 rounded-3xl border-4 border-[#3B82F6]/30 overflow-hidden relative flex items-center justify-center group min-h-[400px] shadow-inner w-full">
          {active3DCommand && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-900/80 p-6 text-center">
              <div className="bg-white p-6 rounded-3xl max-w-sm shadow-2xl border-4 border-blue-400">
                <Box size={48} className="text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-black text-blue-900 mb-2">Pet đang minh họa: {active3DCommand.shape}</h2>
                <p className="text-sm text-blue-700">Lệnh: {active3DCommand.command}. Pet đang tập trung làm nổi bật các thành phần cần thiết cho cậu đó!</p>
              </div>
            </div>
          )}
          {activeSpace ? (
            <>
              <iframe 
                src={activeSpace.url} 
                className="w-full h-full absolute inset-0 border-0" 
                title={activeSpace.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              {/* Overlay hiển thị nút bấm nổi bật khi nhúng bị chặn */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 opacity-0 hover:opacity-100 transition-opacity">
                <a 
                  href={activeSpace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3B82F6] text-white px-8 py-4 rounded-full flex items-center gap-3 text-lg font-black hover:bg-[#2563EB] transition-all shadow-xl scale-110"
                >
                  Mở mô hình 3D toàn màn hình <ExternalLink size={20} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center p-6 relative z-10 text-white">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-2xl shadow-md border border-white/20 flex items-center justify-center mb-4 text-[#3B82F6] animate-spin-slow">
                <RotateCw size={48} />
              </div>
              <h3 className="text-xl font-black mb-2">Chưa có mô hình 3D nào</h3>
              <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto">
                Hãy đợi quản trị viên thêm không gian 3D mới để trải nghiệm nhé.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
