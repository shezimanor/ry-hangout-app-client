<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

import useGlobalStore from '@/stores/globalStore';
import useSocketStore from '@/stores/socketStore';
import useToastStore from '@/stores/toastStore';

// Route
const route = useRoute();

// Stores
const globalStore = useGlobalStore();
const socketStore = useSocketStore();
const { userName, userId } = storeToRefs(globalStore);
const { updateUserId } = globalStore;
const {
  socket,
  socketConnect,
  socketDisConnect,
  socketEmitEvent,
  socketOnEvent,
  socketOffEvent,
  socketOffAllEvent
} = socketStore;

const toastStore = useToastStore();
const { addToast } = toastStore;

// SocketIO 連線
socketOnEvent('connect', () => {
  console.log(`Connected to SocketIO Server`);
  // 連線確認
  socketConnect();
  // 新增 id
  if (socket.id) updateUserId(socket.id);
  // 發送事件：使用者名稱進入 -> page
  socketEmitEvent('user-in', userName.value);
  // 註冊事件：使用者進入群組 -> list
  socketOnEvent('user-in', handleUserJoin);
  // 註冊事件：使用者離開群組 -> list
  socketOnEvent('user-out', handleUserLeave);
});

// SocketIO 斷線
socketOnEvent('disconnect', () => {
  console.log('Disconnected from server');
  // 斷線確認
  socketDisConnect();
  socketOffAllEvent();
});

// Methods
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

// Hooks
onBeforeUnmount(() => {
  // 註銷所有事件
  socketOffEvent('user-in', handleUserJoin);
  socketOffEvent('user-out', handleUserLeave);
});
</script>

<template>
  <div class="view-container">
    <!-- 主欄 -->
    <RouterView />
    <!-- 右側欄 -->
    <div class="right-bar">
      <div class="flex flex-col">
        <span>Name: {{ userName }}</span>
        <span>ID: {{ userId }}</span>
      </div>
      <AppOnlineList />
    </div>
  </div>
</template>
