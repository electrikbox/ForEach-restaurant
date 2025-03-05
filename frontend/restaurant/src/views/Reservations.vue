<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
// import { useRouter } from 'vue-router';

const toast = useToast();
// const router = useRouter();
const errorMessage = ref('');

// La date sélectionnée au format mm/dd/yyyy (par défaut, on l'initialise avec une valeur, ici "02/25/2024")
const selectedDate = ref("02/25/2024");
// La sélection d'heure, par défaut le premier créneau
const selectedHour = ref('12:00');

const hours = [
  { value: '12:00', label: '12:00', id: '12' },
  { value: '12:30', label: '12:30', id: '12-30' },
  { value: '13:00', label: '13:00', id: '13' },
  { value: '13:30', label: '13:30', id: '13-30' },
];

onMounted(() => {
  // Initialisation du datepicker inline.
  // ATTENTION : Adaptez cette partie en fonction du plugin utilisé.
  const dpElement = document.getElementById("datepicker-inline");
  if (dpElement) {
    // Exemple d'écoute d'événement si le plugin déclenche "changeDate"
    dpElement.addEventListener("changeDate", (event) => {
      // Supposons que event.detail.date contienne la date sélectionnée au format mm/dd/yyyy
      if (event.detail && event.detail.date) {
        selectedDate.value = event.detail.date;
      }
    });
    // Si votre plugin ne déclenche pas d'événement, vous pouvez aussi initialiser selectedDate
    // par exemple : selectedDate.value = dpElement.getAttribute('data-date');
  }
});

const add = async () => {
  errorMessage.value = '';
  try {
    // Récupérer l'utilisateur connecté depuis le localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) throw new Error("User not logged in");
    const user = JSON.parse(storedUser);
    const userId = user.id;

    // Vérifier que la date et l'heure sont définies
    if (!selectedDate.value || !selectedHour.value) {
      throw new Error("Veuillez sélectionner une date et une heure.");
    }

    // Convertir selectedDate (mm/dd/yyyy) et selectedHour (HH:MM) en un objet Date.
    // Exemple : "02/25/2024" et "12:00" => "2024-02-25T12:00:00"
    const [month, day, year] = selectedDate.value.split('/');
    // Format ISO attendu : YYYY-MM-DD
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const dateDebutString = `${isoDate}T${selectedHour.value}:00`;
    const dateDebut = new Date(dateDebutString);
    // La réservation dure 30 minutes
    const dateFin = new Date(dateDebut.getTime() + 30 * 60 * 1000);

    // Envoi de la requête POST pour créer la réservation
    const response = await axios.post('http://localhost:8000/reservations', {
      user: userId,
      dateDebut: dateDebut.toISOString(),
      dateFin: dateFin.toISOString()
    }, { withCredentials: true });

    console.log(response.data);
    toast.success("Reservation ajoutée!");
    
    // Optionnel : réinitialiser les sélections
    // Vous pouvez remettre selectedDate à une valeur par défaut si nécessaire
    selectedHour.value = hours[0].value;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message)
      errorMessage.value = error.response.data.message;
    else
      errorMessage.value = error.message;
  }
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center w-full">
		<div id="datepicker-inline" inline-datepicker data-date="02/25/2024"></div>

    	<form @submit.prevent="add">
      		<div v-if="errorMessage" class="mb-4 text-red-500 text-sm text-center">
        		{{ errorMessage }}
      		</div>

      		<!-- Datepicker inline -->
      		<div class="mb-4">
        		<label for="datepicker-inline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          			Choisissez la date
        		</label>
        		<!-- Utilisation du snippet fourni. L'attribut data-date est lié à selectedDate pour l'initialisation -->
        		<div id="datepicker-inline" inline-datepicker :data-date="selectedDate"></div>
      		</div>

      		<!-- Liste des créneaux horaires -->
      		<ul id="timetable" class="w-full flex flex-col mt-5 gap-2">
        		<li v-for="hour in hours" :key="hour.value">
          			<input
            			type="radio"
            			:id="hour.id"
            			:value="hour.value"
            			class="hidden peer"
            			name="timetable"
            			v-model="selectedHour"
          			/>
          			<label :for="hour.id"
            			class="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white dark:peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500"
          			>
            			{{ hour.label }}
          			</label>
        		</li>
      		</ul>

      		<!-- Bouton pour envoyer la réservation -->
      		<button type="submit" class="w-full flex justify-center py-2 px-4 mt-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        		Add
      		</button>
    	</form>
  	</div>
</template>

<style scoped>
/* Vous pouvez adapter ou ajouter vos styles existants */
</style>
