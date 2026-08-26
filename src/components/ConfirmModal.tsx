import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, onClose }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose || onCancel} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <button onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Hủy</button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md">Xóa</button>
        </div>
      </div>
    </Modal>
  );
}
