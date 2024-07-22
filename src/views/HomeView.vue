<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import useGlobalStore from '@/stores/globalStore';

// router
const router = useRouter();

// store(globalStore)
const globalStore = useGlobalStore();
const { userName } = storeToRefs(globalStore);
const { updateUserName } = globalStore;

const currentUser = ref('');

// Methods
function onSubmit(evt: Event) {
  evt.preventDefault();
}
function onCreateUser() {
  updateUserName(currentUser.value);
  router.push({
    name: 'ChatPage'
  });
}

// Mounted
onMounted(() => {
  if (userName.value.length > 0) currentUser.value = userName.value;
});
</script>

<template>
  <div class="view-center-container">
    <form class="flex h-8 flex-none items-stretch gap-x-2" action="" @submit="onSubmit">
      <AppInput
        type="text"
        placeholder="請輸入你的名字"
        v-model="currentUser"
        @enter-up="onCreateUser"
      />
      <button
        class="button button--primary"
        type="button"
        :disabled="currentUser === ''"
        @click="onCreateUser"
      >
        <span class="icon-[material-symbols--send-rounded] h-6 w-6"></span>
      </button>
    </form>
  </div>
</template>
