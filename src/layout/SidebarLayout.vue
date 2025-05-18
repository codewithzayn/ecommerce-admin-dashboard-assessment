<template>
  <v-layout>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item-title class="text-h6">Admin Panel</v-list-item-title>
        <v-divider class="my-2" />

        <v-list-item
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          link
          class="my-1"
          :active="link.to === $route.path"
        >
          <v-list-item-title>{{ link.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>
const links = [
  { name: 'Dashboard', to: '/' },
  { name: 'Inventory', to: '/inventory' },
  { name: 'Add Product', to: '/add-product' },
]
</script>

<style scoped lang="scss">
v-navigation-drawer {
  background-color: #1e1e2f;
  color: white;
  padding-top: 20px;
}

v-main {
  padding: 2rem;
  background-color: #f5f6fa;
  min-height: 100vh;
}
</style>
