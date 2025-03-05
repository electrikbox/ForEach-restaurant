<script setup>
import { ref, onMounted } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import axios from "axios";

const reservations = ref([]);
const selectedEvent = ref(null);

const fetchReservations = async () => {
	try {
		const storedUser = localStorage.getItem("user");
		if (!storedUser) throw new Error("User not logged in");

		const user = JSON.parse(storedUser);
		const userId = user.id; // ou user._id selon ta structure
		
		const response = await axios.get(
			`http://localhost:8000/reservations/user/${userId}`,
			{ withCredentials: true }
		);

		reservations.value = response.data.map((appt) => ({
			title: "Le Gourmet Moderne",
			start: new Date(appt.dateDebut),
			end: new Date(appt.dateFin)
		}));

	} catch (error) {
		console.error("Erreur lors du chargement des rendez-vous", error);
	}
};

const showEventDetails = (event) => {
	selectedEvent.value = event;
};

const formatDate = (date) => {
	return new Intl.DateTimeFormat("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

onMounted(fetchReservations);
</script>



<template>
<div class="min-h-screen flex items-center justify-center w-full">

	<div class="container mt-5 bg-gray-700 p-5 rounded-lg shadow-lg">
		<h2>Calendrier des rendez-vous</h2>
		<vue-cal class="vuecal--blue-theme"
		locale="fr"
		:events="reservations"
		:disable-views="['years', 'year']"
		@event-click="showEventDetails"
		:time="true"
		:time-from="12 * 60"
  		:time-to="23 * 60"
  		:time-step="30"
		/>
			
		<!-- Modal pour afficher les détails -->
		<div v-if="selectedEvent" class="modal fade show d-block" tabindex="-1" role="dialog">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Détails du rendez-vous</h5>
						<button type="button" class="btn-close" @click="selectedEvent = null"></button>
					</div>
					<div class="modal-body">
						<p><strong>Titre:</strong> {{ selectedEvent.title }}</p>
						<p><strong>Date:</strong> {{ formatDate(selectedEvent.start) }}</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" @click="selectedEvent = null">Fermer</button>
					</div>
				</div>
			</div>
		</div>
		
		<div v-if="selectedEvent" class="modal-backdrop fade show"></div>
	</div>
</div>
</template>
