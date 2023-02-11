import { IFoodItem } from "./types";

export function capitalizeString(word: string) {
	if (word.length === 1) return word.toUpperCase();
	return word.slice(0, 1).toUpperCase() + word.slice(1, word.length);
}
