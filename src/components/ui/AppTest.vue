<script lang="ts" setup>
import { useRouter } from 'vue-router';

// router
const router = useRouter();
</script>

<template>
  <div>
    AppTest123
    <button
      class="button button--primary"
      type="button"
      @click="
        router.push({
          name: 'ChatPage'
        })
      "
    >
      back
    </button>
  </div>
</template>
