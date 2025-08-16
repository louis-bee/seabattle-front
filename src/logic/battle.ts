import useWebSocket, { type EndGameData } from '@/api/websocket'
import { ref, computed, onMounted } from 'vue'
import type { Address, BoardData } from '@/type/chess'
import { useRouter } from 'vue-router'
import type { ReceiveMessage, EventListener, FireResultData, BattleStatus, BattleData } from '@/type/message'
import { getEnemyInfo, getUserName } from '@/utils/userInfo'

export function useBattleHook() {
  const {
    sendMessage,
  } = useWebSocket()

  const $router = useRouter()
  onMounted(() => {
    init()
  })
  function init() {
    userName.value.enemyName = getEnemyInfo()!.userName
    userName.value.myName = getUserName()
    const initBattleStr = sessionStorage.getItem('battleData')
    console.log(initBattleStr)

    if (!initBattleStr) return $router.replace({ name: 'Home' })
    const { status, myBoard, enemyBoard } = JSON.parse(initBattleStr) as BattleData
    battleStatus.value = status
    myBoardData.value = myBoard
    enemyBoardData.value = enemyBoard
    sessionStorage.removeItem('battleData')
  }

  const userName = ref({
    myName: '',
    enemyName: '',
  })

  const battleStatus = ref<BattleStatus>()
  const myBoardData = ref<BoardData>()
  const enemyBoardData = ref<BoardData>()

  function handlefire() {
    if (chosenAddress.value.x < 0 || chosenAddress.value.y < 0 || chosenAddress.value.x >= 10 || chosenAddress.value.y >= 10) return
    sendMessage({ type: 'battle:fire', data: { address: chosenAddress.value } })
    battleStatus.value = 'fired'
  }

  window.addEventListener('battle', ((e: CustomEvent<ReceiveMessage>) => {
    handleMessage(e.detail)
  }) as EventListener)

  function handleMessage(message: ReceiveMessage) {
    const type = message.type
    switch (type) {
      case 'battle:fire-result': {
        handleFireResult(message.data)
        break
      }
      case 'battle:endGame': {
        handleEndGame(message.data)
      }
    }
  }

  function handleFireResult(data: FireResultData) {
    const { myBoardResult, enemyBoardResult } = data
    console.log('对方的炮击结果：', myBoardResult.message)
    console.log('我方的炮击结果：', enemyBoardResult.message)
    myBoardData.value = myBoardResult.boardData
    enemyBoardData.value = enemyBoardResult.boardData
    battleStatus.value = 'firing'
    chosenAddress.value = { x: -1, y: -1 }
  }

  const fireDisabled = computed(() => {
    return battleStatus.value === 'fired' || repeatAddress.value
  })

  const repeatAddress = computed(() => {
    const { x, y } = chosenAddress.value
    if (x < 0 || x >= 10 || y < 0 || y >= 10) return false
    return enemyBoardData.value?.board[y][x].status !== 'unshoot'
  })

  const myAddress = ref<Address>({ x: -1, y: -1 })
  const chosenAddress = ref<Address>({ x: -1, y: -1 })

  const showEndDialog = ref(false)
  const endGameData = ref<EndGameData>()

  function handleEndGame(data: EndGameData) {
    endGameData.value = data
    showEndDialog.value = true
  }

  return {
    userName,
    battleStatus,
    myBoardData,
    enemyBoardData,
    fireDisabled,
    handlefire,
    myAddress,
    chosenAddress,
    showEndDialog,
    endGameData,
  }
}
