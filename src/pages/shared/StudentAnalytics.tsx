import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { Users, BarChart2, Star, Zap } from "lucide-react";
import { getHighestPetLevel, getActivityScore } from "../../utils/stats";

export default function StudentAnalytics() {
  const { students } = useAppStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3">
        <Users size={32} className="text-[#3B82F6]" />
        Thống Kê Thành Tích Học Sinh
      </h1>

      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#DBEAFE] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EFF6FF] text-[#1E3A8A]">
              <th className="p-4 font-black">Học sinh</th>
              <th className="p-4 font-black">Điểm số</th>
              <th className="p-4 font-black">Số Pet</th>
              <th className="p-4 font-black">Pet level cao nhất</th>
              <th className="p-4 font-black">Mức độ tích cực</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 font-bold text-gray-800">{student.fullName}</td>
                <td className="p-4 font-bold text-[#F59E0B]">{student.points}</td>
                <td className="p-4 font-medium text-gray-600">{student.ownedPets?.length || 0}</td>
                <td className="p-4 font-medium text-gray-600">{getHighestPetLevel(student)}</td>
                <td className="p-4 font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${Math.min(getActivityScore(student) * 5, 100)}%` }}
                      />
                    </div>
                    {getActivityScore(student)} điểm
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
