<script lang="ts" setup>
import useToastStore from '@/stores/toastStore';

// store(toastStore)
const toastStore = useToastStore();
// 因為 setup 中用不到，所以不需要 storeToRefs
const { toasts } = toastStore;
</script>

<template>
  <div class="toast-container">
    <TransitionGroup tag="div" name="slide-down-in" class="toast-container__list">
      <AppToast v-for="toast in toasts" :key="toast.id" :toast="toast" />
    </TransitionGroup>
  </div>
</template>
