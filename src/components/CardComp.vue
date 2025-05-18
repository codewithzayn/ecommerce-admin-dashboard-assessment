<template>
  <div class="card-comp">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-value">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>

<style scoped lang="scss">
.card-comp {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 5px rgba(149, 47, 47, 0.1);
  text-align: center;
}
.card-title {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}
.card-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #13c2b0;
}
</style>
