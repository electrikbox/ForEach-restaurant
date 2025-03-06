<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { reservationsApi } from "@/api/requests";
import { errorHandler } from "@/utils/errorHandler";
import { getUserColorClass } from "@/utils/getUserColorClass";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

const reservations = ref([]);



// Fetches the reservations from the API
// ============================================================================

const fetchReservations = async () => {
	try {
		const response = await reservationsApi.getAllReservations();

		reservations.value = response.data.map((res) => ({
			title: `${res.user.username}: ${res.nbPersonnes} personnes`,
			start: new Date(res.dateDebut),
			end: new Date(res.dateFin),
			id: res._id,
			user: res.user,
			class: `${getUserColorClass(res.user.username)} default`,
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



// Updates an event in the API
// ============================================================================

const updateEvent = async (event) => {
	try {
		const reservation = {
			dateDebut: event.event.start.toISOString(),
			dateFin: event.event.end.toISOString(),
		};

		await reservationsApi.updateReservation(event.event.id, reservation, event);
		await fetchReservations();
	} catch (error) {
		errorHandler(error, "Erreur lors de la mise à jour du rendez-vous");
  		await fetchReservations();
	}
};

const minDate = new Date();



// Fetch the reservations when the component is mounted
// ============================================================================

onMounted(fetchReservations);
</script>



<template>
<div class="flex items-start justify-center w-full gap-5">
	<div class="container mt-10 bg-gray-100 p-5 rounded-lg shadow-lg w-512">

	<vue-cal class="vuecal--blue-theme"
		locale="fr"
		:events="reservations"
		:min-date="minDate"
		:disable-views="['years', 'year']"
		:time="true"
		:time-from="12 * 60"
		:time-to="23 * 60"
		:time-step="30"
		:editable-events="{ title: false, drag: true, resize: false, delete: true, create: false }"
		:drag-to-create-threshold="0"	
		:snap-to-time="30"
		@event-delete="deleteEvent"
		@event-drop="updateEvent"
		@event-duration-change="updateEvent"
	/>

	</div>
</div>
</template>



<style scoped>
::v-deep .vuecal__event.default {
  	border-radius: 5px;
  	color: #fff;
}

::v-deep .vuecal__event:hover {
	  cursor: grab;
}

::v-deep .vuecal__event.user-color-0 {
  background-color: #f44336;
}
::v-deep .vuecal__event.user-color-1 {
  background-color: #e91e63;
}
::v-deep .vuecal__event.user-color-2 {
  background-color: #9c27b0;
}
::v-deep .vuecal__event.user-color-3 {
  background-color: #673ab7;
}
::v-deep .vuecal__event.user-color-4 {
  background-color: #3f51b5;
}
::v-deep .vuecal__event.user-color-5 {
  background-color: #2196f3;
}
::v-deep .vuecal__event.user-color-6 {
  background-color: #03a9f4;
}
::v-deep .vuecal__event.user-color-7 {
  background-color: #00bcd4;
}
::v-deep .vuecal__event.user-color-8 {
  background-color: #009688;
}
::v-deep .vuecal__event.user-color-9 {
  background-color: #4caf50;
}
</style>