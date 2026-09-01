import React from 'react';

interface AppTitleLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSchool?: boolean;
  roleSuffix?: string;
  className?: string;
}

export default function AppTitleLogo({ 
  size = 'md', 
  showSchool = false, 
  roleSuffix = '',
  className = '' 
}: AppTitleLogoProps) {
  // Size classes
  const containerClasses = {
    sm: 'scale-75 origin-left',
    md: 'scale-90 origin-left lg:scale-100',
    lg: 'scale-100 lg:scale-125'
  }[size];

  // Letter style helper for 3D cartoon effect
  const getLetterStyle = (color: string) => ({
    color,
    WebkitTextStroke: '2.5px #1e3a8a',
    textShadow: '2.5px 2.5px 0 #1e3a8a, 0 4px 8px rgba(0,0,0,0.35)',
  });

  return (
    <div className={`flex flex-col select-none ${containerClasses} ${className}`}>
      <div className="flex items-center gap-1 flex-wrap">
        {/* Học */}
        <span className="inline-flex font-black tracking-tight text-3xl md:text-4xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span style={getLetterStyle('#00b4d8')}>H</span>
          <span style={getLetterStyle('#06d6a0')}>ọ</span>
          <span style={getLetterStyle('#ff9f1c')}>c</span>
        </span>

        {/* vui */}
        <span className="inline-flex font-black tracking-tight text-3xl md:text-4xl ml-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span style={getLetterStyle('#ef476f')}>v</span>
          <span style={getLetterStyle('#ffd166')}>u</span>
          <span style={getLetterStyle('#9b5de5')}>i</span>
        </span>

        {/* cùng */}
        <span className="inline-flex font-black tracking-tight text-3xl md:text-4xl ml-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span style={getLetterStyle('#7209b7')}>c</span>
          <span style={getLetterStyle('#f72585')}>ù</span>
          <span style={getLetterStyle('#4cc9f0')}>n</span>
          <span style={getLetterStyle('#ff70a6')}>g</span>
        </span>

        {/* Pet */}
        <span className="inline-flex font-black tracking-tight text-3xl md:text-4xl ml-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span style={getLetterStyle('#2ec4b6')}>P</span>
          <span style={getLetterStyle('#3a86ff')}>e</span>
          <span style={getLetterStyle('#fb5607')}>t</span>
        </span>

        {roleSuffix && (
          <span className="ml-3 text-xs font-black uppercase bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border-2 border-blue-400 shadow-sm">
            {roleSuffix}
          </span>
        )}
      </div>

      {showSchool && (
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-black tracking-widest uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            Trường THCS Bằng Doãn
          </span>
        </div>
      )}
    </div>
  );
}
