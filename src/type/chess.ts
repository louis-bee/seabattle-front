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
  status: CellStatus
  hasBoat: HasBoat
}

export type CellStatus = 'unshoot' | 'miss' | 'goal' | 'down'

export type HasBoat = 0 | 1 | 2 | 3 | 4

export interface Address {
  x: number
  y: number
}

export type PlaceBoard = PlaceCell[][]

export type PlaceCellStatus = 'empty' | 'near' | 'occupy' | 'hover' | 'hovernear' | 'hoverintersect'

export interface PlaceCell {
  address: Address
  status: PlaceCellStatus
  hasBoat: HasBoat
}
