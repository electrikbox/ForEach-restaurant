<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const dateDebut = ref('');
const dateFin = ref('');
const errorMessage = ref('');

const toast = useToast();

const add = async () => {
	errorMessage.value = ''; // Réinitialise le message d'erreur
	try {
		// Récupérer l'utilisateur connecté depuis le localStorage
		const storedUser = localStorage.getItem("user");
		if (!storedUser) throw new Error("User not logged in");

		const user = JSON.parse(storedUser);
		const userId = user.id;

		const response = await axios.post('http://localhost:8000/reservations', {
			user: userId,
			dateDebut: dateDebut.value,
			dateFin: dateFin.value,
		}, { withCredentials: true });

		console.log(response.data);

		toast.success(`Reservation ajoutée!`);

		// reinitialiser les champs
		dateDebut.value = '';
		dateFin.value = '';

	} catch (error) {
		// Vérifier si le serveur a renvoyé un message d'erreur
		if (error.response && error.response.data && error.response.data.message)
			errorMessage.value = error.response.data.message;
		else
			errorMessage.value = error.message;
	}
};
</script>



<template>
<div class="min-h-screen flex items-center justify-center w-full">
	<div class="px-8 py-6 w-full max-w-md sm:w-3/4 md:w-1/2 lg:w-1/3">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Réservez</h1>
		
		<form @submit.prevent="add">
			<div v-if="errorMessage" class="mb-4 text-red-500 text-sm text-center">
				{{ errorMessage }}
			</div>

			<div class="mb-4">
				<label for="dateDebut" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">dateDebut</label>
				<input v-model="dateDebut" type="datetime-local" id="dateDebut" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required>
			</div>

			<div class="mb-4">
				<label for="dateFin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">dateFin</label>
				<input v-model="dateFin" type="datetime-local" id="dateFin" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" required>
			</div>

			<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Add
			</button>
		</form>
	</div>
</div>
</template>
