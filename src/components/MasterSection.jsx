import React from 'react';
// Force rebuild MasterSection
import { Power, MonitorSpeaker } from 'lucide-react';
import { ToggleBtn } from './ToggleBtn';
import { Fader } from './Fader';
import { InputJack } from './InputJack';

export const MasterSection = ({
  power,
  setPower,
  phantom,
  setPhantom,
  signalMaster,
  faderMaster,
  setFaderMaster,
  highlightMap = {}
}) => {
  const isHigh = (key) => highlightMap[key] === true;

  // Simulate L and R meters slightly differently for realism if signal > 0
  const jitter = signalMaster > 0 ? Math.random() * 2 - 1 : 0;
  const signalL = Math.max(0, signalMaster + jitter);
  const signalR = Math.max(0, signalMaster - jitter);

  const getLedColor = (level, signal) => {
    if (!power || signal < level) return 'bg-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]';
    if (level > 80) return 'bg-red-500 shadow-[0_0_8px_red,inset_0_0_2px_white]';
    if (level > 40) return 'bg-yellow-400 shadow-[0_0_8px_yellow,inset_0_0_2px_white]';
    return 'bg-emerald-500 shadow-[0_0_8px_#10b981,inset_0_0_2px_white]';
  };

  const ledLevels = [100, 80, 60, 40, 20, 0, -20];

  return (
    <div className="w-32 md:w-36 bg-[#232b38] rounded-sm shadow-inner border border-slate-700/80 flex flex-col items-center justify-between py-2 md:py-4 relative shrink-0">
      <div className="absolute top-0 w-full h-6 bg-gradient-to-r from-red-900/50 to-slate-800 border-b border-red-500/30 flex justify-center items-center text-[10px] font-black text-red-300 tracking-widest shadow-md">
        MASTER
      </div>

      <div className="mt-8 flex gap-3">
        <InputJack
          type="xlr"
          connected={power}
          icon={MonitorSpeaker}
          color="text-red-400"
          label="L"
        />
        <InputJack
          type="xlr"
          connected={power}
          icon={MonitorSpeaker}
          color="text-red-400"
          label="R"
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-6 w-full px-2 md:px-4">
        {/* Phantom Power */}
        <div className="flex flex-col items-center bg-[#11141c] p-2 rounded border border-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
          <ToggleBtn
            label="+48V"
            type="small-rect"
            activeColor="bg-red-500 shadow-[0_0_10px_red]"
            active={phantom}
            onClick={() => setPhantom(!phantom)}
          />
        </div>

        {/* LED Meters */}
        <div className="w-full bg-[#11141c] rounded p-3 border border-black shadow-[inset_0_5px_15px_rgba(0,0,0,1)] flex justify-center gap-2 relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[80%] text-[6px] text-slate-500 font-bold">
            {ledLevels.map(l => <span key={l}>{l === 100 ? 'PEAK' : l}</span>)}
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[8px] text-slate-400 mb-1 text-center font-bold">L</span>
             {ledLevels.map((level) => (
              <div key={`l-${level}`} className={`w-3 h-2 rounded-[1px] ${getLedColor(level, signalL)}`}></div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[8px] text-slate-400 mb-1 text-center font-bold">R</span>
             {ledLevels.map((level) => (
              <div key={`r-${level}`} className={`w-3 h-2 rounded-[1px] ${getLedColor(level, signalR)}`}></div>
            ))}
          </div>
        </div>

        {/* Main Power Button */}
        <div
          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all mt-2 ${
            isHigh('power')
              ? 'border-yellow-400 bg-yellow-400/20 animate-pulse z-10'
              : 'border-slate-700 bg-[#1a1f2b] shadow-xl'
          }`}
        >
          <span className="text-[9px] font-bold text-slate-400 tracking-widest">
            POWER
          </span>
          <button
            onClick={() => setPower(!power)}
            className={`w-12 h-14 rounded border-b-[4px] border-r-[3px] border-black/60 flex items-center justify-center transition-all duration-200 relative overflow-hidden ${
              power
                ? 'bg-red-600 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] translate-y-1 translate-x-0.5 border-b-0 border-r-0'
                : 'bg-slate-800 shadow-lg'
            }`}
          >
            {/* Metallic gradient when off */}
            {!power && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>}
            <Power
              size={24}
              className={`relative z-10 ${
                power
                  ? 'text-white drop-shadow-[0_0_8px_white]'
                  : 'text-slate-600'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mb-2 mt-4 w-full flex justify-center px-2 bg-slate-900/30 p-2 rounded-t-lg border-t border-slate-700/50">
        <Fader
          label="STEREO OUT"
          capType="red"
          value={faderMaster}
          onChange={setFaderMaster}
          highlight={isHigh('faderMaster')}
        />
      </div>
    </div>
  );
};
