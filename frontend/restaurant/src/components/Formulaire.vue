<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from "vue";
import { reservationsApi } from "@/api/requests";
import { useToast } from "vue-toastification";
import { errorHandler } from "@/utils/errorHandler";
import { defineEmits } from 'vue';

const emit = defineEmits(['reservation-created']);
const toast = useToast();

const selectedDate = ref("");
const selectedTime = ref("");
const nbPeople = ref(1);

// Calcul de la date minimale (aujourd'hui)
const today = new Date();
const minDate = computed(() => {
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
});

// Créneaux horaires disponibles : de 12:00 à 14:00 et de 20:00 à 22:00, avec un pas de 30 min
const morningSlots = ["12:00", "12:30", "13:00", "13:30", "14:00"];
const eveningSlots = ["20:00", "20:30", "21:00", "21:30", "22:00"];
const allSlots = computed(() => [...morningSlots, ...eveningSlots]);

// Fonction de soumission du formulaire
const submitForm = async () => {
	if (!selectedDate.value || !selectedTime.value) {
		alert("Veuillez sélectionner une date et une heure.");
		return;
	}
	
	try {
		// Combiner la date et l'heure sélectionnées pour créer un datetime complet
		const datetimeString = `${selectedDate.value}T${selectedTime.value}:00`;
		const dateDebut = new Date(datetimeString);
		
		// Forcer la durée de l'événement à 1 heure maximum
		const maxDuration = 60 * 60 * 1000; // 1 heure en ms
		const dateFin = new Date(dateDebut.getTime() + maxDuration);

		// Appel à l'API pour créer la réservation
		await reservationsApi.createReservation({
			dateDebut: dateDebut.toISOString(),
			dateFin: dateFin.toISOString(),
			nbPersonnes: nbPeople.value
		});
		toast.success("Reservation ajoutée!");

		// Réinitialiser les champs du formulaire
		selectedDate.value = "";
		selectedTime.value = "";
		nbPeople.value = 1;
		emit('reservation-created');

	} catch (error) {
		errorHandler(error, "Erreur lors de la création du rendez-vous");
	}
};
</script>

<template>
	<div class="pb-4 rounded mx-auto">
		<form @submit.prevent="submitForm">
			<div class="flex flex-wrap gap-4">

				<!-- Champ Date -->
				<div class="flex-1">
					<label for="date" class="block text-sm font-medium text-gray-700">Date</label>
					<input 
						type="date" 
						id="date" 
						v-model="selectedDate" 
						:min="minDate" 
						class="mt-1 block w-full border border-gray-300 rounded-md p-2" 
						required
					/>
				</div>

				<!-- Champ Heure -->
				<div class="flex-1">
					<label for="time" class="block text-sm font-medium text-gray-700">Heure</label>
					<select 
						id="time" 
						v-model="selectedTime" 
						class="mt-1 block w-full border border-gray-300 rounded-md p-2" 
						required
					>
						<option disabled value="">Veuillez sélectionner une heure</option>
						<option v-for="time in allSlots" :key="time" :value="time">
							{{ time }}
						</option>
					</select>
				</div>

				<!-- Nombre de personnes -->
				<div class="flex-1">
					<label for="nbPeople" class="block text-sm font-medium text-gray-700">Nombre de personnes</label>
					<input 
						type="number" 
						id="nbPeople" 
						v-model.number="nbPeople" 
						min="1"
						max="10"
						class="mt-1 block w-full border border-gray-300 rounded-md p-2" 
						required
					/>
				</div>
			</div>

			<!-- Bouton de soumission -->
			<button 
				type="submit" 
				class="w-full bg-amber-400 text-white py-2 px-4 mt-6 rounded hover:bg-amber-300"
			>
				Réserver
			</button>
		</form>
	</div>
</template>
