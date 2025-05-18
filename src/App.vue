<template>
  <div class="app">
    <Sidebar />
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/SidebarComp.vue'

export default {
  components: { Sidebar },
}
</script>

<style lang="scss">
.app {
  display: flex;
}
.main-content {
  flex: 1;
  padding: 1rem;
  background: #fff;
}
</style>
