<template>
  <div class="sidebar">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/inventory">Inventory</router-link>
    <router-link to="/add-product">Add Product</router-link>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #f4f5f7;
  height: 100vh; /* Use full height of the viewport */
  width: 220px;
  overflow-y: auto; /* Scroll only when needed */
  box-sizing: border-box; /* Padding doesn't add to overflow */
  transition: width 0.3s ease;

  a {
    padding: 0.8rem 0;
    color: #333;
    text-decoration: none;
    &:hover {
      color: #007bff;
    }
  }

  // Medium screens (tablets)
  @media (max-width: 992px) {
    width: 180px;
  }

  // Small screens (phones)
  @media (max-width: 768px) {
    width: 150px;

    a {
      font-size: 14px;
      padding: 0.6rem 0;
    }
  }

  // Extra small screens
  @media (max-width: 480px) {
    width: 120px;

    a {
      font-size: 12px;
      padding: 0.5rem 0;
    }
  }
}
</style>
