export type PingStatus = 'optimal' | 'stable' | 'degraded' | 'critical';

export interface PingSample {
  id: string;
  timestamp: number;
  latency: number;
  jitter: number;
  target: string;
  success: boolean;
  status: PingStatus;
}

export interface NetworkMetricSummary {
  currentPing: number;
  minPing: number;
  maxPing: number;
  avgPing: number;
  jitter: number;
  packetLoss: number;
  bufferbloatGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  estimatedBandwidth: number; // Mbps
  connectionType: string;
  effectiveType: string;
  signalStrengthDbm: number;
  signalPercentage: number;
  rtt: number;
  downlink: number;
  isSimulatedDrop: boolean;
}

export interface ProbeTarget {
  id: string;
  name: string;
  url: string;
  region: string;
  category: 'dns' | 'cdn' | 'edge' | 'gaming' | 'custom';
}

export interface BoostStep {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  durationMs: number;
}

export interface BoostSessionRecord {
  id: string;
  timestamp: number;
  networkType: string;
  targetTested: string;
  beforePing: number;
  afterPing: number;
  latencyDeltaPct: number;
  beforeJitter: number;
  afterJitter: number;
  beforePacketLoss: number;
  afterPacketLoss: number;
  processesOptimized: number;
  dnsResolver: string;
  hmacSha256: string;
  signatureValid: boolean;
  notes: string;
}

export interface BackgroundProcess {
  id: string;
  name: string;
  serviceId: string;
  category: 'system' | 'cloud' | 'telemetry' | 'streaming' | 'social';
  currentBandwidthKbps: number;
  maxBandwidthKbps: number;
  priority: 'high' | 'normal' | 'throttled' | 'blocked';
  packetsCount: number;
  throttled: boolean;
  description: string;
}

export interface DnsResolver {
  id: string;
  name: string;
  provider: string;
  primaryIp: string;
  dohUrl: string;
  pingMs: number | null;
  status: 'active' | 'tested' | 'idle';
  securityFeatures: string[];
  recommendedFor: string;
}

export interface AlertNotification {
  id: string;
  timestamp: number;
  type: 'warning' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  metricTrigger?: string;
  value?: number | string;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoAlertSignalDrops: boolean;
  pingThresholdMs: number;
  jitterThresholdMs: number;
  packetLossThresholdPct: number;
  autoOptimizeOnDrop: boolean;
  pingIntervalMs: number;
  selectedDnsId: string;
  activeTargetId: string;
  browserNotificationsRequested: boolean;
}
