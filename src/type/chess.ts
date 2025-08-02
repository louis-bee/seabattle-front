export type BoardData = BoardRow[]

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
