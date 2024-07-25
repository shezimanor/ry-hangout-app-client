import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export default defineStore('globalStore', () => {
  const userName = ref('');
  const userId = ref('');
  const user = computed(() => ({
    id: userId.value,
    name: userName.value
  }));
  function updateUserName(newValue: string) {
    userName.value = newValue;
  }
  function updateUserId(newValue: string) {
    userId.value = newValue;
  }

  return {
    // state
    userName,
    userId,
    // getters
    user,
    // actions
    updateUserName,
    updateUserId
  };
});
