<template>
  <div id="app">
    <MainLayout v-if="showLayout">
      <router-view />
    </MainLayout>
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const route = useRoute();
const showLayout = computed(() => route.name !== 'Login');
</script>
