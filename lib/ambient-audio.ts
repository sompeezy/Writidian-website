"use client";

/** Shared Web Audio ambiences for sanctuary + soundscapes. */

export type AmbientHandle = {
  setTargetVolume: (level: number, ramp?: number) => void;
  resume: () => Promise<void>;
  stop: () => void;
};

/** Clean MP3 beds in /public/audio — matched to SOUNDSCAPE_SCENES titles. */
export const SOUNDSCAPE_AUDIO_URLS = {
  journaling: "/audio/bubbly-reflection.mp3",
  "literary-fiction": "/audio/dusty-photo-frame.mp3",
  romance: "/audio/amber-drift.mp3",
  horror: "/audio/basement-door-ajar.mp3",
  "non-binaural": "/audio/light-rain-birdsong.mp3",
} as const;

export type SoundscapeSceneId = keyof typeof SOUNDSCAPE_AUDIO_URLS;

/** Loop a decoded audio file with the same gain API as synth beds. */
export async function createSampleAmbience(
  ctx: AudioContext,
  url: string,
  maxGain = 0.75,
): Promise<AmbientHandle> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ambience: ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength < 64) {
    throw new Error(`Ambience file too small: ${url}`);
  }
  // Copy before decode — some browsers detach the original ArrayBuffer.
  const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(master);
  source.start();

  return {
    setTargetVolume(level: number, ramp = 0.45) {
      const now = ctx.currentTime;
      const clamped = Math.max(0, Math.min(1, level)) * maxGain;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(clamped, now, ramp);
    },
    async resume() {
      if (ctx.state === "suspended") await ctx.resume();
    },
    stop() {
      try {
        source.stop();
      } catch {
        /* ignore */
      }
      master.gain.value = 0;
      try {
        master.disconnect();
      } catch {
        /* ignore */
      }
    },
  };
}

function createMaster(ctx: AudioContext, maxGain: number) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const nodes: AudioNode[] = [];
  const stopFns: Array<() => void> = [];

  return {
    ctx,
    master,
    maxGain,
    track(node: AudioNode) {
      nodes.push(node);
      return node;
    },
    onStop(fn: () => void) {
      stopFns.push(fn);
    },
    setTargetVolume(level: number, ramp = 0.45) {
      const now = ctx.currentTime;
      const clamped = Math.max(0, Math.min(1, level)) * maxGain;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(clamped, now, ramp);
    },
    async resume() {
      if (ctx.state === "suspended") await ctx.resume();
    },
    stop() {
      stopFns.forEach((fn) => {
        try {
          fn();
        } catch {
          /* ignore */
        }
      });
      master.gain.value = 0;
      try {
        master.disconnect();
      } catch {
        /* ignore */
      }
    },
  };
}

type Bus = ReturnType<typeof createMaster>;

function createLoopingNoise(
  ctx: AudioContext,
  bus: Bus,
  type: BiquadFilterType,
  frequency: number,
  q: number,
  level: number,
) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.value = level;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(bus.master);
  source.start();
  bus.onStop(() => source.stop());
  return { filter, gain };
}

/** Bubbly Reflection: warm pad with small glassy bubbles. */
export function createBubblyReflectionAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.2);
  const pad = ctx.createBiquadFilter();
  pad.type = "lowpass";
  pad.frequency.value = 520;
  pad.connect(bus.master);
  [196, 246.94, 293.66].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.16 : 0.055;
    osc.connect(gain);
    gain.connect(pad);
    osc.start();
    bus.onStop(() => osc.stop());
  });
  let timer: number | null = null;
  const bubble = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(420 + Math.random() * 260, now);
    osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 300, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(gain);
    gain.connect(bus.master);
    osc.start(now);
    osc.stop(now + 0.24);
    timer = window.setTimeout(bubble, 750 + Math.random() * 1200);
  };
  timer = window.setTimeout(bubble, 500);
  bus.onStop(() => {
    if (timer) window.clearTimeout(timer);
  });
  return bus;
}

/** Dusty Photo Frame: muted room tone with soft, worn harmonic movement. */
export function createDustyPhotoFrameAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.18);
  createLoopingNoise(ctx, bus, "lowpass", 360, 0.35, 0.045);
  [146.83, 220, 293.66].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.value = 0.045 - index * 0.01;
    osc.connect(gain);
    gain.connect(bus.master);
    osc.start();
    bus.onStop(() => osc.stop());
  });
  return bus;
}

/** Amber Drift: slow, warm sustained tones with a soft tide-like motion. */
export function createAmberDriftAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.2);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 430;
  filter.connect(bus.master);
  [110, 164.81, 220].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = 0.12 - index * 0.025;
    lfo.frequency.value = 0.055 + index * 0.012;
    lfoGain.gain.value = 4 + index;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    lfo.start();
    bus.onStop(() => {
      osc.stop();
      lfo.stop();
    });
  });
  createLoopingNoise(ctx, bus, "lowpass", 680, 0.25, 0.025);
  return bus;
}

/** Basement Door Ajar: low pressure, distant air, and rare creaking movement. */
export function createBasementDoorAjarAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.16);
  const low = ctx.createOscillator();
  const lowGain = ctx.createGain();
  low.type = "sine";
  low.frequency.value = 55;
  lowGain.gain.value = 0.18;
  low.connect(lowGain);
  lowGain.connect(bus.master);
  low.start();
  bus.onStop(() => low.stop());
  createLoopingNoise(ctx, bus, "bandpass", 150, 0.7, 0.045);
  let timer: number | null = null;
  const creak = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(72, now + 0.9);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    osc.connect(gain);
    gain.connect(bus.master);
    osc.start(now);
    osc.stop(now + 1.15);
    timer = window.setTimeout(creak, 4200 + Math.random() * 5200);
  };
  timer = window.setTimeout(creak, 1800);
  bus.onStop(() => {
    if (timer) window.clearTimeout(timer);
  });
  return bus;
}

/** Light rain + birdsong: a natural, explicitly non-binaural outdoor bed. */
export function createRainBirdsongAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.2);
  createLoopingNoise(ctx, bus, "bandpass", 820, 0.45, 0.09);
  let timer: number | null = null;
  const bird = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const start = 1500 + Math.random() * 500;
    osc.type = "sine";
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(start * 1.55, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(start * 1.1, now + 0.34);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    osc.connect(gain);
    gain.connect(bus.master);
    osc.start(now);
    osc.stop(now + 0.45);
    timer = window.setTimeout(bird, 2600 + Math.random() * 4200);
  };
  timer = window.setTimeout(bird, 1000);
  bus.onStop(() => {
    if (timer) window.clearTimeout(timer);
  });
  return bus;
}

const SOUNDSCAPE_SYNTH_FALLBACKS: Record<
  SoundscapeSceneId,
  (ctx: AudioContext) => AmbientHandle
> = {
  journaling: createBubblyReflectionAmbience,
  "literary-fiction": createDustyPhotoFrameAmbience,
  romance: createAmberDriftAmbience,
  horror: createBasementDoorAjarAmbience,
  "non-binaural": createRainBirdsongAmbience,
};

/** Prefer the recorded bed; fall back to the matching synth ambience. */
export async function createSoundscapeAmbience(
  ctx: AudioContext,
  scene: SoundscapeSceneId,
): Promise<AmbientHandle> {
  try {
    return await createSampleAmbience(ctx, SOUNDSCAPE_AUDIO_URLS[scene]);
  } catch (error) {
    console.warn(
      `[ambient-audio] Falling back to synth for "${scene}"`,
      error,
    );
    return SOUNDSCAPE_SYNTH_FALLBACKS[scene](ctx);
  }
}

/** Soft, very calm writing-studio bed: airy sine pad + gentle breath noise */
export function createCalmStudioAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.18);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 320;
  filter.Q.value = 0.4;
  filter.connect(bus.master);

  const freqs = [98, 146.83, 196, 293.66];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = i === 0 ? 0.28 : 0.07;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.015;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1.5 + i * 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    lfo.start();
    bus.onStop(() => {
      osc.stop();
      lfo.stop();
    });
  });

  // Soft air / breath
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 280;
  noiseFilter.Q.value = 0.5;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(bus.master);
  noise.start();
  bus.onStop(() => noise.stop());

  return bus;
}

/** Night forest: soft wind bed + cricket chirps */
export function createForestNightAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.26);

  const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const windData = windBuffer.getChannelData(0);
  for (let i = 0; i < windData.length; i++) windData[i] = Math.random() * 2 - 1;
  const wind = ctx.createBufferSource();
  wind.buffer = windBuffer;
  wind.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 420;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.12;
  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.07;
  const windLfoGain = ctx.createGain();
  windLfoGain.gain.value = 0.04;
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windGain.gain);
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(bus.master);
  wind.start();
  windLfo.start();
  bus.onStop(() => {
    wind.stop();
    windLfo.stop();
  });

  // Cricket loop via scheduled chirps
  let chirpTimer: number | null = null;
  const chirp = () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 4200 + Math.random() * 900;
    const g = ctx.createGain();
    g.gain.value = 0;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = osc.frequency.value;
    bp.Q.value = 8;
    osc.connect(bp);
    bp.connect(g);
    g.connect(bus.master);
    const bursts = 2 + Math.floor(Math.random() * 3);
    for (let b = 0; b < bursts; b++) {
      const t = now + b * 0.055;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.035 + Math.random() * 0.02, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    }
    osc.start(now);
    osc.stop(now + 0.3);
    chirpTimer = window.setTimeout(chirp, 700 + Math.random() * 1600);
  };
  chirpTimer = window.setTimeout(chirp, 400);
  bus.onStop(() => {
    if (chirpTimer) window.clearTimeout(chirpTimer);
  });

  return bus;
}

/** Coast: slow wave wash */
export function createCoastAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.24);
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 680;
  const gain = ctx.createGain();
  gain.gain.value = 0.1;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.11;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  const filterLfo = ctx.createOscillator();
  filterLfo.frequency.value = 0.09;
  const filterLfoGain = ctx.createGain();
  filterLfoGain.gain.value = 220;
  filterLfo.connect(filterLfoGain);
  filterLfoGain.connect(filter.frequency);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(bus.master);
  src.start();
  lfo.start();
  filterLfo.start();
  bus.onStop(() => {
    src.stop();
    lfo.stop();
    filterLfo.stop();
  });

  return bus;
}

/** Night desk: soft room tone + distant warmth */
export function createNightDeskAmbience(ctx: AudioContext): AmbientHandle {
  const bus = createMaster(ctx, 0.2);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 240;
  filter.connect(bus.master);

  [65.41, 98, 130.81].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = 0.12 - i * 0.03;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    bus.onStop(() => osc.stop());
  });

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const nf = ctx.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 180;
  const ng = ctx.createGain();
  ng.gain.value = 0.04;
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(bus.master);
  noise.start();
  bus.onStop(() => noise.stop());

  return bus;
}
