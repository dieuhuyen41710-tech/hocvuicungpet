import React, { useState } from 'react';
import { Box, Play, RotateCw, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ThreeDViewer() {
  const { spaces3D } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeSpace = (spaces3D || [])[activeIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full px-2 h-full flex flex-col">
      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border-4 border-[#DBEAFE] flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center border-4 border-[#3B82F6] shadow-inner text-[#3B82F6]">
            <Box size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1E3A8A]">Không Gian 3D</h1>
            <p className="text-[#3B82F6] font-bold text-sm">Khám phá các mô hình trực quan</p>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-3xl border-4 border-gray-200 overflow-hidden relative flex items-center justify-center group min-h-[400px]">
          {activeSpace ? (
            <iframe 
              src={activeSpace.url} 
              className="w-full h-full absolute inset-0 border-0" 
              title={activeSpace.title}
              allow="xr-spatial-tracking; autoplay; fullscreen"
            ></iframe>
          ) : (
            <div className="text-center p-6 relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center mb-4 text-[#3B82F6] animate-spin-slow">
                <RotateCw size={48} />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">Chưa có mô hình nào</h3>
              <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
                Hãy đợi quản trị viên thêm không gian 3D mới nhé.
              </p>
            </div>
          )}
        </div>

        {(spaces3D || []).length > 0 && (
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            {(spaces3D || []).map((item, idx) => (
              <button 
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-colors whitespace-nowrap ${
                  idx === activeIndex 
                    ? 'bg-[#EFF6FF] border-[#3B82F6] text-[#1E3A8A]' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
