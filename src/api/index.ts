import axios from "axios";
import { IDiettype, IFoodCategory, IFoodItem, PlanParameters } from "../types";
import { getCookie } from "../util";
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
		console.log("error caught");
	}
);

export async function getAllDiettypes() {
	const response = await dpBackend.get<BackendResponse<IDiettype[]>>("/diettype", {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function getAllFoodItems() {
	const response = await dpBackend.get<BackendResponse<IFoodItem[]>>("/food", {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function getAllFootCategories() {
	const response = await dpBackend.get<BackendResponse<IFoodCategory[]>>("/foodcategory", {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function createDietType(dietType: Omit<IDiettype, "id">) {
	const response = await dpBackend.post<BackendResponse<IDiettype>>("/diettype", dietType, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function createFoodItem(foodItem: Omit<IFoodItem, "id" | "description">) {
	const response = await dpBackend.post<BackendResponse<IFoodItem>>("/food", foodItem, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function createFoodCategory(foodCategory: Omit<IFoodCategory, "id">) {
	const response = await dpBackend.post<BackendResponse<IFoodCategory>>("/foodcategory", foodCategory, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function deleteDietType(id: string) {
	const response = await dpBackend.delete(`/diettype/${id}`, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function deleteFoodItem(id: string) {
	const response = await dpBackend.delete(`/food/${id}`, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function deleteFoodCategory(id: string) {
	const response = await dpBackend.delete(`/foodcategory/${id}`, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function updateFoodItemById(id: string, updatedValues: Omit<IFoodItem, "id" | "description">) {
	const response = await dpBackend.put<BackendResponse<IFoodItem>>(`/food/${id}`, updatedValues, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function uploadMultipleFood(items: Omit<IFoodItem, "id">[]) {
	const response = await dpBackend.post("/food/multiple", items, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function uploadRecipe(pdf: File, values: Omit<IFoodItem, "id" | "description">) {
	const formData = new FormData();
	formData.append("file", pdf);
	formData.append("data", JSON.stringify(values));
	const response = await dpBackend.post(`/food/recipe`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			AuthToken: getCookie("AuthToken"),
		},
	});
	return response.data;
}

export async function generatePlan(data: PlanParameters) {
	const response = await dpBackend.post<BackendResponse<IFoodItem[]>>("/planner", data, {
		headers: { AuthToken: getCookie("AuthToken") },
	});
	return response.data;
}

export async function login(username: string, password: string) {
	const response = await dpBackend.post<BackendResponse<{ authToken: string }>>("/auth/login", {
		username,
		password,
	});
	return response.data;
}

export async function register(email: string, username: string, password: string, confirmPassword: string) {
	const response = await dpBackend.post("/auth/register", { username, email, password, confirmPassword });
	return response.data;
}

export async function logout(token: string) {
	const response = await dpBackend.post(
		"/auth/logout",
		{ authToken: token },
		{ headers: { AuthToken: getCookie("AuthToken") } }
	);
	return response.data;
}
