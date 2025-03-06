export const  getUserColorClass = (username) => {
	let hash = 0;

	// On parcourt chaque caractère du nom d'utilisateur
	for (let i = 0; i < username.length; i++)
		// On ajoute le code ASCII du caractère à notre hash
		// On décale le hash de 5 bits vers la gauche et on soustrait le hash
		// On obtient un nombre négatif
		hash = username.charCodeAt(i) + ((hash << 5) - hash);

	// Pour obtenir un nombre positif
	hash = Math.abs(hash);

	// On veut un nombre entre 0 et 9
	const colorIndex = hash % 10;
	return `user-color-${colorIndex}`;
}