<template>
  <header class="header">
    <div class="left">
      <h2>Hello, Admin 👋</h2>
      <p>Your e-commerce insights at a glance</p>
    </div>
    <div class="right">
      <span>{{ currentDate }}</span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'DashboardHeader',
  data() {
    return {
      currentDate: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
  },
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;

  h2 {
    margin: 0;
  }

  .left p {
    font-size: 0.9rem;
    color: #777;
  }

  .right {
    font-weight: 500;
    color: #555;
  }
}
</style>
