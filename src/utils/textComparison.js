import { calculateAccuracy, calculateWpm } from './metrics'

export function compareText(sourceText, typedText, elapsedSeconds) {
  const sourceCharacters = Array.from(sourceText)
  const typedCharacters = Array.from(typedText)
  const highlightedCharacters = []

  let correctCharacters = 0
  let incorrectCharacters = 0

  for (let index = 0; index < sourceCharacters.length; index += 1) {
    const sourceCharacter = sourceCharacters[index]
    const typedCharacter = typedCharacters[index]

    let status = 'pending'

    if (index < typedCharacters.length) {
      status = typedCharacter === sourceCharacter ? 'correct' : 'incorrect'
    } else if (index === typedCharacters.length) {
      status = 'current'
    }

    if (status === 'correct') {
      correctCharacters += 1
    }

    if (status === 'incorrect') {
      incorrectCharacters += 1
    }

    highlightedCharacters.push({
      id: `${index}-${sourceCharacter}`,
      value: sourceCharacter,
      status,
    })
  }

  const extraCharacters = typedCharacters.slice(sourceCharacters.length)
  incorrectCharacters += extraCharacters.length

  const totalTypedCharacters = typedCharacters.length
  const completionPercentage =
    sourceCharacters.length > 0
      ? Math.min((totalTypedCharacters / sourceCharacters.length) * 100, 100)
      : 0

  return {
    highlightedCharacters,
    extraCharacters,
    totalTypedCharacters,
    correctCharacters,
    incorrectCharacters,
    errorsCount: incorrectCharacters,
    completionPercentage: Number(completionPercentage.toFixed(1)),
    wpm: calculateWpm(totalTypedCharacters, elapsedSeconds),
    accuracy: calculateAccuracy(correctCharacters, totalTypedCharacters),
  }
}
