<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  keyword: {
    type: String,
    default: ''
  }
})

const filteredProducts = computed(() => {
  const keyword = props.keyword.trim().toLowerCase()

  if (!keyword) {
    return props.products
  }

  return props.products.filter(product =>
    product.name.toLowerCase().includes(keyword)
  )
})
</script>

<template>
  <div class="product_list">
    <p v-if="filteredProducts.length === 0">
      검색 결과가 없습니다.
    </p>

    <div v-else class="product_grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
