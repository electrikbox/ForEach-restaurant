export const getUserId = (event = null) => {

	// Check if user is logged in
	const storedUser = localStorage.getItem("user");
	if (!storedUser) throw new Error("User not logged in");

	const user = JSON.parse(storedUser);

	// If user is admin and event is provided, return the event's user id
	if (user.role === "admin" && event) return event.event.user._id;

	return user.id;
}
