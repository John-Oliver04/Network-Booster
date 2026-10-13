/**
 * Web Audio API based low-latency tactical sound synthesizer
 * Zero external audio file dependencies, instant response, zero network latency.
 */

class TacticalSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public playPingTick(latencyMs: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Lower latency = higher crisp frequency (700Hz to 280Hz)
      const baseFreq = Math.max(280, Math.min(850, 850 - latencyMs * 4));
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext safe catch
    }
  }

  public playBoostStep() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  public playBoostComplete() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // 3 ascending notes: E5 (659Hz), G#5 (830Hz), B5 (987Hz), E6 (1318Hz)
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + index * 0.065;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  public playAlertDrop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      
      const startTime = ctx.currentTime;
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(440, startTime);
      osc1.frequency.linearRampToValueAtTime(310, startTime + 0.14);

      gain1.gain.setValueAtTime(0.07, startTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + 0.18);

      // Secondary tone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const secondTime = startTime + 0.14;
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(392, secondTime);
      osc2.frequency.linearRampToValueAtTime(260, secondTime + 0.16);

      gain2.gain.setValueAtTime(0.07, secondTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, secondTime + 0.18);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(secondTime);
      osc2.stop(secondTime + 0.2);
    } catch {
      // Ignore
    }
  }

  public playTap() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {
      // Ignore
    }
  }
}

export const sound = new TacticalSoundEngine();
