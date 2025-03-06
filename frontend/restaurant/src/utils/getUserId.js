export const getUserId = (event = null) => {
	const storedUser = localStorage.getItem("user");
	if (!storedUser) throw new Error("User not logged in");

	const user = JSON.parse(storedUser);

	if (user.role === "admin" && event) return event.event.user._id;

	return user.id;
}
