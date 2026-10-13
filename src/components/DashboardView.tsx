import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Wifi,
  Radio,
  Gauge,
  Layers,
  Globe,
  AlertTriangle,
  RefreshCw,
  Server,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { NetworkMetricSummary, PingSample, ProbeTarget } from '../types/network';
import { OscilloscopeGraph } from './OscilloscopeGraph';

interface DashboardViewProps {
  metrics: NetworkMetricSummary;
  samples: PingSample[];
  activeTarget: ProbeTarget;
  targets: ProbeTarget[];
  onSelectTarget: (target: ProbeTarget) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onToggleSimulatedDrop: (active: boolean) => void;
  onRefreshPing: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  samples,
  activeTarget,
  targets,
  onSelectTarget,
  onRunOptimization,
  isOptimizing,
  onToggleSimulatedDrop,
  onRefreshPing
}) => {
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showCustomTarget, setShowCustomTarget] = useState(false);

  // Status color mapping
  const getStatusColor = () => {
    if (metrics.isSimulatedDrop) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (metrics.currentPing <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (metrics.currentPing <= 65) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (metrics.currentPing <= 120) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getStatusLabel = () => {
    if (metrics.isSimulatedDrop) return 'CRITICAL PACKET DROP';
    if (metrics.currentPing <= 30) return 'ULTRA-LOW LATENCY';
    if (metrics.currentPing <= 65) return 'STABILIZED ROUTE';
    if (metrics.currentPing <= 120) return 'MILD CONGESTION';
    return 'DEGRADED CONNECTION';
  };

  const handleApplyCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    
    let url = customUrlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const customTarget: ProbeTarget = {
      id: 'custom_' + Date.now(),
      name: new URL(url).hostname || 'Custom Host',
      url,
      region: 'User Defined',
      category: 'custom'
    };

    onSelectTarget(customTarget);
    setShowCustomTarget(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Hero Section: Latency HUD & One-Tap Boost */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Latency Hero Card */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top row status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Telemetry Prober
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 truncate max-w-[200px]">
                {activeTarget.name}
              </span>
            </div>

            <div className={`px-2.5 py-1 rounded-md border text-xs font-mono font-medium tracking-wide ${getStatusColor()}`}>
              {getStatusLabel()}
            </div>
          </div>

          {/* Core Latency Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl sm:text-6xl font-extrabold tabular-nums tracking-tight text-white">
                  {metrics.currentPing.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">ms</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Round-trip handshake latency to edge node
              </p>
            </div>

            {/* Quick telemetry indicators */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-0.5">Jitter Variance</span>
                <span className="font-mono tabular-nums text-sm font-bold text-amber-400">
                  ±{metrics.jitter.toFixed(1)} ms
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-0.5">Packet Loss</span>
                <span className={`font-mono tabular-nums text-sm font-bold ${metrics.packetLoss > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {metrics.packetLoss.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-0.5">Downlink Link</span>
                <span className="font-mono tabular-nums text-sm font-bold text-cyan-400">
                  {metrics.estimatedBandwidth.toFixed(0)} Mbps
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-0.5">Bufferbloat</span>
                <span className="font-mono tabular-nums text-sm font-bold text-emerald-400">
                  Grade {metrics.bufferbloatGrade}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Signal Strength & Manual Re-probe */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <div className="flex items-center gap-2">
                <span>Signal RSSI:</span>
                <span className="font-mono tabular-nums text-slate-200 font-semibold">{metrics.signalStrengthDbm} dBm</span>
                <span className="text-[11px] text-slate-500">({metrics.signalPercentage}%)</span>
              </div>
            </div>

            <button
              onClick={onRefreshPing}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Probe Now</span>
            </button>
          </div>
        </div>

        {/* Master One-Tap Boost Action Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wider uppercase">Optimizer Hub</span>
              </div>
              <span className="text-[11px] text-slate-500">Android Kernel Engine</span>
            </div>

            <h3 className="text-base font-semibold text-white">One-Tap Turbo Boost</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Purges stale socket pools, flushes resolver caches, throttles background sync vampires, and clamps MTU MSS to eliminate packet jitter.
            </p>
          </div>

          <div className="my-5">
            <button
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isOptimizing ? 'Optimizing Network Stack...' : 'Turbo Boost Connection'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="text-slate-500">Target Protocol</span>
            <span className="font-mono text-cyan-300">TCP MSS / DoH FastOpen</span>
          </div>
        </div>

      </div>

      {/* Real-Time Oscilloscope Waveform */}
      <OscilloscopeGraph
        samples={samples}
        currentPing={metrics.currentPing}
        avgPing={metrics.avgPing}
        minPing={metrics.minPing}
        maxPing={metrics.maxPing}
        jitter={metrics.jitter}
      />

      {/* Target Selector & Interface Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Probe Target Selector */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Benchmark Target</h4>
            </div>
            <button
              onClick={() => setShowCustomTarget(!showCustomTarget)}
              className="text-xs text-cyan-400 hover:underline"
            >
              {showCustomTarget ? 'Preset List' : '+ Custom Host'}
            </button>
          </div>

          {showCustomTarget ? (
            <form onSubmit={handleApplyCustomTarget} className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="e.g. google.com or my-vps.net"
                value={customUrlInput}
                onChange={e => setCustomUrlInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  Set Custom Host
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomTarget(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {targets.map(target => {
                const isSelected = activeTarget.id === target.id;
                return (
                  <button
                    key={target.id}
                    onClick={() => onSelectTarget(target)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="truncate">{target.name}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 truncate">{target.region}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Network Hardware & Carrier Diagnostics */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Network Interface Info</h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">ACTIVE INTERFACE</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block">Bearer Type</span>
              <span className="font-semibold text-slate-200">{metrics.connectionType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block">Link Category</span>
              <span className="font-semibold text-cyan-300">{metrics.effectiveType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block">Base Gateway RTT</span>
              <span className="font-mono text-slate-200 tabular-nums">{metrics.rtt} ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block">MTU Size</span>
              <span className="font-mono text-slate-200 tabular-nums">1500 (MSS 1460)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Signal Drop & Alert Simulator Card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${metrics.isSimulatedDrop ? 'text-rose-400' : 'text-amber-400'}`} />
              <h4 className="text-sm font-semibold text-white">Signal Drop & Latency Spike Simulator</h4>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Simulates real-world cellular signal drop or Wi-Fi channel interference (injects &gt;130ms latency &amp; packet loss) to test the notification system and automatic recovery alerts.
            </p>
          </div>

          <button
            onClick={() => onToggleSimulatedDrop(!metrics.isSimulatedDrop)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all shrink-0 ${
              metrics.isSimulatedDrop
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {metrics.isSimulatedDrop ? 'Disable Simulation (Restore Signal)' : 'Simulate Signal Drop'}
          </button>
        </div>
      </div>

    </div>
  );
};
