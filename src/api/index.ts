import axios, { AxiosResponse } from "axios";
import { IDiettype, IFoodCategory, IFoodItem, PlanParameters } from "../types";
import { BackendResponse } from "./types";

const dpBackend = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

dpBackend.interceptors.response.use(
	(response) => {
		if (response.data.message === "error") {
			console.log(response.data);
		}
		return response;
	},
	(error) => {
		console.log("error caught:", error);
	}
);

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
	const response = await dpBackend.post<BackendResponse<IDiettype>>("/diettype", dietType);
	return response.data;
}

export async function createFoodItem(foodItem: Omit<IFoodItem, "id" | "description">) {
	const response = await dpBackend.post<BackendResponse<IFoodItem>>("/food", foodItem);
	return response.data;
}

export async function createFoodCategory(foodCategory: Omit<IFoodCategory, "id">) {
	const response = await dpBackend.post<BackendResponse<IFoodCategory>>("/foodcategory", foodCategory);
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

export async function updateFoodItemById(id: string, updatedValues: Omit<IFoodItem, "id" | "description">) {
	const response = await dpBackend.put<BackendResponse<IFoodItem>>(`/food/${id}`, updatedValues);
	return response.data;
}

export async function uploadMultipleFood(items: Omit<IFoodItem, "id">[]) {
	const response = await dpBackend.post("/food/multiple", items);
	return response.data;
}

export async function uploadRecipe(pdf: File, values: Omit<IFoodItem, "id" | "description">) {
	const formData = new FormData();
	formData.append("file", pdf);
	formData.append("data", JSON.stringify(values));
	const response = await dpBackend.post(`/food/recipe`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
}

export async function generatePlan(data: PlanParameters) {
	const response = await dpBackend.post<BackendResponse<IFoodItem[]>>("/planner", data);
	return response.data;
}
