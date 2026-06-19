import React, { useState, useEffect, useRef } from 'react';
import { Power, SlidersHorizontal, Activity, Mic2, Guitar, BookOpen, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, Check, Plug, Disc3, Piano, FileText } from 'lucide-react';
import { ChannelStrip } from './components/ChannelStrip';
import { MasterSection } from './components/MasterSection';
import { ManualBook } from './components/ManualBook';

const createChannel = () => ({
  connected: false, // will store string like 'mic1', 'drum', etc. or false
  pad: false,
  hpf: false,
  gain: 0,
  comp: 0,
  eqH: 50,
  eqM: 50,
  eqL: 50,
  aux1: 0,
  pan: 50,
  on: false,
  st: false,
  pfl: false,
  fader: 50, // Started at 50 so user must lower it for SOP Step 1
  peak: false,
});

export default function App() {
  const [viewMode, setViewMode] = useState('mixer'); // 'mixer' | 'manual'
  const [power, setPower] = useState(false);
  const [phantom, setPhantom] = useState(false);
  const [faderMaster, setFaderMaster] = useState(70); // Starts high to trigger SOP step 1
  const [selectedCable, setSelectedCable] = useState(null);

  // Drag-to-Scroll State
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    // Prevent dragging if clicking an interactive element
    if (['INPUT', 'BUTTON'].includes(e.target.tagName) || e.target.closest('.fader-cap') || e.target.closest('.metallic-jack')) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walkX;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  // 16 Channels
  const [channels, setChannels] = useState(Array.from({length: 16}, createChannel));
  const [signalMaster, setSignalMaster] = useState(0);
  const [peakWarn, setPeakWarn] = useState(false);

  const updateChannel = (index, key, value) => {
    if (key === 'connected' && power) {
      alert("⚠️ BAHAYA! Matikan POWER utama terlebih dahulu sebelum mencabut atau memasang kabel untuk mencegah kerusakan speaker (Popping Sound).");
      return;
    }
    setChannels(prev => {
      const newChannels = [...prev];
      newChannels[index] = { ...newChannels[index], [key]: value };
      return newChannels;
    });
  };

  useEffect(() => {
    if (!power) {
      setSignalMaster(0);
      setPeakWarn(false);
      return;
    }

    let totalSignal = 0;
    let anyPeak = false;

    const newChannels = channels.map((ch, i) => {
      if (!ch.connected) return { ...ch, peak: false };
      
      let s = (i % 2 === 0) ? 40 : 80;
      if (ch.pad) s *= 0.1;
      if (ch.hpf) s *= 0.9;
      s = s * (1 + ch.gain / 30);

      const isPeak = s > 90 || (s > 50 && !ch.pad && i % 2 !== 0);
      if (isPeak) anyPeak = true;

      if (ch.on && ch.st) {
        totalSignal += s * (ch.fader / 100);
      }

      return { ...ch, peak: isPeak };
    });

    const peaksChanged = channels.some((ch, i) => ch.peak !== newChannels[i].peak);
    if (peaksChanged) setChannels(newChannels);

    setSignalMaster(totalSignal * (faderMaster / 100));
    setPeakWarn(anyPeak || signalMaster > 90);
  }, [power, faderMaster, channels]);

  // SOP Logic
  const [activeScenario, setActiveScenario] = useState('menu');
  const [sopStep, setSopStep] = useState(0);

  const scenarios = {
    powerOn: {
      id: 'powerOn',
      title: '1. Menyalakan Sistem (ON)',
      icon: <Power size={18} className="text-emerald-500" />,
      steps: [
        {
          action: 'Turunkan Semua Volume',
          desc: 'Tarik Fader CH 1, Fader CH 2, dan Fader MASTER MERAH ke posisi paling bawah (0).',
          highlight: { fader1: true, fader2: true, faderMaster: true },
          check: () => channels[0].fader <= 5 && channels[1].fader <= 5 && faderMaster <= 5,
        },
        {
          action: 'Colok Kabel Input',
          desc: 'Drag kabel Mic 1 (Biru) ke CH 1 dan kabel Mic 2 (Merah) ke CH 2 di rak atas.',
          highlight: { jack1: true, jack2: true },
          check: () => channels[0].connected === 'mic1' && channels[1].connected === 'mic2',
        },
        {
          action: 'Nyalakan Power Mixer',
          desc: 'Tekan tombol POWER utama di sisi kanan.',
          highlight: { power: true },
          check: () => power === true,
        },
      ],
    },
    micCheck: {
      id: 'micCheck',
      title: '2. Soundcheck Vocal & Instrumen',
      icon: <Mic2 size={18} className="text-blue-500" />,
      steps: [
        {
          action: 'Filter Noise',
          desc: 'Di CH 1 (Mic), tekan HPF 80Hz. Di CH 2 (Gitar), tekan PAD 26dB.',
          highlight: { hpf1: true, pad2: true },
          check: () => channels[0].hpf && channels[1].pad,
        },
        {
          action: 'Hidupkan & Routing Channel',
          desc: 'Tekan tombol ON dan ST pada CH 1 dan CH 2.',
          highlight: { on1: true, st1: true, on2: true, st2: true },
          check: () => channels[0].on && channels[0].st && channels[1].on && channels[1].st,
        },
        {
          action: 'Buka Master Volume',
          desc: 'Geser Fader STEREO OUT (Merah) ke kisaran 70.',
          highlight: { faderMaster: true },
          check: () => faderMaster > 60,
        },
        {
          action: 'Naikkan Volume Alat',
          desc: 'Geser Fader CH 1 dan CH 2 ke atas (kisaran 50).',
          highlight: { fader1: true, fader2: true },
          check: () => channels[0].fader > 40 && channels[1].fader > 40,
        },
      ],
    },
    powerOff: {
      id: 'powerOff',
      title: '3. Mematikan Sistem (OFF)',
      icon: <Power size={18} className="text-red-500" />,
      steps: [
        {
          action: 'Tutup Semua Volume',
          desc: 'Tarik KEMBALI Fader CH 1, Fader CH 2, dan Fader MASTER MERAH ke 0.',
          highlight: { fader1: true, fader2: true, faderMaster: true },
          check: () => channels[0].fader === 0 && channels[1].fader === 0 && faderMaster === 0,
        },
        {
          action: 'Matikan Power Mixer',
          desc: 'Tekan saklar MAIN POWER untuk mematikan mixer.',
          highlight: { power: true },
          check: () => power === false,
        },
        {
          action: 'Cabut Kabel',
          desc: 'Drag kabel CH 1 dan CH 2 menjauh (disconnect).',
          highlight: { jack1: true, jack2: true },
          check: () => !channels[0].connected && !channels[1].connected,
        },
      ],
    },
  };

  const currentHighlight = activeScenario !== 'menu' && viewMode === 'mixer' ? scenarios[activeScenario].steps[sopStep].highlight : {};

  // Cable definitions
  const cableTypes = {
    mic1: { id: 'mic1', label: 'Mic 1', icon: Mic2, color: 'text-blue-400' },
    mic2: { id: 'mic2', label: 'Mic 2', icon: Mic2, color: 'text-red-400' },
    guitar: { id: 'guitar', label: 'Guitar', icon: Guitar, color: 'text-emerald-400' },
    bass: { id: 'bass', label: 'Bass', icon: Guitar, color: 'text-purple-400' },
    drum: { id: 'drum', label: 'Drum', icon: Disc3, color: 'text-yellow-400' },
    keys: { id: 'keys', label: 'Keys', icon: Piano, color: 'text-orange-400' },
  };

  const DraggableCable = ({ type }) => {
    const cable = cableTypes[type];
    const isSelected = selectedCable === type;
    return (
      <div 
        draggable="true"
        onDragStart={(e) => {
          e.dataTransfer.setData('cableType', type);
          setSelectedCable(null);
        }}
        onClick={() => setSelectedCable(isSelected ? null : type)}
        className={`flex flex-col items-center cursor-pointer transition-transform shrink-0 rounded-lg p-1 ${isSelected ? 'scale-110 bg-slate-700 ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'hover:scale-110'}`}
        title={`Pilih kabel ${cable.label} lalu ketuk colokan`}
      >
        <cable.icon size={16} className={`${cable.color} mb-0.5`} />
        <div className="w-1.5 h-3 bg-slate-700 border-x border-slate-500 shadow-inner"></div>
        <div className="w-4 h-6 metallic-jack rounded-t-sm border border-slate-600 shadow-md flex justify-center">
          <div className={`w-2 h-0.5 mt-1 rounded-full ${cable.color.replace('text-', 'bg-')}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-[#0f172a] flex flex-col font-sans overflow-hidden text-slate-300">
      <header className="bg-slate-900 border-b-2 border-slate-700/50 p-2 md:p-3 shadow-xl flex justify-between items-center z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <SlidersHorizontal className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
          <h1 className="text-[10px] sm:text-xs md:text-lg font-black tracking-widest text-slate-200 leading-tight">
            MG16XU <span className="hidden sm:inline">SIMULATOR</span>
          </h1>
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center overflow-x-auto pb-1 md:pb-0 hide-scrollbar justify-end">
          <button 
            onClick={() => setViewMode(viewMode === 'mixer' ? 'manual' : 'mixer')}
            className="flex items-center gap-1 md:gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-slate-600 transition-colors shadow-md text-[10px] md:text-sm font-bold shrink-0 whitespace-nowrap"
          >
            {viewMode === 'mixer' ? (
              <><FileText size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Baca Manual</span><span className="sm:hidden">Manual</span></>
            ) : (
              <><SlidersHorizontal size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Kembali ke Mixer</span><span className="sm:hidden">Mixer</span></>
            )}
          </button>

          {/* Cable Rack */}
          <div className="flex gap-2 items-center bg-slate-800 p-1.5 md:p-2 rounded-lg border border-slate-700 shadow-inner shrink-0">
            <span className="hidden md:flex text-xs font-bold text-slate-500 items-center gap-1">
              <Plug size={14} /> RAK KABEL:
            </span>
            {Object.keys(cableTypes).map(type => <DraggableCable key={type} type={type} />)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {viewMode === 'manual' ? (
          <ManualBook />
        ) : (
          <>
            {/* LEFT PANEL */}
            <div className={`
              ${activeScenario !== 'menu' 
                ? 'absolute bottom-4 left-4 right-4 rounded-xl border-2 border-blue-500/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] max-h-[45%] lg:max-h-none lg:static lg:w-[350px] lg:border-y-0 lg:border-l-0 lg:border-r-2 lg:border-slate-800 lg:rounded-none lg:shadow-2xl' 
                : 'w-full lg:w-[350px] h-[30%] lg:h-full border-b-2 lg:border-b-0 lg:border-r-2 border-slate-800'
              } 
              bg-slate-900 flex flex-col z-40 shrink-0 overflow-y-auto transition-all duration-300
            `}>
              {/* Signal Dashboard */}
              <div className={`p-4 bg-slate-950/50 border-b border-slate-800 ${activeScenario !== 'menu' ? 'hidden lg:block' : 'block'}`}>
                <h2 className="text-xs font-bold text-emerald-500 uppercase mb-3 flex gap-2 items-center tracking-wider">
                  <Activity size={16} /> Signal Monitor
                </h2>
                <div className="bg-[#11141c] p-4 rounded-xl border border-slate-800 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] text-slate-500 font-bold tracking-wider">MAIN POWER</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded shadow-inner ${power ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}>
                      {power ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] text-slate-500 font-bold tracking-wider">SPEAKER OUT</span>
                      {peakWarn && (
                        <span className="text-[10px] font-black text-red-500 animate-pulse flex items-center gap-1">
                          <AlertTriangle size={12} /> DISTORSI
                        </span>
                      )}
                    </div>
                    <div className="h-3 bg-slate-950 rounded-full overflow-hidden flex border border-black shadow-inner relative">
                      <div className={`h-full transition-all duration-75 ${peakWarn ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500'}`} style={{ width: `${Math.min(signalMaster, 100)}%` }}></div>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNCkiLz4KPC9zdmc+')] opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SOP Panel */}
              <div className="flex-1 p-5 flex flex-col overflow-y-auto">
                {activeScenario === 'menu' ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-[13px] font-black text-slate-400 mb-4 flex items-center gap-2 tracking-widest uppercase">
                      <BookOpen size={16} /> Modul Latihan SOP
                    </h3>
                    <div className="flex flex-col gap-3">
                      {Object.values(scenarios).map((sc) => (
                        <button
                          key={sc.id}
                          onClick={() => {
                            setActiveScenario(sc.id);
                            setSopStep(0);
                          }}
                          className="text-left p-4 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center gap-4 bg-slate-800/50 shadow-md group"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            {sc.icon}
                          </div>
                          <h4 className="font-bold text-slate-200 text-sm tracking-wide">
                            {sc.title}
                          </h4>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between animate-in fade-in slide-in-from-right-4">
                    <div>
                      <button
                        onClick={() => setActiveScenario('menu')}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline mb-4 flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft size={12} /> Kembali ke Menu
                      </button>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-blue-400">
                          Tahap {sopStep + 1} / {scenarios[activeScenario].steps.length}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 leading-tight drop-shadow-md">
                        {scenarios[activeScenario].steps[sopStep].action}
                      </h3>
                      <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-blue-500 shadow-inner mb-6">
                        <p className="text-[15px] font-medium text-slate-300 leading-relaxed">
                          {scenarios[activeScenario].steps[sopStep].desc}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 shadow-lg ${
                          scenarios[activeScenario].steps[sopStep].check()
                            ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-slate-900/50 border-slate-700 text-slate-500'
                        }`}
                      >
                        <CheckCircle2
                          size={24}
                          className={`transition-colors ${scenarios[activeScenario].steps[sopStep].check() ? 'text-emerald-500' : 'text-slate-600'}`}
                        />
                        <span className="font-bold text-xs tracking-wide">
                          {scenarios[activeScenario].steps[sopStep].check()
                            ? 'Selesai! Lanjut ke langkah berikutnya.'
                            : 'Menunggu eksekusi Anda...'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setSopStep(s => Math.max(0, s - 1))}
                        disabled={sopStep === 0}
                        className="px-4 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-700 hover:text-white disabled:opacity-30 flex-1 text-xs flex justify-center items-center transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {sopStep === scenarios[activeScenario].steps.length - 1 && scenarios[activeScenario].steps[sopStep].check() ? (
                        <button
                          onClick={() => setActiveScenario('menu')}
                          className="px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 flex-[3] text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 tracking-wide"
                        >
                          Selesai <Check size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSopStep(s => Math.min(scenarios[activeScenario].steps.length - 1, s + 1))}
                          disabled={!scenarios[activeScenario].steps[sopStep].check()}
                          className="px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 flex-[3] text-sm shadow-lg transition-all flex items-center justify-center gap-2 tracking-wide"
                        >
                          Lanjut <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: MIXER BOARD */}
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex-1 bg-slate-950 p-4 md:p-8 pb-32 flex items-start lg:items-center justify-start overflow-auto relative shadow-[inset_0_0_100px_rgba(0,0,0,1)] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              
              <div className="bg-[#1a1f2b] p-4 md:p-8 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.1)] border-t-[12px] border-slate-700 flex gap-4 md:gap-2 border-x-4 border-b-[12px] border-x-slate-800 border-b-slate-900 min-w-max relative overflow-hidden mb-8">
                
                {/* Top metallic plate effect */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Channels 1-8 */}
                {channels.slice(0, 8).map((ch, i) => {
                  const IconComp = ch.connected && cableTypes[ch.connected] ? cableTypes[ch.connected].icon : (i % 2 === 0 ? Mic2 : Guitar);
                  const isInst = ch.connected ? (ch.connected !== 'mic1' && ch.connected !== 'mic2') : (i % 2 !== 0);
                  
                  return (
                    <ChannelStrip
                      key={`ch-${i+1}`}
                      num={i+1}
                      state={ch}
                      updater={(k, v) => updateChannel(i, k, v)}
                      Icon={IconComp}
                      isInst={isInst}
                      highlightMap={currentHighlight}
                      disabled={false} // Unlocked!
                      power={power}
                      selectedCable={selectedCable}
                      onConnect={() => {
                        if (selectedCable) {
                          updateChannel(i, 'connected', selectedCable);
                          setSelectedCable(null);
                        }
                      }}
                    />
                  );
                })}

                {/* Divider */}
                <div className="w-8 flex flex-col justify-end items-center pb-24">
                  <div className="h-[80%] w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent shadow-[1px_0_1px_rgba(255,255,255,0.05)]"></div>
                </div>

                {/* Channels 9/10 - 15/16 (Stereo) */}
                {[9, 11, 13, 15].map((startNum) => {
                   const i = startNum - 1;
                   const ch = channels[i];
                   const IconComp = ch.connected && cableTypes[ch.connected] ? cableTypes[ch.connected].icon : FileText;

                   return (
                     <ChannelStrip
                      key={`ch-${startNum}`}
                      num={`${startNum}/${startNum+1}`}
                      state={ch}
                      updater={(k, v) => updateChannel(i, k, v)}
                      Icon={IconComp}
                      isStereo={true}
                      highlightMap={{}}
                      disabled={false} // Unlocked!
                      power={power}
                      selectedCable={selectedCable}
                      onConnect={() => {
                        if (selectedCable) {
                          updateChannel(i, 'connected', selectedCable);
                          setSelectedCable(null);
                        }
                      }}
                    />
                   )
                })}

                {/* Divider */}
                <div className="w-8 flex flex-col justify-end items-center pb-24">
                  <div className="h-[80%] w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent shadow-[1px_0_1px_rgba(255,255,255,0.05)]"></div>
                </div>

                {/* Master Section */}
                <MasterSection
                  power={power}
                  setPower={setPower}
                  phantom={phantom}
                  setPhantom={setPhantom}
                  signalMaster={signalMaster}
                  faderMaster={faderMaster}
                  setFaderMaster={setFaderMaster}
                  highlightMap={currentHighlight}
                />

                {/* Brand Logo overlay */}
                <div className="absolute top-6 right-44 text-slate-500 font-black tracking-[0.2em] italic text-2xl opacity-40 mix-blend-overlay">
                  YAMAHA
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
