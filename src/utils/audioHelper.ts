let audioCtx: AudioContext | null = null;
let musicInterval: any = null;
let musicGain: GainNode | null = null;
let isMusicPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function isMuted(): boolean {
  return localStorage.getItem('muted') === 'true';
}

// ===============================================
// Motor de Música de Fondo Ambiental (Lofi Synth)
// ===============================================
const CHORDS = [
  [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
  [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
  [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
  [196.00, 246.94, 293.66, 392.00]  // G6 (G3, B3, D4, G4)
];

let chordIndex = 0;

export function startBackgroundMusic() {
  if (isMuted() || isMusicPlaying) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    isMusicPlaying = true;
    musicGain = ctx.createGain();
    
    // Filtro pasa-bajos suave para tono ambiente cálido
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);

    musicGain.gain.setValueAtTime(0.08, ctx.currentTime); // Volumen confortable
    musicGain.connect(filter);
    filter.connect(ctx.destination);

    function playNextChord() {
      if (!isMusicPlaying || isMuted()) return;
      const now = ctx.currentTime;
      const currentNotes = CHORDS[chordIndex % CHORDS.length];

      currentNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Suave ataque y caída para sonido pad ambiente
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.035, now + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(noteGain);
        if (musicGain) noteGain.connect(musicGain);

        osc.start(now);
        osc.stop(now + 4.0);
      });

      chordIndex++;
    }

    playNextChord();
    musicInterval = setInterval(playNextChord, 4000);
  } catch (e) {
    console.warn("Autoplay ambient music blocked by browser policy:", e);
  }
}

export function stopBackgroundMusic() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  if (musicGain && audioCtx) {
    try {
      musicGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
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

