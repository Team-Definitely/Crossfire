<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-400 to-dark-600 text-white pt-2">
    <Navbar />
    <router-view />
  </div>
</template>

<style>
</style>
