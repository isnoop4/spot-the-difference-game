// Twin Lanterns — synthesized sounds. No audio files: every sound is an
// oscillator through WebAudio, so the game makes no network request.

let audioCtx = null;
let muted = false;

function ctx() {
  if (audioCtx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const ac = ctx();
  if (ac === null || muted) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(gain, ac.currentTime + at);
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.02);
}

export const sfx = {
  setMuted(m) {
    muted = m;
  },
  isMuted() {
    return muted;
  },
  click() {
    tone(660, 0, 0.06, 'sine', 0.05);
  },
  find() {
    tone(523.25, 0, 0.12);
    tone(783.99, 0.09, 0.18);
  },
  wrong() {
    tone(160, 0, 0.22, 'sawtooth', 0.07);
  },
  hint() {
    tone(880, 0, 0.1, 'sine', 0.06);
    tone(1174.66, 0.08, 0.14, 'sine', 0.06);
  },
  win() {
    tone(523.25, 0, 0.14);
    tone(659.25, 0.12, 0.14);
    tone(783.99, 0.24, 0.14);
    tone(1046.5, 0.36, 0.3);
  },
};
