import {
  AppSettings,
  BackgroundProcess,
  BoostSessionRecord,
  DnsResolver,
  AlertNotification
} from '../types/network';
import { securityCrypto } from './securityCrypto';

const STORAGE_KEYS = {
  SETTINGS: 'netpulse_settings_v1',
  SESSIONS: 'netpulse_sessions_v1',
  PROCESSES: 'netpulse_processes_v1',
  DNS_RESOLVERS: 'netpulse_dns_resolvers_v1',
  NOTIFICATIONS: 'netpulse_notifications_v1'
};

export const INITIAL_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  autoAlertSignalDrops: true,
  pingThresholdMs: 80,
  jitterThresholdMs: 15,
  packetLossThresholdPct: 2.0,
  autoOptimizeOnDrop: false,
  pingIntervalMs: 1200,
  selectedDnsId: 'cloudflare_doh',
  activeTargetId: 'cloudflare',
  browserNotificationsRequested: false
};

export const INITIAL_PROCESSES: BackgroundProcess[] = [
  {
    id: 'proc_cloud_sync',
    name: 'Cloud Drive Auto-Sync Daemon',
    serviceId: 'com.android.sync.provider',
    category: 'cloud',
    currentBandwidthKbps: 1840,
    maxBandwidthKbps: 3200,
    priority: 'normal',
    packetsCount: 4210,
    throttled: false,
    description: 'Background delta sync uploading camera reel and desktop folders'
  },
  {
    id: 'proc_app_updater',
    name: 'Package Manager Silent Update',
    serviceId: 'com.android.vending.updater',
    category: 'system',
    currentBandwidthKbps: 2450,
    maxBandwidthKbps: 4500,
    priority: 'normal',
    packetsCount: 8930,
    throttled: false,
    description: 'Pre-fetching app asset bundles and differential patches'
  },
  {
    id: 'proc_telemetry_diag',
    name: 'OS Telemetry & Error Metrics',
    serviceId: 'com.android.system.diagd',
    category: 'telemetry',
    currentBandwidthKbps: 620,
    maxBandwidthKbps: 1100,
    priority: 'normal',
    packetsCount: 1840,
    throttled: false,
    description: 'Periodic ANR crash dumps and hardware trace telemetry'
  },
  {
    id: 'proc_media_prefetch',
    name: 'Video Cache & Stream Prefetcher',
    serviceId: 'com.media.avbuffer.service',
    category: 'streaming',
    currentBandwidthKbps: 3100,
    maxBandwidthKbps: 5800,
    priority: 'normal',
    packetsCount: 14200,
    throttled: false,
    description: 'Aggressive 4K video segment buffer lookahead'
  },
  {
    id: 'proc_social_push',
    name: 'Push Notification Keep-Alive Broker',
    serviceId: 'com.google.android.gms.fcm',
    category: 'social',
    currentBandwidthKbps: 340,
    maxBandwidthKbps: 800,
    priority: 'high',
    packetsCount: 920,
    throttled: false,
    description: 'Persistent multiplexed TLS ping socket for real-time messages'
  }
];

export const INITIAL_DNS_RESOLVERS: DnsResolver[] = [
  {
    id: 'cloudflare_doh',
    name: 'Cloudflare 1.1.1.1 (Warp DNS)',
    provider: 'Cloudflare Anycast',
    primaryIp: '1.1.1.1',
    dohUrl: 'https://cloudflare-dns.com/dns-query',
    pingMs: 11.4,
    status: 'active',
    securityFeatures: ['DNS-over-HTTPS (DoH)', 'EDNS0 Zero-Logging', 'DNSSEC Validated'],
    recommendedFor: 'Gaming & Ultra-low jitter'
  },
  {
    id: 'google_doh',
    name: 'Google Public DNS',
    provider: 'Google Edge Network',
    primaryIp: '8.8.8.8',
    dohUrl: 'https://dns.google/resolve',
    pingMs: 14.8,
    status: 'tested',
    securityFeatures: ['DNS-over-TLS (DoT)', 'DNSSEC Validation', 'DDoS Resilient'],
    recommendedFor: 'Global CDN Routing Stability'
  },
  {
    id: 'quad9_doh',
    name: 'Quad9 Security DNS',
    provider: 'Quad9 Foundation',
    primaryIp: '9.9.9.9',
    dohUrl: 'https://dns.quad9.net/dns-query',
    pingMs: 17.2,
    status: 'tested',
    securityFeatures: ['Threat Intelligence Filter', 'Swiss Privacy Shield', 'No Telemetry'],
    recommendedFor: 'Malware & Phishing Armor'
  },
  {
    id: 'adguard_doh',
    name: 'AdGuard Ad-Shield DNS',
    provider: 'AdGuard Global',
    primaryIp: '94.140.14.14',
    dohUrl: 'https://dns.adguard-dns.com/dns-query',
    pingMs: 22.1,
    status: 'tested',
    securityFeatures: ['Tracker Blocker', 'Telemetry Interceptor', 'Ad Domain Filter'],
    recommendedFor: 'Saving Mobile Data Bandwidth'
  }
];

class StorageService {
  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    } catch {
      // Fallback
    }
    return INITIAL_SETTINGS;
  }

  public saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  public getProcesses(): BackgroundProcess[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROCESSES);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_PROCESSES;
  }

  public saveProcesses(processes: BackgroundProcess[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
    } catch {
      // Ignore
    }
  }

  public getDnsResolvers(): DnsResolver[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DNS_RESOLVERS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return INITIAL_DNS_RESOLVERS;
  }

  public saveDnsResolvers(resolvers: DnsResolver[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DNS_RESOLVERS, JSON.stringify(resolvers));
    } catch {
      // Ignore
    }
  }

  public async getSessions(): Promise<BoostSessionRecord[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
        const records: BoostSessionRecord[] = JSON.parse(data);
        // Verify signatures
        for (const record of records) {
          record.signatureValid = await securityCrypto.verifySession(record);
        }
        return records;
      }
    } catch {
      // Fallback
    }

    // Seed baseline session on first launch
    const seedTime = Date.now() - 3600000 * 4;
    const initialSessionUnsigned = {
      id: 'session_init_' + seedTime,
      timestamp: seedTime,
      networkType: 'WiFi 6 (5GHz)',
      targetTested: 'Cloudflare Edge (1.1.1.1)',
      beforePing: 64.2,
      afterPing: 21.5,
      latencyDeltaPct: -66.5,
      beforeJitter: 12.8,
      afterJitter: 2.1,
      beforePacketLoss: 1.5,
      afterPacketLoss: 0.0,
      processesOptimized: 4,
      dnsResolver: 'Cloudflare 1.1.1.1 (Warp DNS)',
      notes: 'Initial connection baseline calibration & TCP socket pool flush'
    };

    const signature = await securityCrypto.signSession(initialSessionUnsigned);
    const initialSession: BoostSessionRecord = {
      ...initialSessionUnsigned,
      hmacSha256: signature,
      signatureValid: true
    };

    this.saveSessions([initialSession]);
    return [initialSession];
  }

  public saveSessions(sessions: BoostSessionRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }

  public async addSessionRecord(recordData: Omit<BoostSessionRecord, 'hmacSha256' | 'signatureValid'>): Promise<BoostSessionRecord> {
    const signature = await securityCrypto.signSession(recordData);
    const fullRecord: BoostSessionRecord = {
      ...recordData,
      hmacSha256: signature,
      signatureValid: true
    };

    const existing = await this.getSessions();
    const updated = [fullRecord, ...existing].slice(0, 50); // Keep last 50
    this.saveSessions(updated);
    return fullRecord;
  }

  public clearSessions() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch {
      // Ignore
    }
  }

  public getNotifications(): AlertNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'notif_welcome',
        timestamp: Date.now() - 1000 * 60 * 10,
        type: 'info',
        title: 'NetPulse Active Engine Initialized',
        message: 'Real-time telemetry monitor active. Zero packet loss detected.',
        read: false
      }
    ];
  }

  public saveNotifications(notifs: AlertNotification[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch {
      // Ignore
    }
  }

  public addNotification(notification: Omit<AlertNotification, 'id' | 'timestamp' | 'read'>): AlertNotification {
    const newNotif: AlertNotification = {
      ...notification,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      read: false
    };

    const existing = this.getNotifications();
    const updated = [newNotif, ...existing].slice(0, 30);
    this.saveNotifications(updated);
    return newNotif;
  }

  public clearNotifications() {
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    } catch {
      // Ignore
    }
  }
}

export const storage = new StorageService();
