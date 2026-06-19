import React, { useRef } from 'react';

export const Fader = ({ label = 'CH 1', capType = 'white', value = 0, onChange, disabled = false, id }) => {
  const capColors = {
    white: 'bg-gradient-to-b from-slate-100 to-slate-300 border-b-slate-400',
    red: 'bg-gradient-to-b from-red-500 to-red-700 border-b-red-800',
    blue: 'bg-gradient-to-b from-blue-400 to-blue-600 border-b-blue-700'
  };

  const trackRef = useRef(null);

  const handlePointerDown = (e) => {
    if (disabled || !trackRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValue(e);
  };

  const handlePointerMove = (e) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId) || !trackRef.current) return;
    updateValue(e);
  };

  const updateValue = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    // Invert because Y=0 is top, but value=100 is at the top
    let percent = 1 - (e.clientY - rect.top) / rect.height;
    percent = Math.max(0, Math.min(1, percent));
    const newValue = Math.round(percent * 100);
    if (onChange && newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center relative select-none w-16" id={id}>
      <div className="bg-slate-900 w-16 h-[250px] md:h-[280px] rounded-xl border border-slate-700/50 shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)] flex flex-col items-center py-4 relative overflow-hidden">
        
        {/* Scale markings */}
        <div className="absolute left-2 top-4 bottom-4 w-2 flex flex-col justify-between items-end opacity-40">
          <div className="h-[1px] w-full bg-white"></div>
          <div className="h-[1px] w-1.5 bg-white"></div>
          <div className="h-[1px] w-full bg-white"></div>
          <div className="h-[1px] w-1.5 bg-white"></div>
          <div className="h-[1px] w-full bg-white"></div>
          <div className="h-[1px] w-1.5 bg-white"></div>
          <div className="h-[1px] w-full bg-white"></div>
        </div>

        {/* Custom Touch Track */}
        <div 
          className="absolute w-12 h-[85%] flex justify-center cursor-pointer touch-none z-20"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {/* Visual Track Groove */}
          <div ref={trackRef} className="absolute w-2 h-full bg-black rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border-x border-slate-700/50"></div>
          
          {/* Fader Cap */}
          <div 
            className={`fader-cap absolute w-8 h-12 shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_3px_rgba(255,255,255,0.4)] border-b-4 ${capColors[capType]} flex flex-col items-center justify-center transition-transform active:scale-95 z-30`}
            style={{ 
              bottom: `calc(${value}% - 24px)` 
            }}
          >
            <div className="w-6 h-1 bg-black/30 rounded-full mb-1"></div>
            <div className="w-6 h-0.5 bg-white/50 rounded-full"></div>
          </div>
        </div>

      </div>
      <div className="mt-4 font-bold text-slate-400 text-xs tracking-wider bg-slate-900 px-3 py-1 rounded shadow-inner border border-slate-800">
        {label}
      </div>
    </div>
  );
};
