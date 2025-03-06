import axios from "axios";
import router from "@/router/index";
import { getUserId } from "@/utils/getUserId";



// Create userApi and cocktailApi
// ============================================================================

const authApi = axios.create({
  	baseURL: "http://localhost:8000/auth",
  	headers: { "Content-Type": "application/json" },
	withCredentials: true
});

const reservationsApi = axios.create({
	baseURL: "http://localhost:8000/reservations",
	headers: { "Content-Type": "application/json" },
	withCredentials: true
});



// Methods
// ============================================================================

authApi.register = (username, email, password) => {
	return authApi.post('/register', { username, email, password });
}

authApi.login = (email, password) => {
	return authApi.post('/login', { email, password });
}

authApi.logout = () => {
	return authApi.post('/logout');
}

reservationsApi.getUserReservations = () => {
	const userId = getUserId();
	return reservationsApi.get(`/user/${userId}`);
}

reservationsApi.getAllReservations = () => {
	return reservationsApi.get(`/`);
}

reservationsApi.deleteReservation = (id) => {
	return reservationsApi.delete(`/${id}`);
}

reservationsApi.createReservation = (reservation) => {
	const user = getUserId();
	return reservationsApi.post("/", { ...reservation, user });
}

reservationsApi.updateReservation = (id, reservation, event) => {
	const user = getUserId(event);
	return reservationsApi.put(`/${id}`, { ...reservation, user });
}
	


// Interceptors
// ============================================================================

authApi.interceptors.response.use(
  	(response) => response,
  	(error) => {
		if (error.response?.status === 401) {
	  		console.log("Token invalide ou utilisateur non authentifié");
	  		router.push("/login");
		}
		return Promise.reject(error);
  	}
);

reservationsApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.log("Token invalide ou utilisateur non authentifié");
			router.push("/login");
		}
		return Promise.reject(error);
	}
);



// export
// ============================================================================

export { authApi, reservationsApi };