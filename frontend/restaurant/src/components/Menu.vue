<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { ref } from 'vue';

const isHovered = ref(false);
const userString = localStorage.getItem("user");

let isAdmin;

if (userString) {
	const user = JSON.parse(userString);
	isAdmin = user.role == 'admin';
}
</script>



<template>
<nav
	class="sidebar"
	:style="{ width: isHovered ? '200px' : '65px' }"
	@mouseenter="isHovered = true"
	@mouseleave="isHovered = false"
>
	<ul>
		<li>
			<router-link to="user">
				<font-awesome-icon :icon="['fas', 'calendar-plus']" />
				<span class="menu-text">Reservations</span>
			</router-link>
		</li>
		<li v-if="isAdmin">
			<router-link to="admin">
				<font-awesome-icon :icon="['fas', 'user']" />
				<span class="menu-text">Admin</span>
			</router-link>
		</li>
		<li>
			<router-link to="/logout">
				<font-awesome-icon :icon="['fas', 'sign-out-alt']" />
				<span class="menu-text">Logout</span>
			</router-link>
		</li>
	</ul>
</nav>
</template>



<style scoped>
.sidebar {
	background-color: #202020;
	color: white;
	height: 100%;
	overflow: hidden;
	padding: 20px;
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0;
	left: 0;
	transition: width 0.3s ease;
}

.sidebar ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.sidebar ul li {
	display: flex;
	align-items: center;
	margin: 15px 0;
	padding: 10px 0;
}

.sidebar ul li a {
	display: flex;
	align-items: center;
	text-decoration: none;
	color: white;
	font-size: 14px;
	font-weight: bold;
	transition: color 0.3s ease;
}

.sidebar ul li a:hover {
	color: #54a4ff;
}

.menu-text {
	opacity: 0;
	transition: opacity 0.3s ease;
	white-space: nowrap;
	padding-left: 1em;
}

.sidebar:hover .menu-text {
	opacity: 1;
}
</style>
	