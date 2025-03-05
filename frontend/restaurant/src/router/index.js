import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Logout from '../views/Logout.vue'
import Admin from '../views/Admin.vue'
import { useToast } from 'vue-toastification';

const toast = useToast();

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/register', component: Register },
		{ path: '/login', component: Login },
		{ path: '/logout', component: Logout },
		{ path: '/user', component: User, meta: { requiresAuth: true } },
		{ path: '/admin', component: Admin, meta: { requiresAuth: true, requireAdmin: true } },
	],
})

router.beforeEach((to, from, next) => {
	// Si la route requiert une authentification
	if (to.meta.requiresAuth) {
	  	const storedUser = localStorage.getItem("user");
	  	if (!storedUser) return next({ path: '/login' });
	}
  
	// Si la route requiert un accès admin
	if (to.meta.requireAdmin) {
	  	const storedUser = localStorage.getItem("user");

	  	if (!storedUser) {
			return next({ path: '/login' });

		} else {
			const user = JSON.parse(storedUser);

			if (user.role !== 'admin') {
		  		toast.error("Vous n'avez pas les droits pour accéder à cette page");
		  		return next({ path: '/user' });
			}
		}
	}
	next();
});

export default router
