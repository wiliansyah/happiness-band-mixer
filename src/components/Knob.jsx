import React, { useRef } from 'react';

export const Knob = ({ 
  label = 'GAIN', 
  colorClass = 'bg-slate-200', 
  value = 0, 
  onChange, 
  highlight,
  disabled = false, 
  size = 'normal',
  id 
}) => {
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    if (disabled || !containerRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValue(e);
  };

  const handlePointerMove = (e) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId) || !containerRef.current) return;
    updateValue(e);
  };

  const updateValue = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    let percent = 1 - (e.clientY - rect.top) / rect.height;
    percent = Math.max(0, Math.min(1, percent));
    const newValue = Math.round(percent * 100);
    if (onChange && newValue !== value) {
      onChange(newValue);
    }
  };

  const rotation = -135 + (value / 100) * 270;
  
  const sizeClasses = size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-12 h-12' : 'w-10 h-10';
  const capClasses = size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-10 h-10' : 'w-8 h-8';
  const labelSize = size === 'small' ? 'text-[8px]' : 'text-[10px]';

  return (
    <div className={`flex flex-col items-center gap-1 md:gap-2 select-none ${highlight ? 'animate-pulse z-10 scale-110' : ''} ${disabled ? 'opacity-70' : ''}`} id={id}>
      <div 
        ref={containerRef}
        className={`relative ${sizeClasses} flex items-center justify-center cursor-pointer touch-none z-20`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <div className={`absolute ${sizeClasses} rounded-full bg-slate-900 border border-slate-700 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none`}></div>
        
        <div
          className={`absolute ${capClasses} rounded-full ${colorClass} shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none transition-transform`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-1 h-2 bg-black/80 rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.4)]"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
      </div>
      <span className={`${labelSize} font-bold text-slate-300 tracking-wider font-mono`}>{label}</span>
    </div>
  );
};
