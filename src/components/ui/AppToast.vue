<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, toRefs } from 'vue';

// 引入型別
import type { Toast } from '@/types';

import useToastStore from '@/stores/toastStore';

// store(toastStore)
const toastStore = useToastStore();
const { removeToast } = toastStore;

let timeoutId: number | undefined;

// Props
const props = defineProps<{
  toast: Toast;
}>();

const { toast } = toRefs(props);

// Computed
const typeClass = computed(() => `toast--${toast.value.type}`);

// Mounted
onMounted(() => {
  // 設置一個計時器
  timeoutId = window.setTimeout(() => {
    removeToast(toast.value);
  }, toast.value.timeout);
});
// Before Unmount
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});
</script>

<template>
  <div class="toast-container__item" :class="[typeClass]">{{ toast.id }}: {{ toast.content }}</div>
</template>
