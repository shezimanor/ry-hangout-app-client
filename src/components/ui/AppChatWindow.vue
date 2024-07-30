<script lang="ts" setup>
import { useStorage } from '@vueuse/core';
import { debounce } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRefs } from 'vue';

import type { Message, Users } from '@/types';

import useGlobalStore from '@/stores/globalStore';
import useSocketStore from '@/stores/socketStore';

// Props
const props = defineProps<{
  mode: 'private' | 'group';
  id?: string;
}>();

const { mode, id: receiverId } = toRefs(props);

// Stores
const globalStore = useGlobalStore();
const socketStore = useSocketStore();
const { userName, userId } = storeToRefs(globalStore);
const { socketIsConnected } = storeToRefs(socketStore);
const { socketEmitEvent, socketOnEvent, socketOffEvent } = socketStore;

const messageContainer = ref<HTMLElement | null>(null);
const message = ref('');
const typingStatus = ref('');
// const messageList = ref<Message[]>([]);

// Computed
const isSendable = computed(() => socketIsConnected.value && message.value.length > 0);
const messageEventName = computed(() => `${mode.value}-message`);
const storageKey = computed(() =>
  mode.value === 'group' ? 'group' : [userId.value, receiverId.value].sort().join('_')
);

const messageList = useStorage<Message[]>(storageKey.value, [], sessionStorage);

// Methods
const onTyping = debounce(
  () => {
    console.log('onTyping');
    // 發送事件：使用者輸入訊息中
    socketEmitEvent('user-typing');
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
  socketEmitEvent('user-not-typing');
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
  handleMessage(currentMsg);
  // 發送事件：群組訊息
  if (mode.value === 'group') {
    socketEmitEvent(messageEventName.value, { msg: currentMsg });
  }
  // 發送事件：私人訊息
  else {
    socketEmitEvent(messageEventName.value, { receiverId: receiverId.value, msg: currentMsg });
  }
  // 清空訊息
  message.value = '';
  // 取消延遲中的 typing 事件
  onTyping.cancel();
  // 發送事件：使用者取消輸入訊息
  socketEmitEvent('user-not-typing');
}
function handleMessage(msg: Message) {
  // 加入新的訊息
  messageList.value.push(msg);
  // 更新畫面後再捲動
  nextTick(() => {
    const messageContainerEl = messageContainer.value;
    if (
      messageContainerEl !== null &&
      messageContainerEl.scrollHeight > messageContainerEl.offsetHeight
    ) {
      messageContainerEl.scrollTo({
        left: 0,
        top: messageContainerEl.scrollHeight,
        behavior: 'smooth'
      });
    }
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

// Hooks
onMounted(() => {
  console.log('AppChatWindow onMounted:', mode.value);
  // 註冊事件：更新使用者打字狀態
  socketOnEvent('user-typing-status', handleUserTyping);
  // 註冊事件：伺服器送發的訊息(私人or群組)
  socketOnEvent(messageEventName.value, handleMessage);
  // 資料處理
});
onBeforeUnmount(() => {
  // 註銷所有事件
  socketOffEvent('user-typing-status', handleUserTyping);
  socketOnEvent(messageEventName.value, handleMessage);
});
</script>

<template>
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
</template>

<style></style>
