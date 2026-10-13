import React from 'react';
import { Volume2, VolumeX, Bell, ShieldCheck, Zap } from 'lucide-react';

export type NavTab = 'dashboard' | 'background' | 'dns' | 'history' | 'diagnostics';

interface TopHeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unreadAlertCount: number;
  onOpenNotifications: () => void;
  onOpenSecurityAudit: () => void;
  isBoostActive: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  unreadAlertCount,
  onOpenNotifications,
  onOpenSecurityAudit,
  isBoostActive
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            NetPulse <span className="text-cyan-400">Turbo</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('background')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'background'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Background Tasks
          </button>
          <button
            onClick={() => onTabChange('dns')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'dns'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            DNS Engine
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'history'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            History & Trends
          </button>
          <button
            onClick={() => onTabChange('diagnostics')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'diagnostics'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Diagnostics
          </button>
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            title={soundEnabled ? 'Low-latency tactical synth audio active' : 'Tactical audio muted'}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Drawer Trigger */}
          <button
            onClick={onOpenNotifications}
            aria-label="View network notifications"
            className="relative p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Mobile Application Security Audit Button */}
          <button
            onClick={onOpenSecurityAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Audit Vault</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar for touch screen thumb access */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-950 overflow-x-auto text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('background')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'background' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Processes
        </button>
        <button
          onClick={() => onTabChange('dns')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'dns' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          DNS
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'history' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          History
        </button>
        <button
          onClick={() => onTabChange('diagnostics')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'diagnostics' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Diagnostics
        </button>
      </div>
    </header>
  );
};
