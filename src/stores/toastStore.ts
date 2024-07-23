import { defineStore } from 'pinia';
import { ref } from 'vue';

// 引入型別
import type { Toast } from '@/types';

let nextId = 1;

export default defineStore('toastStore', () => {
  const toasts = ref<Toast[]>([]);

  function addToast(ToastToAdd: Toast) {
    toasts.value.push({
      ...ToastToAdd,
      id: nextId++
    });
  }
  function removeToast(toastToRemove: Toast) {
    const index = toasts.value.findIndex((toast) => toast.id === toastToRemove.id);
    toasts.value.splice(index, 1);
  }

  return {
    // state
    toasts,
    // actions
    addToast,
    removeToast
  };
});
