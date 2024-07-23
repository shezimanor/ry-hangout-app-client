<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { io } from 'socket.io-client';
import { computed, ref } from 'vue';

import useGlobalStore from '@/stores/globalStore';
import useToastStore from '@/stores/toastStore';

// store(globalStore)
const globalStore = useGlobalStore();
const { userName, userId } = storeToRefs(globalStore);
const { updateUserId } = globalStore;
// store(toastStore)
const toastStore = useToastStore();
const { addToast } = toastStore;

const socket = io('http://localhost:3000');

const ioIsConnected = ref(false);
const messageContainer = ref(null);
const message = ref('');
const messageList = ref<string[]>([]);

// SocketIO 連線
socket.on('connect', () => {
  console.log(`Connected to SocketIO Server`);
  // 連線確認
  ioIsConnected.value = true;
  // 新增 id
  if (socket.id) updateUserId(socket.id);
  // 發送事件：使用者名稱進入
  socket.emit('user-in', userName.value);
  // 註冊事件：伺服器送發的群組訊息
  socket.on('group-message', handleGroupMessage);
  // 註冊事件：伺服器送發的群組訊息
  socket.on('user-in', handleUserJoin);
  // 註冊事件：伺服器送發的群組訊息
  socket.on('user-out', handleUserLeave);
});

// SocketIO 斷線
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  // 斷線確認
  ioIsConnected.value = false;
});

// Computed
const isSendable = computed(() => ioIsConnected.value && message.value.length > 0);

// Methods
function onSubmit(evt: Event) {
  evt.preventDefault();
}
function onSendMessage() {
  if (!isSendable.value) return;
  console.log('onSendMessage');
  // 發送事件：群組訊息
  socket.emit('group-message', message.value);
  // 清空訊息
  message.value = '';
}
function handleGroupMessage(msg: string) {
  messageList.value.push(msg);
}
function handleUserJoin(userName: string) {
  addToast({
    content: `${userName} 進入群組`,
    type: 'primary',
    timeout: 3600
  });
}
function handleUserLeave(userName: string) {
  addToast({
    content: `${userName} 離開群組`,
    type: 'info',
    timeout: 3600
  });
}
</script>

<template>
  <div class="view-container">
    <!-- 主欄 -->
    <div class="main-room flex flex-auto flex-col">
      <div ref="messageContainer" class="message-container">
        <ul class="message-container__list">
          <li class="message-container__item" v-for="(item, index) in messageList" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
      <form class="flex h-8 flex-none items-stretch" action="" @submit="onSubmit">
        <AppInput type="text" v-model="message" @enter-up="onSendMessage" />
        <button
          class="button button--primary"
          type="button"
          :disabled="message === ''"
          @click="onSendMessage"
        >
          <span class="icon-[material-symbols--send-rounded] h-6 w-6"></span>
        </button>
      </form>
    </div>
    <!-- 右側欄 -->
    <div class="right-bar flex w-64 flex-none flex-col bg-red-100">
      <span>Name: {{ userName }}</span>
      <span>ID: {{ userId }}</span>
    </div>
  </div>
</template>
