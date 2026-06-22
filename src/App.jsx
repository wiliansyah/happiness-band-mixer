import React, { useState, useEffect, useRef } from 'react';
import { Power, SlidersHorizontal, Activity, Mic2, Guitar, BookOpen, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, Check, Plug, Disc3, Piano, FileText, X } from 'lucide-react';
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
  const [isSopMinimized, setIsSopMinimized] = useState(false);

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

  const quitScenario = () => {
    // Kembalikan mixer ke state awal (reset)
    setChannels(Array.from({length: 16}, createChannel));
    setFaderMaster(0);
    setPower(false);
    setPhantom(false);
    
    setActiveScenario('menu');
    setSopStep(0);
    setIsSopMinimized(false);
  };

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
          targetId: 'fader-master'
        },
        {
          action: 'Colok Kabel Input',
          desc: 'Pilih kabel Mic 1 (Biru) lalu ketuk lubang CH 1. Pilih kabel Mic 2 (Merah) lalu ketuk lubang CH 2.',
          highlight: { jack1: true, jack2: true },
          check: () => channels[0].connected === 'mic1' && channels[1].connected === 'mic2',
          targetId: 'jack-1'
        },
        {
          action: 'Nyalakan Power Mixer',
          desc: 'Tekan tombol POWER utama di sisi kanan.',
          highlight: { power: true },
          check: () => power === true,
          targetId: 'btn-main-power'
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
          targetId: 'btn-hpf-1'
        },
        {
          action: 'Hidupkan & Routing Channel',
          desc: 'Tekan tombol ON dan ST pada CH 1 dan CH 2.',
          highlight: { on1: true, st1: true, on2: true, st2: true },
          check: () => channels[0].on && channels[0].st && channels[1].on && channels[1].st,
          targetId: 'btn-on-1'
        },
        {
          action: 'Buka Master Volume',
          desc: 'Geser Fader STEREO OUT (Merah) ke kisaran 70.',
          highlight: { faderMaster: true },
          check: () => faderMaster > 60,
          targetId: 'fader-master'
        },
        {
          action: 'Naikkan Volume Alat',
          desc: 'Geser Fader CH 1 dan CH 2 ke atas (kisaran 50).',
          highlight: { fader1: true, fader2: true },
          check: () => channels[0].fader > 40 && channels[1].fader > 40,
          targetId: 'fader-1'
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
          targetId: 'fader-master'
        },
        {
          action: 'Matikan Power Mixer',
          desc: 'Tekan saklar MAIN POWER untuk mematikan mixer.',
          highlight: { power: true },
          check: () => power === false,
          targetId: 'btn-main-power'
        },
        {
          action: 'Cabut Kabel',
          desc: 'Ketuk lubang CH 1 dan CH 2 untuk mencabut kabel.',
          highlight: { jack1: true, jack2: true },
          check: () => !channels[0].connected && !channels[1].connected,
          targetId: 'jack-1'
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
    <div className="min-h-[100dvh] h-[100dvh] bg-[#0f172a] flex flex-col font-sans overflow-hidden text-slate-300 print:min-h-auto print:h-auto print:overflow-visible print:block">
      <header className="bg-slate-900 border-b-2 border-slate-700/50 p-2 md:p-3 shadow-xl flex justify-between items-center z-20 shrink-0 gap-2 print:hidden">
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

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative print:overflow-visible print:block">
        {viewMode === 'manual' ? (
          <ManualBook />
        ) : (
          <>
            {/* LEFT PANEL / MAIN MENU OVERLAY */}
            <div className={`
              ${activeScenario === 'menu' 
                ? 'absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 lg:p-12 overflow-y-auto' 
                : 'w-full lg:w-[350px] bg-slate-900 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-800 flex flex-col shadow-2xl z-10 shrink-0 h-auto max-h-[40vh] lg:max-h-full lg:h-full'
              }
            `}>
              
              {/* Scenario Progress (only when active) */}
              {activeScenario === 'menu' && (
                <div className="bg-slate-800 p-2 border-b border-slate-700 flex justify-between items-center lg:hidden">
                  <span className="font-bold text-xs text-blue-400 flex items-center gap-2">
                    <Activity size={14}/> Dashboard & Menu
                  </span>
                </div>
              )}

              {/* Signal Dashboard */}
              <div className={`
                ${activeScenario === 'menu' ? 'w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl mb-8 overflow-hidden' : 'p-2 lg:p-4 bg-slate-950/50 border-b border-slate-800 hidden lg:block'}
              `}>
                <h2 className={`${activeScenario === 'menu' ? 'flex bg-slate-800/50 p-4 border-b border-slate-700' : 'hidden lg:flex'} text-xs font-bold text-emerald-500 uppercase mb-0 gap-2 items-center tracking-wider`}>
                  <Activity size={16} /> Signal Monitor {power ? '(LIVE)' : '(OFF)'}
                </h2>
                
                <div className={`space-y-3 ${activeScenario === 'menu' ? 'p-4' : 'mt-3'}`}>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400">MAIN POWER</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${power ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {power ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400">SPEAKER OUT</span>
                      {peakWarn && (
                        <span className="text-[10px] font-black text-red-500 animate-pulse flex items-center gap-1">
                          <AlertTriangle size={12} /> DISTORSI
                        </span>
                      )}
                    </div>
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden flex border border-black shadow-inner relative">
                      <div className={`h-full transition-all duration-75 ${peakWarn ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500'}`} style={{ width: `${Math.min(signalMaster, 100)}%` }}></div>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNCkiLz4KPC9zdmc+')] opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SOP Panel */}
              <div className={`flex flex-col overflow-y-auto ${activeScenario === 'menu' ? 'w-full max-w-md' : 'flex-1 p-2 lg:p-5'}`}>
                {activeScenario === 'menu' ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-sm font-black text-slate-300 mb-4 flex items-center gap-2 tracking-widest uppercase justify-center">
                      <BookOpen size={18} className="text-blue-500" /> Pilih Modul Latihan
                    </h3>
                    <div className="flex flex-col gap-4">
                      
                      <button
                        onClick={() => setViewMode('manual')}
                        className="text-left p-5 rounded-2xl border border-blue-500/50 hover:border-blue-400 bg-blue-900/20 hover:bg-blue-900/40 transition-all flex items-center gap-5 shadow-xl group hover:shadow-blue-500/20 mb-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-500/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner shrink-0">
                          <FileText size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-300 text-base tracking-wide mb-1 transition-colors">
                            Buku Panduan Lengkap
                          </h4>
                          <p className="text-xs text-blue-400/70 font-medium">
                            Pelajari anatomi & fungsi setiap tombol
                          </p>
                        </div>
                      </button>

                      {Object.values(scenarios).map((sc) => (
                        <button
                          key={sc.id}
                          onClick={() => {
                            setActiveScenario(sc.id);
                            setSopStep(0);
                          }}
                          className="text-left p-5 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all flex items-center gap-5 bg-slate-900 shadow-xl group hover:shadow-blue-500/10"
                        >
                          <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/50 transition-transform shadow-inner shrink-0">
                            {sc.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 text-base tracking-wide mb-1 group-hover:text-blue-400 transition-colors">
                              {sc.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {sc.steps.length} Langkah Pembelajaran
                            </p>
                          </div>
                        </button>
                      ))}

                      <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-3">
                        <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-200/80 leading-relaxed font-medium">
                          Setelah menggunakan, pastikan semua alat kembali OFF, matikan lampu, dan matikan AC di ruangan.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between animate-in fade-in slide-in-from-right-4 p-2 lg:p-0">
                    <div>
                      <div className="flex items-center justify-between mb-2 lg:mb-4">
                        <button
                          onClick={quitScenario}
                          className="text-[10px] lg:text-[11px] font-bold text-slate-400 hover:text-white mb-0 flex items-center gap-1 transition-colors bg-slate-800 lg:bg-transparent px-2 lg:px-0 py-1 lg:py-0 rounded"
                        >
                          <ChevronLeft size={12} /> <span className="hidden lg:inline">Kembali ke Menu</span><span className="lg:hidden">Keluar</span>
                        </button>
                        <span className="text-[10px] font-black bg-blue-600 text-white px-2 lg:px-3 py-1 lg:py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-blue-400">
                          Tahap {sopStep + 1} / {scenarios[activeScenario].steps.length}
                        </span>
                      </div>
                      <h3 className="text-sm lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 lg:mb-4 leading-tight drop-shadow-md">
                        {scenarios[activeScenario].steps[sopStep].action}
                      </h3>
                      <div className="bg-slate-800/80 p-3 lg:p-5 rounded-lg lg:rounded-xl border-l-2 lg:border-l-4 border-blue-500 shadow-inner mb-3 lg:mb-6 shrink-0">
                        <p className="text-[11px] lg:text-[15px] font-medium text-slate-300 leading-relaxed">
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
                          onClick={quitScenario}
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
              className={`flex-1 w-full h-full bg-slate-950 p-4 md:p-8 pb-32 flex items-start lg:items-center justify-start overflow-auto relative shadow-[inset_0_0_100px_rgba(0,0,0,1)] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
