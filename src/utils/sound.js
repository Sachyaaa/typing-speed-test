let audioCtx = null
let customErrorAudio = null

let errorMuted = typeof window !== 'undefined' && window.localStorage.getItem('mute-error') === 'true'
let successMuted = typeof window !== 'undefined' && window.localStorage.getItem('mute-success') === 'true'

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function isErrorMuted() { return errorMuted }
export function isSuccessMuted() { return successMuted }

export function toggleErrorMute() {
  errorMuted = !errorMuted
  window.localStorage.setItem('mute-error', errorMuted)
  return errorMuted
}

export function toggleSuccessMute() {
  successMuted = !successMuted
  window.localStorage.setItem('mute-success', successMuted)
  return successMuted
}

// Call once at app start to swap in a custom error sound file
// e.g. initCustomErrorSound('/sounds/error.mp3')
export function initCustomErrorSound(src) {
  customErrorAudio = new Audio(src)
  customErrorAudio.volume = 0.4
}

export function playErrorSound() {
  if (errorMuted) return
  if (customErrorAudio) {
    try { customErrorAudio.currentTime = 0; customErrorAudio.play() } catch { }
    return
  }
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12)
  } catch { }
}

export function playSuccessSound() {
  if (successMuted) return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.07)
  } catch { }
}
