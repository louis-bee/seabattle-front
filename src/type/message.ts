import type { BoardData } from './chess'

export interface ReceiveMessage {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface SendMessage {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export type EventListener = (event: Event) => void

export interface FireResultData {
  myBoardResult: {
    message: ShotRes
    boardData: BoardData
  }
  enemyBoardResult: {
    message: ShotRes
    boardData: BoardData
  }
}

export type ShotRes = 'miss' | 'repeat' | 'goal' | 'dead'

export interface BattleData {
  status: BattleStatus
  myBoard: BoardData
  enemyBoard: BoardData
}

export type BattleStatus = 'init' | 'firing' | 'fired'
