import React from 'react';

export const Fader = ({
  label,
  capType = 'white', // white, red, gray
  value,
  onChange,
  highlight,
  disabled = false,
}) => {
  const capClass = capType === 'red' ? 'fader-cap-red' : capType === 'gray' ? 'fader-cap-gray' : 'fader-cap-white';

  return (
    <div className={`flex flex-col items-center gap-1 mt-2 ${highlight ? 'animate-pulse z-10' : ''} ${disabled ? 'opacity-70' : ''}`}>
      <div className="w-10 h-44 bg-[#11141c] rounded-sm relative flex items-center justify-center fader-groove border border-slate-700/50">
        
        {/* Track Line */}
        <div className="w-1.5 h-[85%] bg-black absolute flex flex-col justify-between py-1 items-center rounded-full shadow-inner">
          {/* Tick Marks */}
          {[...Array(11)].map((_, i) => (
            <div key={i} className="absolute w-6 flex items-center" style={{ top: `${i * 10}%`, transform: 'translateY(-50%)' }}>
              <div className={`h-[1px] w-full ${i === 2 ? 'bg-white h-[2px]' : 'bg-slate-600'}`}></div>
            </div>
          ))}
        </div>

        {/* Input Control */}
        <div className="absolute w-12 h-[85%] flex items-center justify-center">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => !disabled && onChange(Number(e.target.value))}
            className="w-[150px] h-12 absolute -rotate-90 cursor-pointer opacity-0 z-20 touch-none drag-none"
            disabled={disabled}
          />
        </div>

        {/* Fader Cap */}
        <div
          className={`pointer-events-none z-10 absolute w-8 h-12 rounded-sm fader-cap flex items-center justify-center transition-all duration-75 ${capClass} ${highlight ? 'ring-4 ring-yellow-400' : ''}`}
          style={{ bottom: `calc(7.5% + ${(value / 100) * 65}%)` }}
        >
          {/* Cap Line */}
          <div className="w-6 h-[3px] bg-black/80 rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.4)]"></div>
        </div>
      </div>

      <span className="text-[10px] font-bold text-slate-800 bg-slate-300 px-2 py-0.5 rounded shadow-sm uppercase mt-1">
        {label}
      </span>
    </div>
  );
};
