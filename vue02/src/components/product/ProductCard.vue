<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="product_card">
    <div class="product_image">
      상품 이미지
    </div>

    <div class="product_info">
      <span>{{ product.category }}</span>
      <h2>{{ product.name }}</h2>
      <strong>{{ product.price.toLocaleString() }}원</strong>
    </div>
  </article>
</template>
