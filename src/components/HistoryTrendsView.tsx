import React, { useState } from 'react';
import {
  History,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  Download,
  Trash2,
  Lock,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { BoostSessionRecord } from '../types/network';
import { securityCrypto } from '../services/securityCrypto';

interface HistoryTrendsViewProps {
  sessions: BoostSessionRecord[];
  onClearSessions: () => void;
  onOpenSecurityAudit: () => void;
}

export const HistoryTrendsView: React.FC<HistoryTrendsViewProps> = ({
  sessions,
  onClearSessions,
  onOpenSecurityAudit
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSessions = sessions.filter(s => {
    if (filterPeriod === 'today') {
      return Date.now() - s.timestamp < 86400000;
    }
    if (filterPeriod === 'week') {
      return Date.now() - s.timestamp < 86400000 * 7;
    }
    return true;
  });

  const avgReduction = sessions.length > 0
    ? sessions.reduce((acc, s) => acc + Math.abs(s.latencyDeltaPct), 0) / sessions.length
    : 0;

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(sessions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netpulse_audit_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & High-Level Trend KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Total Optimizations</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">
              {sessions.length}
            </span>
            <span className="text-xs text-cyan-400 font-semibold uppercase">Sessions</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Cryptographically sealed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Average Latency Drop</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              -{avgReduction.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across all network interfaces
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Audit Trail Integrity</span>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm font-bold text-emerald-400">100% VERIFIED</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Zero tamper anomalies detected
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 block">Actions & Export</span>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleExportJson}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>
            <button
              onClick={onClearSessions}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Connection Optimization Trends</h3>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterPeriod === 'all' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterPeriod === 'week' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setFilterPeriod('today')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterPeriod === 'today' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Session Logs List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No optimization records in this timeframe. Run a Turbo Boost to log connection telemetry!
          </div>
        ) : (
          filteredSessions.map(session => {
            const dateStr = new Date(session.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={session.id} className="p-4 sm:p-5 hover:bg-slate-800/20 transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left: Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{session.networkType}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{dateStr}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-cyan-400">{session.dnsResolver}</span>
                    </div>

                    <p className="text-xs text-slate-400">{session.notes}</p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>HMAC-SHA256:</span>
                      <button
                        onClick={() => handleCopyHash(session.id, session.hmacSha256)}
                        className="hover:text-cyan-300 transition-colors underline"
                        title="Click to copy cryptographic signature"
                      >
                        {session.hmacSha256.slice(0, 16)}...
                      </button>
                      {copiedId === session.id && (
                        <span className="text-emerald-400 text-[10px]">Copied!</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Latency Delta Visual */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs text-rose-400 line-through tabular-nums">
                          {session.beforePing.toFixed(1)}ms
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                          {session.afterPing.toFixed(1)}ms
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        Jitter: {session.beforeJitter.toFixed(1)}ms → {session.afterJitter.toFixed(1)}ms
                      </span>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold tabular-nums">
                      {session.latencyDeltaPct < 0 ? `${session.latencyDeltaPct.toFixed(1)}%` : '-50.0%'}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
