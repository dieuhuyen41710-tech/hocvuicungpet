import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { useNavigate } from "react-router";
import { FileText, Clock, AlertCircle } from "lucide-react";

export default function StudentTests() {
  const { tests } = useAppStore();
  const navigate = useNavigate();

  // Filter only published tests
  const publishedTests = tests.filter((test: any) => test.status === "PUBLISHED");

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3">
        <FileText size={32} className="text-[#3B82F6]" />
        Kiểm Tra Của Bạn
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedTests.length > 0 ? (
          publishedTests.map((test: any) => (
            <div
              key={test.id}
              className="bg-white p-6 rounded-[24px] shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-colors flex flex-col gap-4"
            >
              <h3 className="text-xl font-black text-gray-800">{test.title}</h3>
              <p className="text-sm text-gray-600 flex-1">{test.description}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-[#3B82F6]">
                <Clock size={18} /> {test.duration} phút
              </div>
              <button
                onClick={() => navigate(`/student/test/${test.id}`)}
                className="w-full bg-[#3B82F6] text-white py-3 rounded-xl font-black hover:bg-[#2563EB] transition-colors"
              >
                Làm bài ngay
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400 gap-4">
            <AlertCircle size={48} />
            <p className="font-bold">Chưa có đề kiểm tra nào được công bố.</p>
          </div>
        )}
      </div>
    </div>
  );
}
