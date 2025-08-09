export const wordToNumberMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
}

export const numberToWordMap = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
}

export function wordToNumber(word: LengthWord): LengthNum {
  return wordToNumberMap[word] as LengthNum
}

export function numberToWord(length: LengthNum): LengthWord {
  return numberToWordMap[length] as LengthWord
}

// 类型
export type LengthWord = keyof typeof wordToNumberMap
export type LengthNum = keyof typeof numberToWordMap
