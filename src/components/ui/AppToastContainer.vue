<script lang="ts" setup>
import useToastStore from '@/stores/toastStore';

// store(toastStore)
const toastStore = useToastStore();
// 因為 setup 中用不到，所以不需要 storeToRefs
const { toasts } = toastStore;
</script>

<template>
  <div class="toast-container">
    <TransitionGroup tag="div" name="toast-list" class="toast-container__list">
      <AppToast v-for="toast in toasts" :key="toast.id" :toast="toast" />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
}
.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.toast-list-leave-active {
  position: absolute;
}
</style>
