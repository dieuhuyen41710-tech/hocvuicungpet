import React, { useState } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface CloudinaryUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function CloudinaryUploadButton({
  onUploadSuccess,
  accept = "image/*,video/*,audio/*,.pdf,.doc,.docx",
  label = "Tải lên Cloudinary"
}: CloudinaryUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const url = await uploadToCloudinary(file, (p) => setProgress(p));
      onUploadSuccess(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Tải lên thất bại');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="relative cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0">
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{progress}%</span>
          </>
        ) : success ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-300" />
            <span>Đã tải lên!</span>
          </>
        ) : (
          <>
            <Upload size={16} />
            <span>{label}</span>
          </>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {errorMsg && <span className="text-xs text-red-500 font-medium">{errorMsg}</span>}
    </div>
  );
}
