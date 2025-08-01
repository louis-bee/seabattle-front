export type BoardData = BoardRow[]

export type BoardRow = CellData[]

export interface CellData {
  address: Address
  status: 'unshoot' | 'miss' | 'goal' | 'down'
}

export interface Address {
  x: number
  y: number
}
