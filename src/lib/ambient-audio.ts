/**
 * Generative ambient soundscape: a slow, low drone chord, airy filtered noise and
 * soft bell tones, all synthesized with Web Audio (no downloads).
 */
export const AMBIENT_VOLUME = 0.07;
const FADE_S = 1.6;

export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bellTimer: number | null = null;

  get playing() {
    return !!this.ctx && this.ctx.state === "running" && this.master !== null;
  }

  async start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    await ctx.resume();
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(AMBIENT_VOLUME, ctx.currentTime + FADE_S);
    this.scheduleBells();
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const g = this.master.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    if (this.bellTimer) window.clearTimeout(this.bellTimer);
    this.bellTimer = null;
    window.setTimeout(() => { void ctx.suspend(); }, 900);
  }

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // Simple feedback-delay "room".
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.45;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    delay.connect(fb).connect(delay);
    delay.connect(wet).connect(master);
    this.bus = ctx.createGain();
    this.bus.connect(master);
    this.bus.connect(delay);

    // Drone chord (A1, E2, A2, C#3) through a slowly breathing low-pass filter.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 260;
    lfo.connect(lfoAmt).connect(filter.frequency);
    lfo.start();
    filter.connect(this.bus);
    [55, 82.41, 110, 138.59].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = 0.22 / (i + 1);
      o.connect(g).connect(filter);
      o.start();
    });

    // Air: looped noise through a band-pass.
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 700;
    bp.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.value = 0.18;
    noise.connect(bp).connect(ng).connect(this.bus);
    noise.start();
  }

  private bus: GainNode | null = null;

  private scheduleBells() {
    if (this.bellTimer) return;
    const notes = [440, 554.37, 659.25, 880, 739.99];
    const ring = () => {
      const ctx = this.ctx;
      if (!ctx || !this.bus) return;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)] ?? 440;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4);
      o.connect(g).connect(this.bus);
      o.start(t);
      o.stop(t + 4.2);
      this.bellTimer = window.setTimeout(ring, 4000 + Math.random() * 5000);
    };
    this.bellTimer = window.setTimeout(ring, 1500);
  }
}
