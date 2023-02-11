import axios, { AxiosResponse } from "axios";
import { IDiettype, IFoodCategory, IFoodItem } from "../types";
import { BackendResponse } from "./types";

const dpBackend = axios.create({
	baseURL: "https://dp-backend.onrender.com/",
	// baseURL: "http://localhost:3333/",
	headers: {
		"Content-Type": "application/json",
	},
});

export async function getAllDiettypes() {
	const response = await dpBackend.get<BackendResponse<IDiettype[]>>("/diettype");
	return response.data;
}

export async function getAllFoodItems() {
	const response = await dpBackend.get<BackendResponse<IFoodItem[]>>("/food");
	return response.data;
}

export async function getAllFootCategories() {
	const response = await dpBackend.get<BackendResponse<IFoodCategory[]>>("/foodcategory");
	return response.data;
}

export async function createDietType(dietType: Omit<IDiettype, "id">) {
	const response = await dpBackend.post<Omit<IDiettype, "id">, AxiosResponse<IDiettype>>("/diettype", dietType);
	return response.data;
}

export async function createFoodItem(foodItem: Omit<IFoodItem, "id">) {
	const response = await dpBackend.post<Omit<IFoodItem, "id">, AxiosResponse<IFoodItem>>("/food", foodItem);
	return response.data;
}

export async function createFoodCategory(foodCategory: Omit<IFoodCategory, "id">) {
	const response = await dpBackend.post<Omit<IFoodCategory, "id">, AxiosResponse<IFoodCategory>>(
		"/foodcategory",
		foodCategory
	);
	return response.data;
}

export async function deleteDietType(id: string) {
	const response = await dpBackend.delete(`/diettype/${id}`);
	return response.data;
}

export async function deleteFoodItem(id: string) {
	const response = await dpBackend.delete(`/food/${id}`);
	return response.data;
}

export async function deleteFoodCategory(id: string) {
	const response = await dpBackend.delete(`/foodcategory/${id}`);
	return response.data;
}

export async function updateFoodItemById(id: string, updatedValues: Omit<IFoodItem, "id">) {
	const response = await dpBackend.put(`/food/${id}`, updatedValues);
	return response.data;
}
