<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { Users } from '@/types';

import useGlobalStore from '@/stores/globalStore';
import useSocketStore from '@/stores/socketStore';

// Stores
const globalStore = useGlobalStore();
const socketStore = useSocketStore();
const { userId } = storeToRefs(globalStore);
const { socketOnEvent, socketOffEvent } = socketStore;

const userList = ref<Users>({});

// router
const route = useRoute();
const router = useRouter();

// State
const itemEl = ref(null);
const { height } = useElementSize(itemEl);

// Computed
const isGroupChat = computed(() => {
  return route.name === 'ChatGroupPage';
});
const isPrivateChat = computed(() => {
  return route.name === 'ChatPrivatePage';
});

// Methods
function handleUserList(users: Users) {
  userList.value = users;
}

// Hooks
onMounted(() => {
  console.log('AppOnlineList onMounted');
  // 註冊事件：群組使用者清單更新
  socketOnEvent('user-list', handleUserList);
});
onBeforeUnmount(() => {
  // 註銷事件：群組使用者清單更新
  socketOffEvent('user-list', handleUserList);
});
</script>

<template>
  <div class="online-container">
    <h3 class="online-container__title">群組成員：</h3>

    <TransitionGroup tag="ul" name="online-list" class="online-container__list">
      <li
        ref="itemEl"
        class="online-container__item"
        :class="{ 'online-container__item--active': isGroupChat }"
        key="gruop_li"
      >
        群組頻道
        <button
          v-if="!isGroupChat"
          class="button button--primary button--chat"
          type="button"
          @click="
            router.push({
              name: 'ChatGroupPage'
            })
          "
        >
          <span class="icon-[material-symbols--groups-rounded] h-6 w-6"></span>
        </button>
      </li>
      <li
        v-for="(user, id, index) in userList"
        :key="id"
        class="online-container__item"
        :class="{ 'online-container__item--active': isPrivateChat && id === route.params.id }"
        :style="`top: ${(index + 1) * height}px;`"
      >
        {{ user }}
        <button
          v-if="id !== userId"
          class="button button--primary button--chat"
          type="button"
          @click="
            router.push({
              name: 'ChatPrivatePage',
              params: {
                id
              }
            })
          "
        >
          <span class="icon-[material-symbols--chat-rounded] h-6 w-6"></span>
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.online-list-move,
.online-list-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.online-list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
.online-list-leave-active {
  position: absolute;
}
</style>
