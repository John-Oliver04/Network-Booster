import React from 'react';
import { CheckCircle2, Loader2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { BoostStep } from '../types/network';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: BoostStep[];
  currentStepIndex: number;
  isComplete: boolean;
  beforePing: number;
  afterPing: number;
  latencyImprovementPct: number;
  cryptoSignature: string;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  steps,
  currentStepIndex,
  isComplete,
  beforePing,
  afterPing,
  latencyImprovementPct,
  cryptoSignature
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Network Stabilization Pipeline</h3>
              <p className="text-xs text-slate-400">Android OS socket pool & buffer tuning</p>
            </div>
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Steps List */}
        <div className="py-5 space-y-3">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex && !isComplete;
            const isDone = step.status === 'completed' || (isComplete && idx <= currentStepIndex);
            const isPending = !isCurrent && !isDone;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/30 border-cyan-500/40'
                    : isDone
                    ? 'bg-slate-900/40 border-slate-800/80'
                    : 'bg-slate-950/20 border-transparent opacity-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-800/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isCurrent ? 'text-cyan-300' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    {isDone && (
                      <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
                        OPTIMIZED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results Card if complete */}
        {isComplete && (
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 mb-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-semibold text-white">Connection Latency Delta</span>
              <span className="font-mono tabular-nums text-emerald-400 font-bold">
                {latencyImprovementPct > 0 ? `-${latencyImprovementPct.toFixed(1)}%` : 'STABILIZED'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Before Boost</span>
                <span className="font-mono tabular-nums text-sm font-bold text-rose-400">
                  {beforePing.toFixed(1)} ms
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stabilized Latency</span>
                <span className="font-mono tabular-nums text-sm font-bold text-emerald-400">
                  {afterPing.toFixed(1)} ms
                </span>
              </div>
            </div>

            {/* Cryptographic Signature Seal */}
            {cryptoSignature && (
              <div className="mt-3 pt-3 border-t border-cyan-900/40 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HMAC-SHA256 Session Seal</span>
                </div>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {cryptoSignature.slice(0, 10)}...{cryptoSignature.slice(-6)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA Button */}
        {isComplete ? (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            Apply & Return to Dashboard
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Tuning network stack parameters...</span>
          </div>
        )}
      </div>
    </div>
  );
};
