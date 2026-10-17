import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Box } from 'lucide-react';

export default function ThreeDSimulationModal() {
  const { active3DCommand, setScene3DCommand } = useAppStore();

  if (!active3DCommand) return null;

  const renderHighlight = (shape: string) => (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto mb-4">
      <rect x="50" y="50" width="100" height="100" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="4" />
      <rect x="50" y="50" width="100" height="100" fill="transparent" stroke="#2563EB" strokeWidth="6" strokeDasharray="5,5" />
      <text x="100" y="110" textAnchor="middle" className="text-xl font-black fill-blue-700">Mặt bên</text>
    </svg>
  );

  const renderUnfold = (shape: string) => (
    <svg viewBox="0 0 300 200" className="w-64 h-48 mx-auto mb-4">
      <rect x="100" y="50" width="100" height="100" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
      <rect x="0" y="50" width="100" height="100" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
      <rect x="200" y="50" width="100" height="100" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
      <text x="150" y="110" textAnchor="middle" className="text-xl font-black fill-amber-800">Trải phẳng</text>
    </svg>
  );

  const getVisualizationContent = () => {
    switch (active3DCommand.command) {
      case 'HIGHLIGHT_FACES':
        return (
          <div className="text-center">
            {renderHighlight(active3DCommand.shape)}
            <p className="font-bold text-gray-800">Pet đang làm nổi bật các mặt của {active3DCommand.shape}</p>
          </div>
        );
      case 'UNFOLD':
        return (
          <div className="text-center">
            {renderUnfold(active3DCommand.shape)}
            <p className="font-bold text-gray-800">Pet đang trải phẳng {active3DCommand.shape} để cậu dễ tính diện tích!</p>
          </div>
        );
      default:
        return <p className="text-center p-8">Đang tải mô phỏng...</p>;
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
