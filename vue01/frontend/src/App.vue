<script setup>
  import { ref } from 'vue';
  import Header from './components/Header.vue'

  const text = ref('');
</script>

<template>
  <Header/>
  <!--  현재 페이지 위치 보여줌  -->
  <router-view />
</template>