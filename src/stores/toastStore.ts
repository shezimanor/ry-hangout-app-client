import { defineStore } from 'pinia';
import { ref } from 'vue';

// 引入型別
import type { Toast } from '@/types';

let nextId = 1;

export default defineStore('toastStore', () => {
  const toasts = ref<Toast[]>([
    {
      id: 1,
      type: 'primary',
      timeout: 50000,
      content: 'This is first toast'
    },
    {
      id: 2,
      type: 'success',
      timeout: 50000,
      content: 'This is success toast'
    },
    {
      id: 3,
      type: 'error',
      timeout: 50000,
      content: 'This is error toast'
    },
    {
      id: 4,
      type: 'warning',
      timeout: 50000,
      content: 'This is warning toast'
    },
    {
      id: 5,
      type: 'info',
      timeout: 50000,
      content: 'This is info toast'
    }
  ]);

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
