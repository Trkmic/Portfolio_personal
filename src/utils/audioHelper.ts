let audioCtx: AudioContext | null = null;
let bgAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function isMuted(): boolean {
  return localStorage.getItem('muted') === 'true';
}

function getBgAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!bgAudio) {
    bgAudio = new Audio('/lofi.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.25; // Volumen normal, ambiental y muy agradable
  }
  return bgAudio;
}

// ===============================================
// Motor de Música de Fondo MP3 Real (Lofi Beats)
// ===============================================
export function startBackgroundMusic() {
  if (isMuted()) return;
  try {
    const audio = getBgAudio();
    if (audio && audio.paused) {
      audio.play().catch((e) => console.warn("Autoplay blocked by browser policy:", e));
    }
  } catch (e) {}
}

export function stopBackgroundMusic() {
  if (bgAudio) {
    try {
      bgAudio.pause();
    } catch (e) {}
  }
}

export function toggleBackgroundMusic(enable: boolean) {
  if (enable && !isMuted()) {
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
}

// ===============================================
// Efectos de Sonido Interactivos (UI Feedback)
// ===============================================
export function playBeep() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

export function playKeypress() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random() * 60, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

export function playChirp() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

export function playBoot() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.10, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.3);
    });
  } catch (e) {}
}

