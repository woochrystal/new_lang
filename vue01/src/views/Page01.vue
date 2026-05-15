<script setup>
  import { ref } from 'vue';

  const tit = ('page01');
  const text01 = ref('');

</script>

<template>
  <h1>{{ tit }}</h1>

  <div>
    <input v-model="text01" placeholder="밑에 나옴">

    <p>{{ text01 }}</p>
  </div>
</template>