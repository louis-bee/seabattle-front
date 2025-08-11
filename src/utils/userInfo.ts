import { randomUserId } from './generator'

export interface UserInfo {
  userName: string
  userId: string
}

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

export function setEnemyInfo(info: UserInfo) {
  sessionStorage.setItem('enemyInfo', JSON.stringify(info))
}

export function getEnemyInfo(): UserInfo | undefined {
  const str = sessionStorage.getItem('enemyInfo')
  if (str) return JSON.parse(str)
}
