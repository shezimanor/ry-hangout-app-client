<script setup>
// vueuse: Shorthand for v-model binding, props + emit -> ref
import { useVModel } from '@vueuse/core';
// Vue
import { computed, ref } from 'vue';

// Ref
const elInput = ref(null);
const isComposing = ref(false); // 用來判斷輸入法(IME:中日韓)的輸入狀態

// Props
const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    // 綁 v-model 的內建參數名稱
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: String,
    default: ''
  }
});

// computed
const isDisabled = computed(() => {
  return props.disabled;
});

// defineEmits: 物件形式可以做送出事件前的驗證
const emit = defineEmits({
  // xxx: null 不需要驗證
  'update:modelValue': null,
  'enter-up': null
});

// methods
function onInput(event) {
  if (event.isComposing) {
    isComposing.value = true;
    return;
  }
  inputValue.value = event.target.value;
}
function onEnter() {
  if (!isComposing.value) {
    emit('enter-up');
  }
  // 重置
  isComposing.value = false;
}

// 🚩 關鍵步驟
const inputValue = useVModel(props, 'modelValue', emit);
</script>

<template>
  <input
    ref="elInput"
    v-model="inputValue"
    :type="type"
    class="flex-auto rounded border px-2 text-neutral-600 outline-none"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="onInput"
    @keyup.enter="onEnter"
    autocomplete="off"
  />
</template>
