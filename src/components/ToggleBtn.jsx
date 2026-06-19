import React from 'react';

export const ToggleBtn = ({
  label,
  activeColor = 'bg-orange-500 shadow-[0_0_10px_orange]',
  active,
  onClick,
  highlight,
  type = 'rect',
  disabled = false,
  id,
}) => {
  const isSmall = type === 'small-rect';
  let dims = type === 'rect' ? 'w-7 h-5' : 'w-6 h-6 rounded-full';
  if (isSmall) dims = 'w-6 h-4';

  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? 'animate-pulse scale-110 z-10' : ''} ${disabled ? 'opacity-50' : ''}`} id={id}>
      <button
        onClick={() => !disabled && onClick()}
        className={`
          transition-all duration-150 rounded-sm shadow-md border-b-[3px] border-r-2 border-black/60 relative overflow-hidden
          ${dims} 
          ${active ? `${activeColor} btn-inset translate-y-[2px] border-b-0 border-r-0` : 'bg-slate-300'}
          ${highlight ? 'ring-4 ring-yellow-400/80' : ''}
        `}
        disabled={disabled}
      >
        {/* Metallic sheen on inactive */}
        {!active && <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>}
      </button>
      <span className={`${isSmall ? 'text-[7px]' : 'text-[9px]'} font-bold text-slate-300 tracking-wide uppercase`}>{label}</span>
    </div>
  );
};
