import React from 'react';
import {
  Layers,
  Pause,
  Play,
  CheckCircle,
  Sliders,
  RefreshCw,
  HardDrive,
  DownloadCloud,
  FileCode,
  Radio,
  Tv
} from 'lucide-react';
import { BackgroundProcess } from '../types/network';

interface BackgroundProcessesViewProps {
  processes: BackgroundProcess[];
  onToggleProcessThrottle: (id: string) => void;
  onThrottleAll: () => void;
  onRestoreAll: () => void;
}

export const BackgroundProcessesView: React.FC<BackgroundProcessesViewProps> = ({
  processes,
  onToggleProcessThrottle,
  onThrottleAll,
  onRestoreAll
}) => {
  const totalBandwidthUsed = processes.reduce(
    (sum, p) => sum + (p.throttled ? p.currentBandwidthKbps * 0.15 : p.currentBandwidthKbps),
    0
  );

  const totalBandwidthSaved = processes.reduce(
    (sum, p) => sum + (p.throttled ? p.currentBandwidthKbps * 0.85 : 0),
    0
  );

  const throttledCount = processes.filter(p => p.throttled).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cloud':
        return <DownloadCloud className="w-4 h-4 text-sky-400" />;
      case 'system':
        return <HardDrive className="w-4 h-4 text-emerald-400" />;
      case 'telemetry':
        return <FileCode className="w-4 h-4 text-amber-400" />;
      case 'streaming':
        return <Tv className="w-4 h-4 text-purple-400" />;
      default:
        return <Radio className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Active Background Load</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">
              {(totalBandwidthUsed / 1024).toFixed(2)}
            </span>
            <span className="text-xs text-cyan-400 font-semibold uppercase">MB/s</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {processes.length} daemon services tracked
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Bandwidth Reclaimed</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              +{(totalBandwidthSaved / 1024).toFixed(2)}
            </span>
            <span className="text-xs text-emerald-400 font-semibold uppercase">MB/s</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {throttledCount} processes currently restricted
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Fast Optimization</span>
            <span className="text-xs text-slate-300 block">
              Throttle non-essential background daemons to reduce bufferbloat.
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onThrottleAll}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Throttle All
            </button>
            <button
              onClick={onRestoreAll}
              className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Android Kernel & OS Network Daemons</h3>
          </div>
          <span className="text-xs text-slate-400">
            NetworkCapabilities.NET_CAPABILITY_NOT_METERED
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {processes.map(proc => {
            const currentUsage = proc.throttled
              ? Math.round(proc.currentBandwidthKbps * 0.15)
              : proc.currentBandwidthKbps;

            return (
              <div
                key={proc.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {getCategoryIcon(proc.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-white">{proc.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{proc.serviceId}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-xl">{proc.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
                      <span>PACKETS: {proc.packetsCount.toLocaleString()}</span>
                      <span>MAX CAP: {proc.maxBandwidthKbps} Kbps</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Bandwidth</span>
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${
                        proc.throttled ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {currentUsage} Kbps
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleProcessThrottle(proc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      proc.throttled
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {proc.throttled ? 'Restricted' : 'Unrestricted'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
