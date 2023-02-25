export interface IDiettype {
	id: string;
	name: string;
}

export interface IFoodItem {
	id: string;
	name: string;
	description: string;
	type: string;
	category: string;
}

export interface IFoodCategory {
	id: string;
	name: string;
}

const SELECTION = {
	CREATE: "CREATE",
	EDIT: "EDIT",
} as const;

export type SELECTION = typeof SELECTION[keyof typeof SELECTION];

export interface PlanParameters {
	types?: string[];
	categories?: string[];
}
