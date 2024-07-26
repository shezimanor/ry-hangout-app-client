<script setup lang="ts">
import { debounce } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { io } from 'socket.io-client';
import { computed, ref } from 'vue';

import type { Message, Users } from '@/types';

import useGlobalStore from '@/stores/globalStore';
import useToastStore from '@/stores/toastStore';

// store(globalStore)
const globalStore = useGlobalStore();
const { userName, userId, user } = storeToRefs(globalStore);
const { updateUserId } = globalStore;
// store(toastStore)
const toastStore = useToastStore();
const { addToast } = toastStore;

const socket = io('http://localhost:3000');

const ioIsConnected = ref(false);
const messageContainer = ref(null);
const message = ref('');
const typingStatus = ref('');
const userList = ref<Users>({});
const messageList = ref<Message[]>([]);

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
  // 註冊事件：使用者進入群組
  socket.on('user-in', handleUserJoin);
  // 註冊事件：使用者離開群組
  socket.on('user-out', handleUserLeave);
  // 註冊事件：群組使用者清單更新
  socket.on('user-list', handleUserList);
  // 註冊事件：更新使用者打字狀態
  socket.on('user-typing-status', handleUserTyping);
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
const onTyping = debounce(
  () => {
    console.log('onTyping');
    // 發送事件：使用者輸入訊息中
    socket.emit('user-typing');
  },
  1000,
  { leading: true }
);
function onSubmit(evt: Event) {
  evt.preventDefault();
}
function onBlur(event: FocusEvent) {
  console.log('Blur event:', event);
  // 發送事件：使用者取消輸入訊息
  socket.emit('user-not-typing');
}
function onSendMessage() {
  if (!isSendable.value) return;
  console.log('onSendMessage');
  const currentMsg: Message = {
    userId: userId.value,
    userName: userName.value,
    content: message.value
  };
  // 自行將訊息傳入 messageList（因為該事件發送後不會回傳給自己，所以要自己把訊息渲染出來）
  handleGroupMessage(currentMsg);
  // 發送事件：群組訊息
  socket.emit('group-message', currentMsg);
  // 清空訊息
  message.value = '';
  // 發送事件：使用者取消輸入訊息
  socket.emit('user-not-typing');
}
function handleGroupMessage(msg: Message) {
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
function handleUserTyping(users: Users) {
  const typingUsers = Object.values(users);
  switch (typingUsers.length) {
    case 0:
      typingStatus.value = '';
      break;
    case 1:
      typingStatus.value = `${typingUsers[0]} 正在打字`;
      break;
    case 2:
      typingStatus.value = `${typingUsers[0]}和${typingUsers[1]} 正在打字`;
      break;
    default:
      typingStatus.value = `多位使用者 正在打字`;
      break;
  }
}
function handleUserList(users: Users) {
  userList.value = users;
}
</script>

<template>
  <div class="view-container">
    <!-- 主欄 -->
    <div class="chat-container">
      <div ref="messageContainer" class="message-container">
        <ul class="message-container__list">
          <li
            v-for="(message, index) in messageList"
            :key="index"
            class="message-container__item"
            :class="[message.userId === userId ? 'item--end' : 'item--start']"
          >
            <!-- 其他人的訊息 -->
            <template v-if="message.userId !== userId">
              <span class="message-cotainer__avatar">
                {{ message.userName.substring(0, 1) }}
              </span>
              <div class="message-cotainer__dialog">
                <span class="message-cotainer__name">{{ message.userName }}</span>
                <span class="message-cotainer__content">{{ message.content }}</span>
              </div>
            </template>
            <!-- 本人的訊息 -->
            <template v-else>
              <div class="message-cotainer__dialog">
                <span class="message-cotainer__content">{{ message.content }}</span>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <form class="input-container" action="" @submit="onSubmit">
        <AppInput
          type="text"
          v-model="message"
          @input="onTyping"
          @blur="onBlur"
          @enter-up="onSendMessage"
        />
        <button
          class="button button--primary"
          type="button"
          :disabled="message === ''"
          @click="onSendMessage"
        >
          <span class="icon-[material-symbols--send-rounded] h-6 w-6"></span>
        </button>
        <!-- 打字狀態列 -->
        <span class="input-container__status">{{ typingStatus }}</span>
      </form>
    </div>
    <!-- 右側欄 -->
    <div class="right-bar flex w-64 flex-none flex-col bg-red-100">
      <span>Name: {{ userName }}</span>
      <span>ID: {{ userId }}</span>
      <ul>
        <li v-for="(userName, key) in userList" :key="key">
          {{ userName }}
        </li>
      </ul>
    </div>
  </div>
</template>
