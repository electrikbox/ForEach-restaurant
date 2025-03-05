<!-- <script setup>
</script>

<template>
  <RouterView />
</template> -->


<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Menu from './components/Menu.vue';

const route = useRoute();
// Le menu ne s'affichera pas sur "/login" et "/register"
const showMenu = computed(() => !['/login', '/register'].includes(route.path));
</script>

<template>
  <div>
    <!-- Afficher le menu si la route n'est pas "/login" ou "/register" -->
    <Menu v-if="showMenu" />
    <router-view />
  </div>
</template>
