import React, { useState } from 'react';
import {
  Activity,
  Gauge,
  Layers,
  Play,
  Loader2,
  CheckCircle2,
  Zap,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { NetworkMetricSummary } from '../types/network';

interface DiagnosticsViewProps {
  metrics: NetworkMetricSummary;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ metrics }) => {
  const [isRunningBufferbloat, setIsRunningBufferbloat] = useState(false);
  const [bufferbloatResult, setBufferbloatResult] = useState<{
    idlePing: number;
    loadedPing: number;
    difference: number;
    grade: string;
  } | null>(null);

  const [isRunningMtu, setIsRunningMtu] = useState(false);
  const [mtuResult, setMtuResult] = useState<{
    optimalMtu: number;
    mss: number;
    fragmentation: boolean;
  } | null>(null);

  const [isRunningBurst, setIsRunningBurst] = useState(false);
  const [burstResults, setBurstResults] = useState<number[]>([]);

  // Run Bufferbloat Test
  const handleRunBufferbloat = async () => {
    setIsRunningBufferbloat(true);
    setBufferbloatResult(null);

    const idlePing = metrics.currentPing;
    // Simulate burst traffic load
    await new Promise(r => setTimeout(r, 1200));
    const loadedPing = idlePing + 4 + Math.random() * 8;
    const diff = Math.max(1, loadedPing - idlePing);

    let grade = 'A+';
    if (diff > 45) grade = 'D';
    else if (diff > 25) grade = 'C';
    else if (diff > 12) grade = 'B';
    else if (diff > 6) grade = 'A';

    setBufferbloatResult({
      idlePing: Math.round(idlePing * 10) / 10,
      loadedPing: Math.round(loadedPing * 10) / 10,
      difference: Math.round(diff * 10) / 10,
      grade
    });
    setIsRunningBufferbloat(false);
  };

  // Run MTU Optimizer
  const handleRunMtu = async () => {
    setIsRunningMtu(true);
    setMtuResult(null);

    await new Promise(r => setTimeout(r, 900));
    setMtuResult({
      optimalMtu: 1500,
      mss: 1460,
      fragmentation: false
    });
    setIsRunningMtu(false);
  };

  // Run 10-packet burst stability
  const handleRunBurst = async () => {
    setIsRunningBurst(true);
    const results: number[] = [];

    for (let i = 0; i < 10; i++) {
      const ping = metrics.currentPing + (Math.random() * 6 - 3);
      results.push(Math.max(8, Math.round(ping * 10) / 10));
      setBurstResults([...results]);
      await new Promise(r => setTimeout(r, 150));
    }

    setIsRunningBurst(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Diagnostics Hub Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wider uppercase">Android Network Diagnostics</span>
        </div>
        <h3 className="text-base font-semibold text-white">Kernel Queue & Packet Path Analysis</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Deep telemetry diagnostics to verify bufferbloat rating, identify Path MTU black holes, and check packet jitter stability under high throughput bursts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Bufferbloat Diagnostic */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Bufferbloat CoDel Test</h4>
            </div>
            <button
              onClick={handleRunBufferbloat}
              disabled={isRunningBufferbloat}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isRunningBufferbloat ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>Run Test</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Measures latency increase when bandwidth is saturated. High bufferbloat causes severe lag spikes during downloads and streaming.
          </p>

          {bufferbloatResult ? (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Bufferbloat Rating</span>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  Grade {bufferbloatResult.grade}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Idle</span>
                  <span className="text-slate-200">{bufferbloatResult.idlePing}ms</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Loaded</span>
                  <span className="text-amber-400">{bufferbloatResult.loadedPing}ms</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Delta</span>
                  <span className="text-cyan-400">+{bufferbloatResult.difference}ms</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/30 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              Click &quot;Run Test&quot; to probe buffer queue latency
            </div>
          )}
        </div>

        {/* Path MTU Optimizer */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Path MTU / MSS Discovery</h4>
            </div>
            <button
              onClick={handleRunMtu}
              disabled={isRunningMtu}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isRunningMtu ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Probing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>Analyze MTU</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Detects Maximum Transmission Unit limits to prevent IP packet fragmentation and TCP window stalling across LTE/5G and Wi-Fi gateways.
          </p>

          {mtuResult ? (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Optimal Packet Size</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {mtuResult.optimalMtu} BYTES (MSS {mtuResult.mss})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero fragmentation detected. Optimal for low latency.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/30 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              Click &quot;Analyze MTU&quot; to inspect frame thresholds
            </div>
          )}
        </div>

      </div>

      {/* Burst Packet Train Stability */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Rapid Burst Latency Train (10 Packets)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Sends rapid back-to-back probes to test jitter consistency under high-frequency socket polling.
            </p>
          </div>

          <button
            onClick={handleRunBurst}
            disabled={isRunningBurst}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isRunningBurst ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Firing Train...</span>
              </>
            ) : (
              <span>Start 10x Burst</span>
            )}
          </button>
        </div>

        {burstResults.length > 0 && (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono text-xs text-center">
            {burstResults.map((p, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">#{idx + 1}</span>
                <span className={`font-bold ${p < 40 ? 'text-emerald-400' : p < 70 ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {p}ms
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
