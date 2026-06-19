import React from 'react';
import { FileText, Printer, ShieldAlert, CheckCircle2, Sliders, Activity, Power, Volume2, Waves, Headphones, Zap } from 'lucide-react';
import { Knob } from './Knob';
import { Fader } from './Fader';
import { ToggleBtn } from './ToggleBtn';

export const ManualBook = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-8 relative font-sans">
      <button 
        onClick={handlePrint}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black tracking-wider transition-all hover:scale-105 z-50 print:hidden border-2 border-white/20"
      >
        <Printer size={24} />
        CETAK DOKUMEN
      </button>

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl text-slate-800 leading-relaxed print:shadow-none print:bg-white print:text-black overflow-hidden border border-slate-300">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-900 text-white p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-emerald-500 to-yellow-500"></div>
          <Sliders size={64} className="mx-auto mb-6 text-blue-400" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-4 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Buku Panduan Operasional
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-2xl text-blue-300 font-bold tracking-wide relative z-10 mb-4">
            YAMAHA MG16XU Mixing Console
          </p>
          <p className="text-sm md:text-md text-slate-400 font-medium max-w-2xl mx-auto">
            Panduan teknis dan visual komprehensif untuk penguasaan arsitektur tata suara panggung & studio.
          </p>
        </div>

        <div className="p-6 md:p-12 space-y-16 bg-slate-50">
          
          {/* PERINGATAN RISIKO */}
          <div className="bg-red-50 border-l-[8px] border-red-600 p-8 rounded-r-xl shadow-md relative overflow-hidden flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="bg-red-100 p-5 rounded-full shrink-0 shadow-inner">
              <ShieldAlert size={48} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-black text-red-700 uppercase mb-3 text-2xl tracking-wider">
                Protokol Keamanan Hardware
              </h3>
              <p className="text-red-900 m-0 font-medium text-lg leading-relaxed">
                <strong>Kesalahan urutan Power ON/OFF</strong> memicu <i>Power Surge</i> (lonjakan listrik tiba-tiba). Letupan ini sangat berbahaya dan dapat <strong className="bg-red-200 px-1 rounded">merobek membran speaker studio</strong> seketika. Seluruh musisi dan teknisi diwajibkan menghafal sekuens Bab 1 di bawah ini.
              </p>
            </div>
          </div>

          {/* BAB 1: SOP */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-300 pb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center border-2 border-emerald-500 shadow-sm">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 tracking-widest">
                Bab 1: Sekuens Operasional
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FASE 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <h3 className="text-xl font-black text-emerald-700 tracking-widest text-center border-b border-slate-100 pb-4">
                  FASE 1: TURN ON
                </h3>
                <ol className="list-decimal pl-5 space-y-4 text-slate-700 font-bold text-md">
                  <li className="pl-2">Tarik <span className="text-red-600 font-black">Semua Fader</span> ke dasar (0).</li>
                  <li className="pl-2">Colok kabel Instrumen/Mic.</li>
                  <li className="pl-2">Tekan tombol <span className="bg-slate-800 text-white px-2 py-1 rounded text-xs">POWER MIXER</span>.</li>
                  <li className="pl-2">Nyalakan Power Amp / Speaker.</li>
                </ol>
                <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 text-center">
                  Speaker menyala paling akhir agar aman dari tegangan awal.
                </div>
              </div>

              {/* FASE 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                <h3 className="text-xl font-black text-blue-700 tracking-widest text-center border-b border-slate-100 pb-4">
                  FASE 2: SOUNDCHECK
                </h3>
                <ol className="list-decimal pl-5 space-y-4 text-slate-700 font-bold text-md">
                  <li className="pl-2">Dorong <span className="text-red-600 font-black">Fader STEREO</span> ke 70.</li>
                  <li className="pl-2">Tekan tombol <span className="text-orange-500 font-black">ON</span> & <span className="text-red-500 font-black">ST</span>.</li>
                  <li className="pl-2">Dorong Fader Channel ke garis 0.</li>
                  <li className="pl-2">Putar <span className="text-blue-600 font-black">GAIN</span> secukupnya.</li>
                </ol>
                <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 text-center">
                  Set Fader di Unity Gain (0) menjamin kualitas dinamis terbaik.
                </div>
              </div>

              {/* FASE 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                <h3 className="text-xl font-black text-red-700 tracking-widest text-center border-b border-slate-100 pb-4">
                  FASE 3: TURN OFF
                </h3>
                <ol className="list-decimal pl-5 space-y-4 text-slate-700 font-bold text-md">
                  <li className="pl-2">Tarik turun <span className="text-red-600 font-black">Semua Fader</span> ke 0.</li>
                  <li className="pl-2">Matikan Power Amp / Speaker.</li>
                  <li className="pl-2">Matikan <span className="bg-slate-800 text-white px-2 py-1 rounded text-xs">POWER MIXER</span>.</li>
                  <li className="pl-2">Cabut seluruh kabel.</li>
                </ol>
                <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 text-center">
                  Speaker dimatikan awal agar tidak menangkap letupan listrik mati.
                </div>
              </div>
            </div>
          </div>

          {/* BAB 2: PRE-AMP */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-300 pb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-500 shadow-sm">
                <Zap size={32} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 tracking-widest">
                Bab 2: Anatomi Pre-Amp (Input)
              </h2>
            </div>

            <div className="space-y-8">
              {/* PAD & HPF */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 bg-[#1a1f2b] p-8 flex justify-center items-center gap-8 border-b lg:border-b-0 lg:border-r-[6px] border-slate-800 min-h-[200px] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <div className="z-10 flex flex-col items-center gap-2">
                      <ToggleBtn label="PAD" type="small-rect" active={false} disabled={true} />
                      <span className="text-xs text-slate-400 font-bold">26dB</span>
                    </div>
                    <div className="z-10 flex flex-col items-center gap-2">
                      <ToggleBtn label="HPF" type="small-rect" active={true} disabled={true} />
                      <span className="text-xs text-slate-400 font-bold">80Hz</span>
                    </div>
                  </div>
                  <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-black text-slate-800 mb-4">PAD & HPF Filter</h3>
                    <div className="space-y-4">
                      <p className="text-slate-600 text-lg leading-relaxed">
                        <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded font-bold mr-2">PAD Switch</span> 
                        Berfungsi sebagai "rem" sinyal. Memotong power masuk sebesar 26dB. Wajib ditekan jika mencolok Instrumen Aktif (Keyboard/Bass Aktif) agar suara tidak pecah/<i>clipping</i> seketika.
                      </p>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded font-bold mr-2">HPF (High-Pass)</span> 
                        Memotong frekuensi sub-bass. Wajib ditekan untuk Mic Vokal guna menghilangkan suara dengung (*rumble*) dari hembusan napas atau langkah kaki di panggung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GAIN */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 bg-[#1a1f2b] p-8 flex justify-center items-center border-b lg:border-b-0 lg:border-r-[6px] border-slate-800 min-h-[220px] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <div className="z-10 scale-125">
                      <Knob label="GAIN" colorClass="knob-cap-white" value={45} disabled={true} />
                    </div>
                  </div>
                  <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-black text-slate-800 mb-4">GAIN (Sensitivitas Headroom)</h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-4">
                      Gain <strong className="text-red-600">bukanlah</strong> pengatur volume akhir. Gain menetapkan seberapa sensitif *mixer* "mendengar" instrumen. Jika diputar terlalu mentok ke kanan, sirkuit akan meledak secara elektronik (suara cacat/<i>Distortion</i>). Posisi teraman biasanya di arah Jam 10 hingga 12.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                      <p className="text-blue-800 font-medium text-sm">
                        <strong>PRO-TIP:</strong> Cara kalibrasi Gain yang benar adalah menyuruh penyanyi bernyanyi sangat keras, lalu putar Gain pelan-pelan ke kanan hingga lampu indikator <strong>PEAK</strong> menyala merah, lalu <strong>mundurkan sedikit</strong> hingga PEAK mati.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPRESSOR */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 bg-[#1a1f2b] p-8 flex justify-center items-center border-b lg:border-b-0 lg:border-r-[6px] border-slate-800 min-h-[220px] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <div className="z-10 scale-125">
                      <Knob label="COMP" colorClass="knob-cap-yellow" value={35} disabled={true} />
                    </div>
                  </div>
                  <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-black text-slate-800 mb-4">COMPRESSOR (Penjinak Dinamika)</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Fitur magis Yamaha yang meratakan volume secara otomatis. Jika penyanyi tiba-tiba menjerit keras, *compressor* menahan volumenya agar speaker tidak jebol. Jika berbisik pelan, *compressor* membantu mengangkatnya. Putar di kisaran <strong>Jam 9 - 10</strong> untuk vokal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAB 3: EQUALIZER */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-300 pb-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-500 shadow-sm">
                <Waves size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 tracking-widest">
                Bab 3: Arsitektur Frekuensi (EQ)
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 bg-[#1a1f2b] p-10 flex flex-col items-center justify-center gap-8 border-b lg:border-b-0 lg:border-r-[6px] border-slate-800 min-h-[400px] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="z-10 scale-125">
                    <Knob label="HIGH" colorClass="knob-cap-green" value={65} disabled={true} />
                  </div>
                  <div className="z-10 scale-125">
                    <Knob label="MID" colorClass="knob-cap-green" value={45} disabled={true} />
                  </div>
                  <div className="z-10 scale-125">
                    <Knob label="LOW" colorClass="knob-cap-green" value={50} disabled={true} />
                  </div>
                </div>
                
                <div className="lg:col-span-7 p-10 flex flex-col justify-center space-y-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-black text-xl text-green-700 mb-2 border-b border-slate-200 pb-2">HIGH (Treble - 10 kHz)</h4>
                    <p className="text-slate-600 text-md leading-relaxed">
                      Ruang udara (*Air*) dan kejelasan konsonan (S/T). Angkat (Jam 1-2) untuk membuat vokal lebih mahal dan gemerincing. Turunkan jika suara simbal drum memekakkan telinga (*Harsh*).
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-black text-xl text-green-700 mb-2 border-b border-slate-200 pb-2">MID (Middle - 2.5 kHz)</h4>
                    <p className="text-slate-600 text-md leading-relaxed">
                      Jantung instrumen (Vokal & Gitar). Memotong MID sedikit (Jam 10-11) adalah trik rahasia teknisi untuk menghilangkan suara "sengau" (*Boxy/Honky*) seperti menyanyi dalam kaleng.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-black text-xl text-green-700 mb-2 border-b border-slate-200 pb-2">LOW (Bass - 100 Hz)</h4>
                    <p className="text-slate-600 text-md leading-relaxed">
                      Pondasi ketukan panggung (*Groove*). Terlalu banyak LOW akan membuat seluruh tata suara bergulung seperti lumpur (*Muddy Mix*), mengubur kejelasan vokal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAB 4: ROUTING & SPASIAL */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-300 pb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-500 shadow-sm">
                <Headphones size={32} className="text-purple-600" />
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 tracking-widest">
                Bab 4: Routing & Spasial
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AUX */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                <div className="bg-[#1a1f2b] p-8 flex justify-center items-center border-b-[6px] border-slate-800 min-h-[180px] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="z-10 scale-125">
                    <Knob label="AUX 1" colorClass="knob-cap-blue" value={60} disabled={true} />
                  </div>
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-black text-slate-800 mb-4">AUX (Monitor Send)</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Tugas AUX adalah "mencabang" audio untuk dikirim ke <strong>Speaker Monitor Lantai (Panggung)</strong>. Berbeda dengan Fader Utama yang mengarah ke penonton. Putar knob ini jika pemain drum berteriak meminta suara bassnya ditebalkan di monitornya sendiri.
                  </p>
                </div>
              </div>

              {/* PAN */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                <div className="bg-[#1a1f2b] p-8 flex justify-center items-center border-b-[6px] border-slate-800 min-h-[180px] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="z-10 scale-125">
                    <Knob label="PAN" colorClass="knob-cap-red" value={50} disabled={true} />
                  </div>
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-black text-slate-800 mb-4">PAN (Panorama L/R)</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Ilusi tata letak spasial. Vokal Utama, Bass, dan Kick Drum <strong>wajib ditegakkan lurus (Jam 12)</strong> agar terdengar tebal. Namun, jika Anda punya dua gitaris, geser PAN Gitar A agak ke Kiri dan Gitar B agak ke Kanan agar tidak saling bertabrakan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BAB 5: FADER & MASTER OUT */}
          <div>
            <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-300 pb-4">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-500 shadow-sm">
                <Activity size={32} className="text-orange-600" />
              </div>
              <h2 className="text-3xl font-black uppercase text-slate-800 tracking-widest">
                Bab 5: Bauran Akhir (The Mix)
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Visual Fader Box */}
                <div className="lg:col-span-5 bg-[#1a1f2b] p-10 flex justify-center items-end gap-6 border-b lg:border-b-0 lg:border-r-[6px] border-slate-800 min-h-[450px] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/50"></div>
                  
                  <div className="z-10 flex flex-col items-center gap-5">
                    <ToggleBtn label="ON" activeColor="bg-orange-500 shadow-[0_0_15px_orange]" active={true} disabled={true} />
                    <ToggleBtn label="ST" activeColor="bg-red-500 shadow-[0_0_15px_red]" active={true} disabled={true} type="small-rect" />
                    <div className="mt-4">
                      <Fader label="CH 1" capType="white" value={70} disabled={true} />
                    </div>
                  </div>

                  <div className="z-10 w-1 h-[280px] bg-slate-700/50 rounded-full mx-2 border-r border-white/5"></div>

                  <div className="z-10 flex flex-col items-center justify-end h-full">
                    <Fader label="STEREO" capType="red" value={80} disabled={true} />
                  </div>
                </div>

                {/* Text Explanation */}
                <div className="lg:col-span-7 p-10 flex flex-col justify-center space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3 border-b-2 border-orange-200 pb-2 inline-block">Sirkuit Bus (ON & ST)</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Mixer analog menggunakan rute "Bus". Tombol <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">ON</span> menyalakan saklar daya per channel. Tombol <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-bold">ST (Stereo)</span> mengarahkan suara dari channel tersebut ke "jalan tol" utama (Fader Merah). Lupa menekan ST berarti suara tidak akan pernah keluar ke penonton!
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3 border-b-2 border-slate-200 pb-2 inline-block">Konsep Unity Gain</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Perhatikan Fader Putih; angka <strong className="text-slate-900 text-xl">0</strong> berada agak di atas (garis tebal). Ini adalah <i>Unity Gain</i>, titik dimana Fader tidak menambah (+dB) atau menahan (-dB) laju listrik suara. Pertahankan posisi fader berdekatan dengan area 0 untuk kejernihan rasio dinamika terbaik.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
                    <h4 className="font-black text-red-700 flex items-center gap-2 mb-2">
                      <ShieldAlert size={20} /> FADER STEREO MERAH
                    </h4>
                    <p className="text-red-900 text-md font-medium">
                      Ini adalah pintu gerbang absolut menuju Speaker Panggung. Pastikan selalu ditarik turun hingga menyentuh dasar (0) setiap kali Anda hendak menekan saklar Daya Utama (POWER ON/OFF).
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
