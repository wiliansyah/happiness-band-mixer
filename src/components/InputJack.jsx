import React from 'react';

export const InputJack = ({ 
  type, 
  connected, 
  icon: Icon, 
  color, 
  label, 
  id, 
  highlight,
  onDrop,
  onDisconnect,
  onClick
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!connected && onDrop) {
      const cableType = e.dataTransfer.getData('cableType');
      onDrop(cableType);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center mb-2 relative ${highlight ? 'animate-pulse z-10' : ''}`} 
      id={id}
      onClick={onClick}
    >
      <div 
        className="h-[50px] flex flex-col items-center justify-end pb-1 w-full relative z-10"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {connected ? (
          <div 
            className={`flex flex-col items-center ${color} animate-in fade-in zoom-in duration-200 cursor-grab active:cursor-grabbing`}
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData('action', 'disconnect');
              e.dataTransfer.setData('sourceId', id);
            }}
            onDragEnd={(e) => {
              // If dropped anywhere outside, we consider it disconnected
              // To be safe, we can just trigger disconnect on double click, or drag out
              if (e.dataTransfer.dropEffect === 'none' && onDisconnect) {
                onDisconnect();
              }
            }}
            title="Drag menjauh untuk mencabut kabel"
          >
            {Icon && <Icon size={18} className="mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none" />}
            <div className="w-2 h-4 bg-slate-800 border-x border-slate-600 shadow-inner pointer-events-none"></div>
            <div className="w-5 h-8 metallic-jack rounded-t-sm border-2 border-slate-800 shadow-xl relative flex justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-slate-900 mt-1 shadow-inner border border-slate-700"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-center pb-1">
             <span className="text-[9px] text-slate-500 font-bold uppercase">{label}</span>
          </div>
        )}
      </div>
      
      {/* Socket hole */}
      <div className={`w-8 h-8 rounded-full bg-slate-950 border-[3px] shadow-[inset_0_5px_15px_rgba(0,0,0,1)] flex items-center justify-center relative -mt-2 z-0 ${highlight ? 'border-yellow-400/80 ring-2 ring-yellow-400/50' : 'border-slate-600'}`}>
        <div className="w-3 h-3 rounded-full bg-black shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></div>
        {/* Outer metallic ring */}
        <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
};
// Force cache invalidation
