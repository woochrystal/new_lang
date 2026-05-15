<script setup>
import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <div>
    <router-link to="/">홈</router-link>
    <br/>
    <router-link to="/page01">소개</router-link>

    <!--  현재 페이지 위치 보여줌  -->
    <router-view />
  </div>
</template>