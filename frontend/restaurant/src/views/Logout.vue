<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

onMounted(async () => {
  	try {
    	await axios.get('http://localhost:8000/auth/logout', { withCredentials: true });
  	} catch (error) {
    	console.error("Erreur lors du logout backend", error);
  	}

  	localStorage.removeItem('user');
  	// Rediriger vers la page de login
  	router.replace('/login');
});
</script>



<template>
<div style="padding: 20px; text-align: center;">
    Déconnexion en cours...
</div>
</template>
