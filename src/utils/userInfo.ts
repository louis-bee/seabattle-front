import { randomUserId } from './generator'

export function getUserId() {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = randomUserId()
    localStorage.setItem('userId', userId)
  }
  return userId
}

export function getUserName() {
  let userName = localStorage.getItem('userName')
  if (!userName) {
    userName = ''
    localStorage.setItem('userName', userName)
  }
  return userName
}
