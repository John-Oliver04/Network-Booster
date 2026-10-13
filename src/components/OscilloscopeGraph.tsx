import React, { useMemo } from 'react';
import { PingSample } from '../types/network';

interface OscilloscopeGraphProps {
  samples: PingSample[];
  currentPing: number;
  avgPing: number;
  minPing: number;
  maxPing: number;
  jitter: number;
}

export const OscilloscopeGraph: React.FC<OscilloscopeGraphProps> = ({
  samples,
  currentPing,
  avgPing,
  minPing,
  maxPing,
  jitter
}) => {
  // Chart dimensions
  const width = 800;
  const height = 180;
  const paddingX = 20;
  const paddingY = 24;

  const { pointsPath, areaPath, activePoint } = useMemo(() => {
    if (samples.length === 0) {
      return { pointsPath: '', areaPath: '', activePoint: null };
    }

    const maxVal = Math.max(100, Math.ceil(maxPing * 1.25));
    const minVal = Math.max(0, Math.floor(minPing * 0.7));
    const range = Math.max(10, maxVal - minVal);

    const stepX = (width - paddingX * 2) / Math.max(1, samples.length - 1);

    const points = samples.map((sample, idx) => {
      const x = paddingX + idx * stepX;
      // Invert Y: higher ping is lower on screen
      const normalizedY = (sample.latency - minVal) / range;
      const y = height - paddingY - normalizedY * (height - paddingY * 2);
      return { x, y, sample };
    });

    if (points.length === 1) {
      const p = points[0];
      return {
        pointsPath: `M ${p.x} ${p.y}`,
        areaPath: `M ${p.x} ${p.y} L ${p.x} ${height - paddingY} Z`,
        activePoint: p
      };
    }

    // Build smooth SVG curve
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }

    const last = points[points.length - 1];
    const area = `${d} L ${last.x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return {
      pointsPath: d,
      areaPath: area,
      activePoint: last
    };
  }, [samples, maxPing, minPing]);

  const maxVal = Math.max(100, Math.ceil(maxPing * 1.25));
  const minVal = Math.max(0, Math.floor(minPing * 0.7));
  const range = Math.max(10, maxVal - minVal);
  const avgY = height - paddingY - ((avgPing - minVal) / range) * (height - paddingY * 2);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
      {/* Top telemetry sub-row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-300">Live Latency Waveform</span>
          <span className="font-mono tabular-nums text-cyan-400 font-semibold">{currentPing.toFixed(1)} ms</span>
        </div>
        <div className="flex items-center gap-4 font-mono tabular-nums text-[11px]">
          <span>MIN: <strong className="text-emerald-400">{minPing.toFixed(1)}ms</strong></span>
          <span>AVG: <strong className="text-slate-200">{avgPing.toFixed(1)}ms</strong></span>
          <span>MAX: <strong className="text-rose-400">{maxPing.toFixed(1)}ms</strong></span>
          <span>JITTER: <strong className="text-amber-400">±{jitter.toFixed(1)}ms</strong></span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-40 sm:h-44">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="latencyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#334155"
          />

          {/* Average reference line */}
          {avgY >= paddingY && avgY <= height - paddingY && (
            <line
              x1={paddingX}
              y1={avgY}
              x2={width - paddingX}
              y2={avgY}
              stroke="#0ea5e9"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            />
          )}

          {/* Fill area */}
          {areaPath && (
            <path d={areaPath} fill="url(#latencyGlow)" />
          )}

          {/* Wave line */}
          {pointsPath && (
            <path
              d={pointsPath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Live pulsing head point */}
          {activePoint && (
            <g>
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                className="fill-cyan-400 animate-ping opacity-75"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                className="fill-cyan-300 stroke-2 stroke-slate-950 shadow-lg"
              />
            </g>
          )}
        </svg>

        {/* Axis labels */}
        <div className="absolute left-2 top-2 font-mono text-[10px] text-slate-500 tabular-nums">
          {Math.round(maxVal)}ms
        </div>
        <div className="absolute left-2 bottom-6 font-mono text-[10px] text-slate-500 tabular-nums">
          {Math.round(minVal)}ms
        </div>
      </div>
    </div>
  );
};
