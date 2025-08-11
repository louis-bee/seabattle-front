<script setup lang="ts">
import ChessBoard from './components/chessBoard.vue'
import EndDialog from './components/endDialog.vue'

import { useBattleHook } from '@/logic/battle'

const {
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
} = useBattleHook()

</script>

<template>
  <div class="flex items-center justify-around h-100vh overflow-auto">
    <div
      class="flex"
    >
      <ChessBoard
        v-if="myBoardData"
        :data="myBoardData"
        :address="myAddress"
        :user-name="userName.myName"
        :is-my-board="true"
        :is-waiting="battleStatus==='fired'"
      />
      <div class="w-150px flex flex-col items-center justify-center">
        <button
          class="w-70px h-40px"
          :disabled="fireDisabled"
          @click="handlefire"
        >
          开炮
        </button>
        <span
          class="mt-10px"
          :class="{'opacity-0': battleStatus!=='fired'}"
        >等待对方开炮 . . .</span>
      </div>
      <ChessBoard
        v-if="enemyBoardData"
        :data="enemyBoardData"
        :address="chosenAddress"
        :user-name="userName.enemyName"
        :is-waiting="battleStatus==='fired'"
      />
    </div>
  </div>
  <EndDialog
    v-if="showEndDialog"
    :data="endGameData!"
  />
</template>

<style scoped>
</style>
