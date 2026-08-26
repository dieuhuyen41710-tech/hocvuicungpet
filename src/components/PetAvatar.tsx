import React from 'react';

interface PetAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

export default function PetAvatar({ src, alt = "Pet", className = "", imgClassName = "w-full h-full object-contain" }: PetAvatarProps) {
  if (!src) {
    return <span className={className}>🐾</span>;
  }

  const isUrl = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('/assets/') || src.startsWith('/src/');

  if (isUrl) {
    return (
      <div className={`overflow-hidden flex items-center justify-center ${className}`}>
        <img src={src} alt={alt} className={imgClassName} />
      </div>
    );
  }

  return (
    <span className={`flex items-center justify-center ${className}`}>
      {src}
    </span>
  );
}
