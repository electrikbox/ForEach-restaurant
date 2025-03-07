<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { reservationsApi } from "@/api/requests";
import { errorHandler } from "@/utils/errorHandler";
import VueCal from "vue-cal";
import Formulaire from "@/components/Formulaire.vue";
import "vue-cal/dist/vuecal.css";

const reservations = ref([]);

const minDate = new Date();


// Fetches the reservations from the API
// ============================================================================

const fetchReservations = async () => {
	try {
		const response = await reservationsApi.getUserReservations();

		reservations.value = response.data.map((res) => ({
			title: `nombre de personnes: ${res.nbPersonnes}`,
			start: new Date(res.dateDebut),
			end: new Date(res.dateFin),
			id: res._id,
			class: "default",
		}));

	} catch (error) {
		errorHandler(error, "Erreur lors de la récupération des rendez-vous");
	}
};



// Deletes an event from the API
// ============================================================================

const deleteEvent = async (event) => {
  	try {
		await reservationsApi.deleteReservation(event.id);
		await fetchReservations();
  	} catch (error) {
		errorHandler(error, "Erreur lors de la suppression du rendez-vous");
  		await fetchReservations();
	}
};



// Fetch the reservations when the component is mounted
// ============================================================================

onMounted(fetchReservations);
</script>



<template>
<div class="flex items-start justify-center w-full gap-5">

	<div class="container mt-10 bg-gray-100 p-5 rounded-lg shadow-lg w-512">
		<Formulaire @reservation-created="fetchReservations" />

		<h3 class="text-3xl font-bold pt-2">Vos réservations</h3>
		<hr class="mb-5 h-0.5 border-t-0 bg-cyan-700" />

		<vue-cal class="vuecal--blue-theme"
			locale="fr"
			:events="reservations"
			:min-date="minDate"
			:disable-views="['years', 'year']"
			:time="true"
			:time-from="12 * 60"
			:time-to="23 * 60"
			:time-step="30"
			:editable-events="{ title: false, drag: false, resize: false, delete: true, create: false }"
			:drag-to-create-threshold="0"	
			:snap-to-time="30"
			@event-delete="deleteEvent"
		/>
	</div>

</div>
</template>



<style scoped>
::v-deep .vuecal__event.default {
  	background-color: rgba(50, 92, 126, 0.9);
  	border-radius: 5px;
  	color: #fff;
}
</style>