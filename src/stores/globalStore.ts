import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('globalStore', () => {
  const userName = ref('');
  const userId = ref('');
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
    // actions
    updateUserName,
    updateUserId
  };
});
