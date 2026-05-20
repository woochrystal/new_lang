<script setup>
  import { ref } from 'vue';
// 서버에 요청 보내는 axios 가져오기
  import axios from 'axios';

  // 변수 저장
  const message = ref('');
  const user = ref({});
  const name = ref('');


  //버튼 실행 함수
  async function getTest() {
    const url = `http://localhost:8080/api/test?name=${name.value}`;
    console.log(url);

    //주소로 요청 보내고
    const ref = await axios.get(url)
    // 결과 받아옴
    message.value = ref.data;
    user.value = ref.data;
  }

  const tit = ('page01');

</script>

<template>
  <h1>{{ tit }}</h1>

  <div>
    <button @click="getTest">Get Test</button>
    <h4>message ''</h4>
    <p>{{message}}</p>

    <hr/>
    <h4>user {}</h4>
    <p>이름 : {{user.name}}</p>

    <hr/>
    <!-- v-model : input 에 입력한 값 > name으로 들어감-->
    <input type="text" v-model="name" placeholder="이름 입력">


  </div>
</template>