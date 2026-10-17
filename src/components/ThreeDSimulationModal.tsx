import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Box } from 'lucide-react';
import ThreeDModelViewer from './ThreeDModelViewer';

export default function ThreeDSimulationModal() {
  const { active3DCommand, setScene3DCommand } = useAppStore();

  if (!active3DCommand) return null;

  const getVisualizationContent = () => {
    return (
      <div className="text-center">
        <ThreeDModelViewer shape={active3DCommand.shape} />
        <p className="font-bold text-gray-800 mt-4">
          Pet đang minh họa {active3DCommand.shape}. 
          {active3DCommand.command === 'HIGHLIGHT_FACES' ? ' Cậu có thể xoay và phóng to để quan sát các mặt nhé!' : ' Cậu có thể xoay để nhìn rõ cấu trúc!'}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[32px] p-6 max-w-lg w-full shadow-2xl relative">
        <button 
          onClick={() => setScene3DCommand(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-[#1E3A8A] mb-6 flex items-center gap-2">
          <Box className="text-[#3B82F6]" />
          Pet minh họa 3D
        </h2>
        {getVisualizationContent()}
        <button
          onClick={() => setScene3DCommand(null)}
          className="w-full mt-6 bg-[#3B82F6] text-white py-3 rounded-xl font-bold hover:bg-[#2563EB]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
