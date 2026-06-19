import React from 'react';
import {
  FileText,
  Printer,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Activity,
  Power,
} from 'lucide-react';
import { Knob } from './Knob';
import { Fader } from './Fader';
import { ToggleBtn } from './ToggleBtn';

export const ManualBook = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-[#0f172a] overflow-y-auto p-4 md:p-8 relative">
      {/* Floating Action Button for Print */}
      <button
        onClick={handlePrint}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center gap-2 font-bold transition-transform hover:scale-110 z-50 print:hidden border border-blue-400"
      >
        <Printer size={24} />
        Cetak PDF
      </button>

      <div className="max-w-5xl mx-auto bg-slate-900 shadow-2xl rounded-2xl p-8 md:p-14 text-slate-300 font-sans leading-relaxed border border-slate-700 print:shadow-none print:p-0 print:bg-white print:text-black">
        <div className="text-center border-b-4 border-slate-700 pb-8 mb-10">
          <h1 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 print:text-black">
            Buku Panduan Operasional & Manajemen Mixer
          </h1>
          <p className="text-xl text-slate-400 font-bold tracking-wide">
            Spesifikasi Unit: YAMAHA MG16XU Professional Audio Mixing Console
          </p>
        </div>

        {/* REGULASI */}
        <div className="bg-slate-800/80 border-l-4 border-blue-500 p-6 mb-8 rounded-r-xl shadow-lg">
          <h3 className="font-black text-blue-400 uppercase mb-4 flex items-center gap-3 text-lg tracking-wider">
            <FileText size={24} />
            Regulasi & Ketentuan Fasilitas Studio
          </h3>
          <ul className="list-disc pl-6 space-y-3 text-slate-300 font-medium text-md">
            <li>
              <span className="text-white font-bold">
                Ketersediaan Alat Tetap:
              </span>{' '}
              Studio hanya menyediakan 1 Unit Mixer (Yamaha MG16XU), 1 Set
              Acoustic/Digital Drum, dan 2 Unit Microphone Standar.
            </li>
            <li>
              <span className="text-white font-bold">Instrumen Pribadi:</span>{' '}
              Pengguna wajib membawa instrumen mandiri beserta kelengkapannya.
            </li>
            <li>
              <span className="text-white font-bold">
                Sistem Integrasi Kabel:
              </span>{' '}
              Seluruh ujung jack audio input telah dilengkapi dengan label
              permanen (contoh: Mic 1, Gitar, Bass). Hubungkan instrumen merujuk
              pada label tersebut di area <strong>RAK KABEL</strong>.
            </li>
          </ul>
        </div>

        {/* WARNING */}
        <div className="bg-red-950/30 border-l-4 border-red-500 p-6 mb-12 rounded-r-xl shadow-lg relative overflow-hidden">
          <ShieldAlert
            size={100}
            className="absolute -right-6 -bottom-6 text-red-500/10"
          />
          <h3 className="font-black text-red-400 uppercase mb-3 flex items-center gap-2 text-lg tracking-wider">
            <ShieldAlert size={24} />
            Peringatan Batasan Risiko Kerja
          </h3>
          <p className="text-red-200 m-0 font-medium text-md leading-loose">
            Kelalaian dalam menerapkan urutan pengaktifan (Turn-On) atau
            penonaktifan (Turn-Off) daya dapat memicu letupan keras (Popping
            Sound). Kejadian ini berisiko fatal merusak membran internal speaker
            studio hingga jebol.{' '}
            <strong>
              Seluruh pengguna diwajibkan memahami SOP pada Bab 1 buku ini.
            </strong>
          </p>
        </div>

        {/* BAB 1 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600 shadow-inner">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest">
              Bab 1: Protokol Standar Operasional Prosedur (SOP)
            </h2>
          </div>
          <p className="mb-8 text-slate-400 font-medium text-lg">
            Seluruh pengguna studio wajib mematuhi tiga urutan fase operasional
            di bawah ini secara disiplin demi menjaga keamanan sistem sirkuit
            elektronik audio:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fase 1 */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors">
              <h4 className="font-black text-emerald-400 uppercase mb-4 pb-3 border-b border-slate-700 flex items-center gap-2">
                <Power size={18} /> Fase 1: Power-ON
              </h4>
              <ol className="list-decimal pl-5 space-y-3 text-slate-300 font-medium text-sm">
                <li>
                  Tarik <strong>Seluruh Fader (Putih & Merah)</strong> ke posisi
                  paling bawah (0 mutlak).
                </li>
                <li>Colok kabel instrumen ke ujung jack mixer.</li>
                <li>
                  Tekan tombol master <strong>POWER MIXER</strong>.
                </li>
                <li>Nyalakan amplifier instrumen masing-masing.</li>
              </ol>
            </div>

            {/* Fase 2 */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <h4 className="font-black text-blue-400 uppercase mb-4 pb-3 border-b border-slate-700 flex items-center gap-2">
                <Activity size={18} /> Fase 2: Soundcheck
              </h4>
              <ol className="list-decimal pl-5 space-y-3 text-slate-300 font-medium text-sm">
                <li>
                  Dorong <strong>Fader STEREO OUT (Merah)</strong> ke kisaran
                  70-80.
                </li>
                <li>
                  Tekan tombol <strong>ON</strong> dan <strong>ST</strong> pada
                  channel.
                </li>
                <li>
                  Dorong <strong>Fader Channel (Putih)</strong> ke atas secara
                  bertahap.
                </li>
                <li>
                  Putar <strong>GAIN</strong> jika suara kurang keras, awasi
                  lampu PEAK.
                </li>
              </ol>
            </div>

            {/* Fase 3 */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-red-500 transition-colors">
              <h4 className="font-black text-red-400 uppercase mb-4 pb-3 border-b border-slate-700 flex items-center gap-2">
                <Power size={18} /> Fase 3: Power-OFF
              </h4>
              <ol className="list-decimal pl-5 space-y-3 text-slate-300 font-medium text-sm">
                <li>
                  Tarik kembali <strong>Seluruh Fader (Putih & Merah)</strong>{' '}
                  ke posisi 0.
                </li>
                <li>Matikan unit Speaker & Amplifier instrumen.</li>
                <li>
                  Tekan tombol <strong>POWER MIXER</strong> untuk mematikan
                  mixer.
                </li>
                <li>Cabut seluruh kabel instrumen.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* BAB 2 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600 shadow-inner">
              <Sliders size={28} className="text-yellow-400" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest">
              Bab 2: Anatomi Input Atas (Channel Strip I)
            </h2>
          </div>

          <div className="space-y-6">
            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <ToggleBtn
                  label="PAD"
                  type="small-rect"
                  active={true}
                  disabled={true}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  PAD Switch (26dB)
                </h3>
                <p className="text-slate-400 font-medium">
                  Melemahkan amplitudo sinyal input sebesar 26dB. Biarkan tidak
                  aktif (ke atas) untuk mic vokal. Tekan ke dalam untuk
                  instrumen berdaya aktif tinggi (Keyboard / Gitar Bass aktif)
                  agar suara tidak pecah/distorsi di tahap awal.
                </p>
              </div>
            </div>

            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <ToggleBtn
                  label="HPF"
                  type="small-rect"
                  active={true}
                  disabled={true}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  HPF Switch (80Hz)
                </h3>
                <p className="text-slate-400 font-medium">
                  High-Pass Filter. Memblokir frekuensi rendah di bawah 80Hz.{' '}
                  <strong>WAJIB ditekan</strong> untuk channel Mic Vokal guna
                  mereduksi noise getaran langkah kaki atau hembusan napas.
                  Jangan ditekan untuk Bass atau Kick Drum karena akan
                  menghilangkan karakter low-nya.
                </p>
              </div>
            </div>

            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <div className="scale-125 transform origin-center">
                  <Knob
                    label="GAIN"
                    colorClass="knob-cap-white"
                    value={50}
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  GAIN Control
                </h3>
                <p className="text-slate-400 font-medium">
                  Tingkat sensitivitas pre-amp utama. Posisi standar berada di
                  kisaran <strong>Jam 10 hingga 12</strong>. Dilarang keras
                  memutar knob ini secara penuh karena akan memicu sinyal
                  terpotong (Clipping) yang berbahaya bagi sistem speaker.
                </p>
              </div>
            </div>

            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <div className="scale-125 transform origin-center">
                  <Knob
                    label="COMP"
                    colorClass="knob-cap-yellow"
                    value={30}
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  COMP (Compressor)
                </h3>
                <p className="text-slate-400 font-medium">
                  Sistem kompresor 1-knob Yamaha. Berfungsi meratakan dinamika
                  volume (menekan suara terlalu keras, mengangkat suara yang
                  terlalu pelan). Gunakan proporsional untuk vokal pada{' '}
                  <strong>Jam 9 - 10</strong>. Untuk instrumen yang sudah
                  menggunakan efek kompresor sendiri, biarkan di angka 0.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BAB 3 */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600 shadow-inner">
              <Sliders size={28} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest">
              Bab 3: Equalizer & Monitor (Channel Strip II)
            </h2>
          </div>

          <div className="space-y-6">
            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex flex-col justify-center gap-4">
                <Knob
                  label="HIGH"
                  colorClass="knob-cap-green"
                  value={50}
                  disabled={true}
                />
                <Knob
                  label="MID"
                  colorClass="knob-cap-green"
                  value={50}
                  disabled={true}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  3-Band Equalizer (HIGH, MID, LOW)
                </h3>
                <p className="text-slate-400 font-medium">
                  Pengaturan pemerataan frekuensi (Treble, Middle, Bass).
                  Setelan awal sangat diwajibkan berada di{' '}
                  <strong>Jam 12 (Posisi Tengah / Flat)</strong>. Putar sedikit
                  ke kiri atau kanan saja jika diperlukan penyesuaian karakter
                  suara dari panggung.
                </p>
              </div>
            </div>

            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <div className="scale-125 transform origin-center">
                  <Knob
                    label="AUX 1"
                    colorClass="knob-cap-blue"
                    value={40}
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  AUX 1 / AUX 2 Send
                </h3>
                <p className="text-slate-400 font-medium">
                  Mengirimkan salinan suara spesifik channel tersebut ke jalur
                  keluaran lain, biasanya{' '}
                  <strong>Speaker Monitor Lantai</strong> penyanyi. Putar
                  perlahan menuju Jam 12 jika pemain mengeluhkan suaranya tidak
                  terdengar di atas panggung.
                </p>
              </div>
            </div>

            {/* Component Item */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex justify-center">
                <div className="scale-125 transform origin-center">
                  <Knob
                    label="PAN"
                    colorClass="knob-cap-red"
                    value={50}
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  PAN (Panorama) Control
                </h3>
                <p className="text-slate-400 font-medium">
                  Mendistribusikan aliran suara antara Speaker Kiri dan Speaker
                  Kanan. Untuk latihan studio standar,{' '}
                  <strong>WAJIB tegak lurus di Arah Jam 12 (Tengah)</strong>{' '}
                  agar suara merata di seluruh ruangan. Hanya putar penuh untuk
                  instrumen spesifik seperti Tom Drum L/R atau Keyboard Stereo
                  L/R.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BAB 4 */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600 shadow-inner">
              <Activity size={28} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest">
              Bab 4: Routing & Master Output
            </h2>
          </div>

          <div className="space-y-6">
            {/* Routing Buttons */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-24 shrink-0 flex flex-col items-center gap-4">
                <ToggleBtn
                  label="ON"
                  activeColor="bg-orange-500 shadow-[0_0_10px_orange]"
                  active={true}
                  disabled={true}
                />
                <ToggleBtn
                  label="ST"
                  activeColor="bg-red-500 shadow-[0_0_10px_red]"
                  active={true}
                  disabled={true}
                  type="small-rect"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Tombol Routing (ON & ST)
                </h3>
                <p className="text-slate-400 font-medium mb-2">
                  <strong className="text-orange-400">Tombol ON:</strong> Saklar
                  utama untuk mengaktifkan seluruh modul di channel tersebut.
                  Wajib menyala terang berwarna oranye agar suara bisa diproses.
                </p>
                <p className="text-slate-400 font-medium">
                  <strong className="text-red-400">Tombol ST:</strong> Singkatan
                  dari Stereo. Berfungsi melempar aliran audio yang sudah
                  diproses menuju ke Master Fader Utama.{' '}
                  <strong>PENTING:</strong> Jika tombol ST tidak ditekan, suara
                  selamanya tidak akan terdengar di speaker studio.
                </p>
              </div>
            </div>

            {/* Faders */}
            <div className="flex bg-slate-800/30 p-6 rounded-xl border border-slate-700 items-center gap-8">
              <div className="w-32 shrink-0 flex justify-center gap-2">
                <div className="scale-75 transform origin-top">
                  <Fader
                    label="CH 1"
                    capType="white"
                    value={70}
                    disabled={true}
                  />
                </div>
                <div className="scale-75 transform origin-top">
                  <Fader
                    label="STEREO"
                    capType="red"
                    value={80}
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Fader Channel & Master
                </h3>
                <p className="text-slate-400 font-medium mb-3">
                  <strong className="text-white">Fader Putih (Channel):</strong>{' '}
                  Menentukan porsi volume untuk instrumen di channel tersebut
                  dalam bauran keseluruhan (Mix). Posisi normal berada di
                  sekitar angka 0 (garis panduan tebal).
                </p>
                <p className="text-slate-400 font-medium">
                  <strong className="text-red-400">
                    Fader Merah (STEREO OUT):
                  </strong>{' '}
                  Pengatur volume gerbang akhir untuk seluruh suara sebelum
                  dikirim ke speaker utama studio. Titik paling aman berada di
                  bawah angka 0.{' '}
                  <strong>
                    Mutlak diturunkan ke titik paling dasar (0) sebelum
                    menyalakan atau mematikan kelistrikan Mixer!
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
