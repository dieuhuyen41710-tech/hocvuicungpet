import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Box, X, Maximize2 } from 'lucide-react';

export default function ThreeDSimulationModal() {
  const { active3DCommand, setScene3DCommand } = useAppStore();

  if (!active3DCommand) return null;

  // Placeholder for 3D visualization assets
  const getVisualizationContent = () => {
    switch (active3DCommand.command) {
      case 'HIGHLIGHT_FACES':
        return (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center border-4 border-blue-300 mb-4">
              <Box size={96} className="text-blue-500" />
            </div>
            <p className="font-bold text-gray-800">Minh họa các mặt của {active3DCommand.shape}</p>
          </div>
        );
      case 'UNFOLD':
        return (
          <div className="text-center">
            <div className="w-64 h-48 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center border-4 border-amber-300 mb-4">
              <span className="text-4xl font-black text-amber-700">Trải phẳng</span>
            </div>
            <p className="font-bold text-gray-800">Minh họa trải phẳng {active3DCommand.shape}</p>
          </div>
        );
      default:
        return <p>Đang tải mô phỏng...</p>;
    }
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
