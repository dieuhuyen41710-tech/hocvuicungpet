import React, { useState } from 'react';
import { Box, Play, RotateCw, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ThreeDViewer() {
  const { spaces3D } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeSpace = (spaces3D || [])[activeIndex];

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
          {activeSpace ? (
            <>
              <iframe 
                src={activeSpace.url} 
                className="w-full h-full absolute inset-0 border-0" 
                title={activeSpace.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <a 
                href={activeSpace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-black/70 transition-colors z-10"
              >
                Mở trong tab mới <ExternalLink size={14} />
              </a>
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
