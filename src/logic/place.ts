import { SIZE } from './config'
import { ref, computed } from 'vue'
import type { AliveNum, PlaceCell, HasBoat, PlaceBoard } from '@/type/chess'
import { wordToNumber, numberToWord } from '@/utils/tools'
import type { LengthNum, LengthWord } from '@/utils/tools'
import _ from 'lodash'

interface BoatHTMLElement extends HTMLElement {
  z: boolean
}

export function usePlaceHook() {
  const board = ref<PlaceBoard>(Array.from({ length: SIZE }, (v1, row) =>
    Array.from({ length: SIZE }, (v2, col) => ({ status: 'empty', address: { x: col, y: row }, hasBoat: 0 })),
  ))

  const boatNum = ref<AliveNum>({ total: 10, four: 1, three: 2, two: 3, one: 4 })

  const boardListData = computed(() => {
    return board.value.flat() || []
  })

  let isBoatDraging = false
  let position = 0
  let length: LengthNum = 1
  let z = false

  let clickCount = 0
  function handleClick(e: MouseEvent) {
    const timer = setTimeout(() => {
      clickCount = 0
      clearTimeout(timer)
    }, 500)
    clickCount++
    if (clickCount === 2) {
      const el = e.target as BoatHTMLElement
      el.className = el.className.replace(
        /\b(w|h)-([\d.]+(?:px|%|vh|vw|em|rem|fr|auto))\b/g,
        (_, dir, size) => (dir === 'w' ? `h-${size}` : `w-${size}`),
      )
      el.z = !el.z
      clickCount = 0
      clearTimeout(timer)
    }
  }

  function dragStart(event: DragEvent) {
    isBoatDraging = true
    const target = event.target as BoatHTMLElement
    z = target.z || false
    length = wordToNumber(target.id as LengthWord)
    const offset = z ? event.offsetY : event.offsetX
    position = Math.floor(offset / 50)
  }
  function dragging() { }
  function dragEnd() {
    isBoatDraging = false
  }

  let boardTemp: PlaceBoard // 用于离开格子时恢复棋盘
  let isIntersect = false
  function handleEnterCell(cell: PlaceCell) {
    if (!isBoatDraging) return
    setTimeout(() => {
      const { y, x } = cell.address
      boardTemp = _.cloneDeep(board.value)
      const newBoard = _.cloneDeep(boardTemp)
      const res = updateBoardStatus(newBoard, z, y, x, length, position)
      board.value = res.newBoard
      isIntersect = res.isIntersect
    }, 0)
  }

  function handleLeaveCell() {
    if (!isBoatDraging) return
    board.value = boardTemp
    isIntersect = false
  }
  function handlePlaceCell(cell: PlaceCell) {
    if (!isBoatDraging) return
    const { y, x } = cell.address

    if (isOutOfArea(z, y, x, length, position)) {
      board.value = boardTemp
      isIntersect = false
      console.log('出界')
      return
    }
    // 是否重合，用dragEnter时的渲染结果
    if (isIntersect) {
      board.value = boardTemp
      isIntersect = false
      console.log('重合')
      return
    }
    place(board.value, z, y, x, length as HasBoat, position)
    boatNum.value[numberToWord(length)] -= 1
    boatNum.value.total -= 1
    if (boatNum.value.total === 0) {
      console.log('摆放完成')
    }
  }

  return {
    boatNum,
    boardListData,
    dragStart,
    dragEnd,
    dragging,
    handleEnterCell,
    handleLeaveCell,
    handlePlaceCell,
    handleClick,
  }
}

function isOutOfArea(z: boolean, y: number, x: number, length: number, position: number) {
  if ((z === false && (x + length - position > SIZE || x - position < 0)) || (z === true && (y + length - position > SIZE || y - position < 0))) {
    return true // 超出范围
  } else {
    return false
  }
}

function updateBoardStatus(newBoard: PlaceBoard, z: boolean, y: number, x: number, length: LengthNum, position: number) {
  let isIntersect = false
  let isFirst = true

  for (let i = 0; i < length; i++) {
    updateCellArea(z, y, x)
    isFirst = false

    function updateCellArea(z: boolean, y: number, x: number) {
      const currY = z ? y - position + i : y
      const currX = z ? x : x - position + i
      // 自
      updateCell(currY, currX, true)
      // 上：如果是垂直摆放且不是第一次，可忽略
      if (!z || isFirst) updateCell(currY - 1, currX, false)
      // 右上
      updateCell(currY - 1, currX + 1, false)
      // 右
      updateCell(currY, currX + 1, false)
      // 右下
      updateCell(currY + 1, currX + 1, false)
      // 下
      updateCell(currY + 1, currX, false)
      // 左下
      updateCell(currY + 1, currX - 1, false)
      // 左：如果是水平摆放且不是第一次，可忽略
      if (z || isFirst) updateCell(currY, currX - 1, false)
      // 左上
      updateCell(currY - 1, currX - 1, false)

      function updateCell(y: number, x: number, isSelf: boolean) {
        if (y < 0 || y >= SIZE || x < 0 || x >= SIZE) return
        if (newBoard[y][x].status === 'occupy' || newBoard[y][x].status === 'hoverintersect') {
          newBoard[y][x].status = 'hoverintersect'
          isIntersect = true
        } else {
          newBoard[y][x].status = isSelf ? 'hover' : 'hovernear'
        }
      }
    }
  }
  return {
    isIntersect,
    newBoard,
  }
}

function place(board: PlaceBoard, z: boolean, y: number, x: number, length: HasBoat, position: number) {
  for (let i = 0; i < length; i++) {
    if (z) {
      board[y - position + i][x].status = 'occupy'
      board[y - position + 1][x].hasBoat = length
    } else {
      board[y][x - position + i].status = 'occupy'
      board[y][x - position + i].hasBoat = length
    }
  }
}
