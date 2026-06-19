import React from 'react';
import { Knob } from './Knob';
import { Fader } from './Fader';
import { ToggleBtn } from './ToggleBtn';
import { InputJack } from './InputJack';

export const ChannelStrip = ({
  num,
  state,
  updater,
  Icon,
  isInst,
  isStereo = false,
  highlightMap = {},
  disabled = false,
  power = false,
  isVisualOnly = false,
  selectedCable = null,
  onConnect = null
}) => {
  const isHigh = (key) => highlightMap[key] === true;

  // Visual Only mode prevents updating
  const handleUpdate = (k, v) => {
    if (!isVisualOnly && updater) {
      updater(k, v);
    }
  };

  return (
    <div className={`w-24 md:w-[105px] bg-[#232b38] rounded-sm shadow-inner border border-slate-700/80 flex flex-col items-center py-2 relative shrink-0 ${isVisualOnly ? 'opacity-80' : ''}`}>
      {/* Channel Header */}
      <div className="w-full h-6 bg-gradient-to-r from-blue-900/50 to-slate-800 flex justify-center items-center text-[10px] font-black text-blue-300 tracking-widest border-b border-blue-500/20 mb-3 shadow-md">
        CH {num}
      </div>

      {/* Input Section */}
      <div className="px-2 w-full flex justify-center">
        {isStereo ? (
          <div className="flex gap-1 justify-center">
             <InputJack
                type="line"
                connected={state.connected}
                icon={Icon}
                color="text-slate-400"
                label="L/MONO"
                id={`jack-${num}-l`}
                highlight={isHigh(`jack${num}`)}
                onDrop={(type) => handleUpdate('connected', type)}
                onDisconnect={() => handleUpdate('connected', false)}
                onClick={() => {
                  if (!state.connected && selectedCable && onConnect) onConnect();
                  else if (state.connected) handleUpdate('connected', false);
                }}
              />
              <InputJack
                type="line"
                connected={false}
                icon={Icon}
                color="text-slate-400"
                label="R"
                id={`jack-${num}-r`}
              />
          </div>
        ) : (
          <InputJack
            type={isInst ? 'line' : 'xlr'}
            connected={state.connected}
            icon={Icon}
            color={isInst ? 'text-emerald-400' : 'text-blue-400'}
            label={isInst ? 'INST/LINE' : 'MIC'}
            id={`jack-${num}`}
            highlight={isHigh(`jack${num}`)}
            onDrop={(type) => handleUpdate('connected', type)}
            onDisconnect={() => handleUpdate('connected', false)}
            onClick={() => {
              if (!state.connected && selectedCable && onConnect) onConnect();
              else if (state.connected) handleUpdate('connected', false);
            }}
          />
        )}
      </div>

      {/* Pad & HPF */}
      {!isStereo && (
        <div className="flex gap-2 w-full justify-center mb-4 mt-2">
          <ToggleBtn
            label="26dB"
            type="small-rect"
            activeColor="bg-slate-200 text-black shadow-[0_0_5px_white]"
            active={state.pad}
            onClick={() => handleUpdate('pad', !state.pad)}
            highlight={isHigh(`pad${num}`)}
            disabled={disabled}
          />
          <ToggleBtn
            label="80Hz"
            type="small-rect"
            activeColor="bg-slate-200 text-black shadow-[0_0_5px_white]"
            active={state.hpf}
            onClick={() => handleUpdate('hpf', !state.hpf)}
            highlight={isHigh(`hpf${num}`)}
            disabled={disabled}
          />
        </div>
      )}
      {isStereo && <div className="h-8 mb-4"></div>}

      {/* EQ & Controls Section */}
      <div className="flex flex-col gap-3 w-full items-center px-1">
        <Knob
          label="GAIN"
          colorClass="bg-gray-200"
          value={state.gain}
          onChange={(v) => handleUpdate('gain', v)}
          highlight={isHigh(`gain${num}`)}
          disabled={disabled}
        />
        
        {/* PEAK Indicator */}
        <div className="flex items-center gap-1 mt-[-6px] mb-[-2px]">
          <span className="text-[7px] text-red-400 font-bold tracking-wider">PEAK</span>
          <div
            className={`w-2.5 h-2.5 rounded-full border border-black/80 shadow-inner ${
              power && state.peak
                ? 'bg-red-500 shadow-[0_0_10px_red,inset_0_0_5px_white]'
                : 'bg-red-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
          ></div>
        </div>

        {!isStereo && (
          <Knob
            label="COMP"
            colorClass="bg-yellow-500"
            value={state.comp}
            onChange={(v) => handleUpdate('comp', v)}
            disabled={disabled}
          />
        )}

        <div className="w-[80%] h-[2px] bg-slate-900 shadow-[0_1px_0_rgba(255,255,255,0.1)] my-1"></div>

        <Knob
          label="HIGH"
          colorClass="bg-green-500"
          value={state.eqH}
          onChange={(v) => handleUpdate('eqH', v)}
          size="small"
          center={true}
          disabled={disabled}
        />
        <Knob
          label="MID"
          colorClass="bg-green-600"
          value={state.eqM}
          onChange={(v) => handleUpdate('eqM', v)}
          size="small"
          center={true}
          disabled={disabled}
        />
        <Knob
          label="LOW"
          colorClass="bg-green-700"
          value={state.eqL}
          onChange={(v) => handleUpdate('eqL', v)}
          size="small"
          center={true}
          disabled={disabled}
        />

        <div className="w-[80%] h-[2px] bg-slate-900 shadow-[0_1px_0_rgba(255,255,255,0.1)] my-1"></div>

        <Knob
          label="AUX 1"
          colorClass="bg-blue-500"
          value={state.aux1}
          onChange={(v) => handleUpdate('aux1', v)}
          size="small"
          disabled={disabled}
        />
        <Knob
          label="PAN"
          colorClass="bg-red-500"
          value={state.pan}
          onChange={(v) => handleUpdate('pan', v)}
          size="small"
          center={true}
          disabled={disabled}
        />

        {/* Channel Routing & Fader */}
        <div className="flex flex-col items-center mt-2 w-full gap-3 bg-slate-900/30 p-2 rounded-t-lg border-t border-slate-700/50">
          <div className="flex justify-evenly w-full px-1 gap-2">
            <ToggleBtn
              label="ON"
              activeColor="bg-orange-500 shadow-[0_0_12px_orange]"
              active={state.on}
              onClick={() => handleUpdate('on', !state.on)}
              highlight={isHigh(`on${num}`)}
              disabled={disabled}
            />
            <div className="flex flex-col gap-1.5">
              <ToggleBtn
                label="ST"
                type="small-rect"
                activeColor="bg-red-500 shadow-[0_0_8px_red]"
                active={state.st}
                onClick={() => handleUpdate('st', !state.st)}
                highlight={isHigh(`st${num}`)}
                disabled={disabled}
              />
              <ToggleBtn
                label="PFL"
                type="small-rect"
                activeColor="bg-yellow-400 text-black shadow-[0_0_8px_yellow]"
                active={state.pfl}
                onClick={() => handleUpdate('pfl', !state.pfl)}
                disabled={disabled}
              />
            </div>
          </div>

          <Fader
            label={`CH ${num}`}
            capType={isStereo ? "gray" : "white"}
            value={state.fader}
            onChange={(v) => handleUpdate('fader', v)}
            highlight={isHigh(`fader${num}`)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
