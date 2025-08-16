import { SIZE } from './config'
import { ref, computed, onMounted, watch } from 'vue'
import type { AliveNum, PlaceCell, HasBoat, PlaceBoard } from '@/type/chess'
import { wordToNumber, numberToWord } from '@/utils/tools'
import type { LengthNum, LengthWord } from '@/utils/tools'
import _ from 'lodash'
import useWebSocket from '@/api/websocket'
import type { ReceiveMessage } from '@/type/message'
import { useRouter } from 'vue-router'

interface BoatHTMLElement extends HTMLElement {
  z: boolean
}

type PlaceStatus = 'placed' | 'placing'

export default function usePlaceHook() {
  const board = ref<PlaceBoard>(Array.from({ length: SIZE }, (v1, row) =>
    Array.from({ length: SIZE }, (v2, col) => ({ status: 'empty', address: { x: col, y: row }, hasBoat: 0 })),
  ))
  const boatNum = ref<AliveNum>({ total: 10, four: 1, three: 2, two: 3, one: 4 })
  const placeStatus = ref<PlaceStatus>('placing')
  onMounted(() => {
    init()
  })
  function init() {
    const initDataStr = sessionStorage.getItem('placeBoardData')
    if (initDataStr) {
      const initData = JSON.parse(initDataStr)
      board.value = initData.board
      boatNum.value = initData.boatNum
      placeStatus.value = 'placed'
    }
    sessionStorage.removeItem('placeBoardData')
  }

  const boardListData = computed(() => {
    return board.value.flat() || []
  })

  let boardTemp: PlaceBoard // 用于离开格子时恢复棋盘
  let isIntersect = false
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

  let touchStartPageX: number
  let touchStartPageY: number

  onMounted(() => {
    const rect = document.getElementById('board')!.getBoundingClientRect()
    boardX = rect.left
    boardY = rect.top
  })
  let boardX: number
  let boardY: number
  function handleTouchStart(event: TouchEvent) {
    touchStartPageX = event.targetTouches[0].pageX
    touchStartPageY = event.targetTouches[0].pageY
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()
    const scrollTop = window.pageYOffset
    const scrollLeft = window.pageXOffset
    handleStartMove(event, touchStartPageY - rect.top - scrollTop, touchStartPageX - rect.left - scrollLeft)
  }

  const touchAddress = ref({ x: -1, y: -1 })
  watch(
    () => touchAddress.value,
    (newVal) => {
      isBoatDraging = true
      handleNewStatus(newVal.y, newVal.x)
    },
    { deep: true })
  function handleTouchMove(event: TouchEvent) {
    const pageX = event.targetTouches[0].pageX
    const pageY = event.targetTouches[0].pageY
    const offsetLeft = pageX - touchStartPageX
    const offsetTop = pageY - touchStartPageY
    const target = event.target! as HTMLElement
    target.style.transform = `translate(${offsetLeft}px,${offsetTop}px)`
    touchAddress.value.x = Math.floor((pageX - boardX) / 50)
    touchAddress.value.y = Math.floor((pageY - boardY) / 50)
  }
  function handleTouchEnd(event: TouchEvent) {
    if (!isBoatDraging) return
    const target = event.target! as HTMLElement
    target.style.transform = ''
    handlePlace(touchAddress.value.y, touchAddress.value.x)
    isBoatDraging = false
  }

  function dragStart(event: DragEvent) {
    isBoatDraging = true
    handleStartMove(event, event.offsetY, event.offsetX)
  }
  function dragging() { }
  function dragEnd() {
    isBoatDraging = false
  }

  function handleDragEnter(cell: PlaceCell) {
    if (!isBoatDraging) return
    setTimeout(() => {
      handleNewStatus(cell.address.y, cell.address.x)
    }, 0)
  }

  function handleDragLeave() {
    if (!isBoatDraging) return
    board.value = boardTemp
  }
  function handleDrop(cell: PlaceCell) {
    if (!isBoatDraging) return
    handlePlace(cell.address.y, cell.address.x)
  }

  function handleStartMove(event: Event, offsetY: number, offsetX: number) {
    boardTemp = _.cloneDeep(board.value)
    const target = event.target as BoatHTMLElement
    z = target.z || false
    length = wordToNumber(target.id as LengthWord)
    const offset = z ? offsetY : offsetX
    position = Math.floor(offset / 50)
  }
  function handleNewStatus(y: number, x: number) {
    const newBoard = _.cloneDeep(boardTemp)
    const res = updateBoardStatus(newBoard, z, y, x, length, position)
    board.value = res.newBoard

    isIntersect = res.isIntersect
  }
  function handlePlace(y: number, x: number) {
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
    board.value = place(boardTemp, z, y, x, length as HasBoat, position)
    boatNum.value[numberToWord(length)] -= 1
    boatNum.value.total -= 1
    if (boatNum.value.total === 0) {
      console.log('摆放完成')
    }
  }

  const $router = useRouter()

  function randomPlace() {
    useWebSocket().sendMessage({ type: 'place:random' })
  }

  function submit() {
    useWebSocket().sendMessage({
      type: 'place:finish', data: {
        board: board.value,
      },
    })
    placeStatus.value = 'placed'
  }

  window.addEventListener('place', ((e: CustomEvent<ReceiveMessage>) => {
    handleMessage(e.detail)
  }) as EventListener)

  function handleMessage(message: ReceiveMessage) {
    const type = message.type
    switch (type) {
      case 'place:random': {
        board.value = message.data.boardData.board
        boatNum.value = message.data.boardData.boatNum
        break
      }
      case 'place:finish': {
        sessionStorage.setItem('battleData', JSON.stringify(message.data.battleData))
        $router.replace({ name: 'fightPage' })
        break
      }
      case 'place:wait': {
        console.log('等待对方摆放')
        break
      }
    }
  }

  return {
    boatNum,
    boardListData,
    dragStart,
    dragEnd,
    dragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleClick,
    randomPlace,
    submit,
    placeStatus,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}

function isOutOfArea(z: boolean, y: number, x: number, length: number, position: number) {
  if ((z === false && (x + length - position > SIZE || x - position < 0 || y < 0 || y >= SIZE)) || (z === true && (y + length - position > SIZE || y - position < 0 || x < 0 || x >= SIZE))) {
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
    const currX = z ? x : x - position + i
    const currY = z ? y - position + i : y
    placeCell(currY, currX)
  }
  return board

  function placeCell(y: number, x: number) {
    board[y][x].status = 'occupy'
    board[y][x].hasBoat = length
  }
}
