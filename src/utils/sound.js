let audioCtx = null
let customAudio = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playGeneratedError() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.12)
  } catch {
    // audio blocked or unsupported
  }
}

// Call this once at app start to use a custom sound file instead of the generated tone.
// Place your file in the public folder, e.g. public/sounds/error.mp3
// Then call: initCustomErrorSound('/sounds/error.mp3')
export function initCustomErrorSound(src) {
  customAudio = new Audio(src)
  customAudio.volume = 0.4
}

export function playErrorSound() {
  if (customAudio) {
    try {
      customAudio.currentTime = 0
      customAudio.play()
    } catch {
      // ignore
    }
    return
  }
  playGeneratedError()
}
