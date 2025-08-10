export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomNumber(length: number = 8): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('length must be a positive integer')
  }
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function randomUserId() {
  return randomNumber(10)
}
