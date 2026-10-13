import React, { useState } from 'react';
import {
  Globe,
  Zap,
  Shield,
  CheckCircle2,
  Play,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DnsResolver } from '../types/network';

interface DnsBenchmarkViewProps {
  resolvers: DnsResolver[];
  selectedDnsId: string;
  onSelectResolver: (id: string) => void;
  onBenchmarkAll: () => Promise<void>;
  isBenchmarking: boolean;
}

export const DnsBenchmarkView: React.FC<DnsBenchmarkViewProps> = ({
  resolvers,
  selectedDnsId,
  onSelectResolver,
  onBenchmarkAll,
  isBenchmarking
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">DNS-over-HTTPS (DoH) Engine</span>
          </div>
          <h3 className="text-base font-semibold text-white">Anycast Resolver Benchmark</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Directs domain lookup requests to the nearest edge PoP. Faster DNS resolution dramatically lowers time-to-first-byte (TTFB) and stabilizes web game match connections.
          </p>
        </div>

        <button
          onClick={onBenchmarkAll}
          disabled={isBenchmarking}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {isBenchmarking ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Benchmarking Resolvers...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Live DoH Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Resolvers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resolvers.map(res => {
          const isSelected = res.id === selectedDnsId;

          return (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{res.name}</h4>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ACTIVE ROUTE
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{res.provider}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">DoH Latency</span>
                  <span className="font-mono text-base font-bold text-cyan-400 tabular-nums">
                    {res.pingMs !== null ? `${res.pingMs.toFixed(1)} ms` : '--'}
                  </span>
                </div>
              </div>

              {/* Security features */}
              <div className="space-y-1 mb-4">
                {res.securityFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  Best for: {res.recommendedFor}
                </span>

                <button
                  onClick={() => onSelectResolver(res.id)}
                  disabled={isSelected}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Applied' : 'Activate DNS'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
