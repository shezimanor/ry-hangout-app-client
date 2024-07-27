<script lang="ts" setup>
import type { Users } from '@/types';

// Props
defineProps<{
  userList: Users;
}>();
</script>

<template>
  <div class="online-container">
    <h3 class="online-container__title">群組成員：</h3>
    <TransitionGroup tag="ul" name="online-list" class="online-container__list">
      <li
        v-for="(user, id, index) in userList"
        :key="id"
        class="online-container__item"
        :style="`top: ${index * 24}px;`"
      >
        {{ user }}
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
