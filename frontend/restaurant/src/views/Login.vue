<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { authApi } from '@/api/requests';


const email = ref('');
const password = ref('');
const errorMessage = ref('');

const toast = useToast();
const router = useRouter();


const login = async () => {
	errorMessage.value = ''; // Réinitialise le message d'erreur
	try {
		const response = await authApi.login(email.value, password.value);

		localStorage.setItem('user', JSON.stringify(response.data));

		toast.success(`Welcome, ${response.data.username} !`);
		router.push('/user');
	} catch (error) {
		errorMessage.value = 'Login failed. Please check your credentials.';
		console.error(error);
	}
};
</script>



<template>
<div class="min-h-screen flex items-center justify-center w-full">
	<div class="p-6 w-full max-w-md sm:w-3/4 md:w-1/2 lg:w-1/3 bg-gray-700 rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Login !</h1>
		
		<form @submit.prevent="login">
			<div v-if="errorMessage" class="mb-4 text-red-500 text-sm text-center">
				{{ errorMessage }}
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
				<a href="/register" class="text-xs text-cyan-500 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">Create Account</a>
			</div>

			<button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Login
			</button>
		</form>
	</div>
</div>
</template>
