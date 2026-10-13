import React from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  X,
  Sliders,
  Radio,
  Volume2
} from 'lucide-react';
import { AlertNotification, AppSettings } from '../types/network';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AlertNotification[];
  onClearNotifications: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRequestBrowserNotification: () => void;
  onSendTestAlert: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotifications,
  settings,
  onUpdateSettings,
  onRequestBrowserNotification,
  onSendTestAlert
}) => {
  if (!isOpen) return null;

  const hasNativeNotification = typeof window !== 'undefined' && 'Notification' in window;
  const permissionState = hasNativeNotification ? Notification.permission : 'unsupported';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Signal Alerts &amp; Notifications</h3>
              <p className="text-xs text-slate-400">Autonomous network drop detection &amp; triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Threshold Configurations */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Alert Trigger Thresholds
            </span>
            <button
              onClick={onSendTestAlert}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Test Alert Signal
            </button>
          </div>

          {/* Threshold Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Alert on Ping Exceeding:</span>
                <span className="font-mono text-cyan-300 tabular-nums">{settings.pingThresholdMs} ms</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={settings.pingThresholdMs}
                onChange={e => onUpdateSettings({ pingThresholdMs: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Alert on Jitter Exceeding:</span>
                <span className="font-mono text-amber-300 tabular-nums">±{settings.jitterThresholdMs} ms</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={settings.jitterThresholdMs}
                onChange={e => onUpdateSettings({ jitterThresholdMs: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Audible Drop Chime (Web Audio Synthesizer)</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Auto-Alert on Signal Drop Simulation</span>
              <input
                type="checkbox"
                checked={settings.autoAlertSignalDrops}
                onChange={e => onUpdateSettings({ autoAlertSignalDrops: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Auto-Trigger Turbo Boost When Connection Degrades</span>
              <input
                type="checkbox"
                checked={settings.autoOptimizeOnDrop}
                onChange={e => onUpdateSettings({ autoOptimizeOnDrop: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Native Browser Notifications */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Native System Notifications:</span>
              <span className="font-mono uppercase text-slate-200">[{permissionState}]</span>
            </div>

            {permissionState !== 'granted' && hasNativeNotification && (
              <button
                onClick={onRequestBrowserNotification}
                className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-semibold"
              >
                Enable System Push
              </button>
            )}
          </div>
        </div>

        {/* Notifications Activity Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Network Alert History ({notifications.length})
            </h4>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-950/40 border border-slate-800 max-h-56 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No recent alerts. Network latency has remained within stable parameters.
              </div>
            ) : (
              notifications.map(notif => {
                const time = new Date(notif.timestamp).toLocaleTimeString();
                const isAlert = notif.type === 'alert' || notif.type === 'warning';

                return (
                  <div key={notif.id} className="p-3.5 flex items-start gap-3 hover:bg-slate-800/20">
                    <div className="mt-0.5 shrink-0">
                      {isAlert ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isAlert ? 'text-rose-300' : 'text-slate-200'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono tabular-nums">{time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
