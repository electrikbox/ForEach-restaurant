export const getUserId = () => {
	const storedUser = localStorage.getItem("user");
	if (!storedUser) throw new Error("User not logged in");

	const user = JSON.parse(storedUser);
	return user.id;
}
