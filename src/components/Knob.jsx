import React from 'react';

export const Knob = ({
  label,
  colorClass,
  value,
  onChange,
  highlight,
  min = 0,
  max = 100,
  size = 'normal',
  disabled = false,
}) => {
  // rotation calculation
  const rotation = -135 + ((value - min) / (max - min)) * 270;
  const sizeClasses = size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-10 h-10' : 'w-8 h-8';
  const labelSize = size === 'small' ? 'text-[7px]' : 'text-[9px]';

  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? 'animate-pulse z-10' : ''} ${disabled ? 'opacity-70' : ''}`}>
      <div className={`relative ${sizeClasses} knob-base rounded-full bg-slate-900 flex justify-center items-center`}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => !disabled && onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 touch-none drag-none"
          title={label}
          disabled={disabled}
        />
        <div
          className={`w-[90%] h-[90%] rounded-full knob-shadow border-b-[2px] border-black/80 flex justify-center pt-1 ${colorClass} ${highlight ? 'ring-4 ring-yellow-400/80' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Indicator line */}
          <div className="w-[1.5px] h-2.5 bg-slate-950 rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.4)]"></div>
        </div>
      </div>
      <span className={`${labelSize} font-bold text-slate-300 tracking-wide bg-slate-800/80 px-1.5 py-0.5 rounded shadow-inner uppercase`}>
        {label}
      </span>
    </div>
  );
};
