<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { reservationsApi } from "@/api/requests";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

const reservations = ref([]);

// Fetches the reservations from the API
// ============================================================================

const fetchReservations = async () => {
	try {
		const response = await reservationsApi.getUserReservations();

		reservations.value = response.data.map((res) => ({
			title: "Le Gourmet Moderne",
			start: new Date(res.dateDebut),
			end: new Date(res.dateFin),
			id: res._id,
		}));

	} catch (error) {
		console.error("Erreur lors du chargement des rendez-vous", error);
	}
};



// Deletes an event from the API
// ============================================================================

const deleteEvent = async (event) => {
  try {
	await reservationsApi.deleteReservation(event.id);
	await fetchReservations();
  } catch (error) {
	console.error("Erreur lors de la suppression du rendez-vous", error);
  }
};



// Creates an event in the API
// ============================================================================

const createEvent = async (event) => {
	try {
		await reservationsApi.createReservation({
			dateDebut: event.start.toISOString(),
			dateFin: event.end.toISOString(),
		});
		await fetchReservations();
	} catch (error) {
		console.error("Erreur lors de la création du rendez-vous", error);
	}
};



// Updates an event in the API
// ============================================================================

const updateEvent = async (event) => {
	try {
		await reservationsApi.updateReservation(event.event.id, {
			dateDebut: event.event.start.toISOString(),
			dateFin: event.event.end.toISOString(),
		});
		await fetchReservations();
	} catch (error) {
		console.error("Erreur lors de la mise à jour du rendez-vous", error);
	}
};



// Fetch the reservations when the component is mounted
// ============================================================================

onMounted(fetchReservations);
</script>



<template>
<div class="flex items-center justify-center w-full">

	<div class="container mt-5 bg-gray-700 p-5 rounded-lg shadow-lg">

		<h2>Calendrier des rendez-vous</h2>

		<vue-cal class="vuecal--blue-theme"
			locale="fr"
			:events="reservations"
			:disable-views="['years', 'year']"
			:time="true"
			:time-from="12 * 60"
	  		:time-to="23 * 60"
	  		:time-step="30"
			:editable-events="{ title: false, drag: false, resize: true, delete: true, create: true }"
	  		:drag-to-create-threshold="0"	
			:snap-to-time="30"
			@event-delete="deleteEvent"
  			@event-duration-change="updateEvent"
  			@event-drag-create="createEvent"
		/>

	</div>

</div>
</template>
