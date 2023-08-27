<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> | 
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <div class="main">
    <router-view />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
