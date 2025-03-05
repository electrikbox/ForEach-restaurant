<!-- eslint-disable vue/multi-word-component-names -->
 
<script setup>
import { ref } from 'vue';
// import axios from 'axios';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/requests';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

const register = async () => {
	errorMessage.value = ''; // Réinitialise le message d'erreur
	try {
		// await axios.post('http://localhost:8000/auth/register', {
		// 	username: username.value,
		// 	email: email.value,
		// 	password: password.value
		// });

		await authApi.register(username.value, email.value, password.value);

		router.push('/login');
	} catch (error) {
		errorMessage.value = 'Login failed. Please check your credentials.';
		console.error(error);
	}
};
</script>



<template>
<div class="min-h-screen flex items-center justify-center w-full">
	<div class="px-8 py-6 w-full max-w-md sm:w-3/4 md:w-1/2 lg:w-1/3">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Create account!</h1>
		
		<form @submit.prevent="register">
			<div v-if="errorMessage" class="mb-4 text-red-500 text-sm text-center">
				{{ errorMessage }}
			</div>

			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
				<input v-model="username" type="username" id="username" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your username" required>
			</div>

			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
				<input v-model="email" type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required>
			</div>

			<div class="mb-4">
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
				<input v-model="password" type="password" id="password" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" required>
			</div>

			<div class="flex items-center justify-between mb-4">
				<a href="/login" class="text-xs text-amber-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">Login</a>
			</div>

			<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Register
			</button>
		</form>
	</div>
</div>
</template>
