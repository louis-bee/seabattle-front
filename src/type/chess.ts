export interface BoardData {
  board: Board
  aliveNum: AliveNum
}

export interface AliveNum {
  total: number
  four: number
  three: number
  two: number
  one: number
}
export type Board = BoardRow[]

export type BoardRow = CellData[]

export interface CellData {
  address: Address
  status: 'unshoot' | 'miss' | 'goal' | 'down'
  hasBoat: 0 | 1 | 2 | 3 | 4
}

export interface Address {
  x: number
  y: number
}
