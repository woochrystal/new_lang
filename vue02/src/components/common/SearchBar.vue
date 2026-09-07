<script setup>
import { ref } from 'vue'

const inputValue = ref('')

const emit = defineEmits(['search'])

function submitSearch() {
  emit('search', inputValue.value)
}
</script>

<template>
  <div class="search">
    <input
      v-model="inputValue"
      type="text"
      placeholder="상품명을 검색하세요"
      @keyup.enter="submitSearch"
    >

    <button type="button" @click="submitSearch">
      검색
    </button>
  </div>
</template>
