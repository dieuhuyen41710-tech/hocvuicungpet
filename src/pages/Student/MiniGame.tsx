import React, { useState } from 'react';
import { Gamepad2, Trophy, Star, Shield, Zap, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getEmbedUrl } from '../../utils/embed';

export default function MiniGame() {
  const { miniGames, mapNodes, lessons, playMiniGameReward } = useAppStore();
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string>('ALL');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const filteredGames = (miniGames || []).filter(g => {
    if (selectedMapId === 'ALL') return true;
    const attachedLesson = (lessons || []).find(l => l.gameUrl === g.url);
    return g.mapNodeId === selectedMapId || attachedLesson?.mapNodeId === selectedMapId;
  });

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    playMiniGameReward();
    // Dummy game logic
    const interval = setInterval(() => {
      setScore(s => s + Math.floor(Math.random() * 10) + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsPlaying(false);
      alert(`Bạn đã hoàn thành trò chơi và đạt ${score} điểm! Nhận được +10 điểm, +10 XP. Pet đã được cộng +20% No và +20% Vui vẻ! 🎉`);
    }, 10000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full px-2">
      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border-4 border-[#DBEAFE] flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-4 border-4 border-[#3B82F6] shadow-inner">
          <Gamepad2 size={48} className="text-[#3B82F6]" />
        </div>
        <h1 className="text-3xl font-black text-[#1E3A8A] mb-2">Phòng Game</h1>
        <p className="text-gray-500 font-medium max-w-lg mb-8">
          Giải trí một chút sau giờ học căng thẳng nhé! Các minigame giúp bạn luyện phản xạ và nhận thêm xu.
        </p>

        
        {activeGameUrl && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-5xl h-[85vh] bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl border-4 border-[#3B82F6] relative animate-in fade-in zoom-in duration-300">
              <div className="bg-[#EFF6FF] p-4 flex justify-between items-center border-b-4 border-[#DBEAFE]">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-black text-[#1E3A8A] flex items-center gap-2">
                    <Gamepad2 size={24} className="text-[#3B82F6]" /> Trò chơi tương tác
                  </h3>
                  <a 
                    href={activeGameUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-black rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    Mở trong tab mới ↗
                  </a>
                </div>
                <button 
                  onClick={() => setActiveGameUrl(null)}
                  className="w-10 h-10 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="bg-[#FEF3C7] px-4 py-2 text-xs font-bold text-[#D97706] text-center border-b border-[#FDE68A]">
                ⚠️ Lưu ý: Nếu trò chơi ngoài (Canva/Trang khác) báo lỗi quyền truy cập, hãy bấm nút <span className="underline font-black">"Mở trong tab mới"</span> phía trên để chơi không bị gián đoạn.
              </div>
              <div className="flex-1 w-full relative bg-black">
                <iframe src={getEmbedUrl(activeGameUrl)} className="w-full h-full border-0 absolute inset-0" allow="autoplay; fullscreen"></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Map Classification Filter Tags */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-black text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
              🗺️ Phân loại theo bản đồ tri thức:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMapId('ALL')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                selectedMapId === 'ALL'
                  ? 'bg-[#3B82F6] text-white border-[#2563EB] shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B82F6]'
              }`}
            >
              🌟 Tất cả trò chơi
            </button>
            {(mapNodes || []).map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedMapId(node.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                  selectedMapId === node.id
                    ? 'bg-[#3B82F6] text-white border-[#2563EB] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B82F6]'
                }`}
              >
                📍 {node.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {(filteredGames || []).map(game => (
            <div key={game.id} className="bg-white rounded-[24px] border-4 border-[#E0F2FE] hover:border-[#3B82F6] transition-colors group cursor-pointer text-left shadow-sm flex flex-col overflow-hidden">
              {game.thumbnail ? (
                <div className="w-full h-44 relative bg-gray-100 overflow-hidden border-b-4 border-[#E0F2FE]">
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              ) : (
                <div className="w-full h-44 bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center border-b-4 border-[#E0F2FE]">
                  <Gamepad2 size={48} />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-[#1E3A8A] mb-2">{game.title}</h3>
                <p className="text-sm text-[#64748B] font-medium mb-4 line-clamp-2 flex-1">{game.description}</p>
                <button 
                  onClick={() => {
                    playMiniGameReward();
                    alert("🎉 Bắt đầu chơi! Nhận +10 điểm, +10 XP và Pet được cộng +20% No, +20% Vui vẻ!");
                    setActiveGameUrl(game.url);
                  }}
                  className="w-full py-3 bg-[#3B82F6] text-white font-black rounded-xl hover:bg-[#2563EB] transition-colors"
                >
                  CHƠI NGAY
                </button>
              </div>
            </div>
          ))};
        </div>
      </div>
    </div>
  );
}
