<script setup>
import { ref, onMounted } from 'vue'
import { getAllDocs, addDoc } from '../stores/myStore.js'

const products = ref([])

onMounted(async () => {
  products.value = await getAllDocs()
})
</script>

<template>
  <div>
    <h1>Product List</h1>
     <div>{{ products }}</div>
    <ul>
      <li v-for="product in products" :key="product._id">
        {{ product.name }} - {{ product.price }}$
      </li>
    </ul>
  </div>
</template>
