<script setup>
  import { ref } from 'vue'
  const text = ref('')
</script>

<template>
  <header>
    <router-link to="/">홈</router-link>
    <router-link to="/page01">소개</router-link>
    <router-link to="/list">리스트</router-link>
  </header>
</template>