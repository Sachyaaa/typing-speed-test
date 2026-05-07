export function calculateWpm(totalTypedCharacters, elapsedSeconds) {
  const minutes = elapsedSeconds / 60

  if (minutes <= 0 || totalTypedCharacters <= 0) {
    return 0
  }

  return Math.round(totalTypedCharacters / 5 / minutes)
}

export function calculateAccuracy(correctCharacters, totalTypedCharacters) {
  if (totalTypedCharacters <= 0) {
    return 100
  }

  return Number(((correctCharacters / totalTypedCharacters) * 100).toFixed(1))
}
