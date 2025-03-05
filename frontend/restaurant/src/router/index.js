import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AddReservation from '../views/Reservations.vue'
import ReservationList from '../views/Reservations-list.vue'
import Logout from '../views/Logout.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/login', component: Login },
		{ path: '/register', component: Register },
		{ path: '/add-reservation', component: AddReservation },
		{ path: '/reservation-list', component: ReservationList },
		{ path: '/logout', component: Logout },
	],
})

export default router
