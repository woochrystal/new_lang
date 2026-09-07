<script setup>
import { ref } from 'vue'
import SearchBar from '../components/common/SearchBar.vue'
import ProductList from '../components/product/ProductList.vue'
import { products } from '../data/products.js'

const keyword = ref('')

function handleSearch(value) {
  keyword.value = value
}
</script>

<template>
  <section class="home">
    <div class="container">
      <h1>상품 목록</h1>

      <!-- 자식 SearchBar가 emit으로 부모에게 검색어 전달 -->
      <SearchBar @search="handleSearch" />

      <!-- 부모가 props로 데이터와 검색어 전달 -->
      <ProductList
        :products="products"
        :keyword="keyword"
      />
    </div>
  </section>
</template>
