import { IFoodItem } from "./types";

export function capitalizeString(word: string) {
	if (word.length === 1) return word.toUpperCase();
	return word.slice(0, 1).toUpperCase() + word.slice(1, word.length);
}

export function JSONtoCSV(data: any) {
	const fields = Object.keys(data[0]);
	const replacer = function (key: string, value: any) {
		return value === null ? "" : value;
	};
	let csv = data.map(function (row: any) {
		return fields
			.map(function (fieldName) {
				return JSON.stringify(row[fieldName], replacer);
			})
			.join(",");
	});
	csv.unshift(fields.join(","));
	csv = csv.join("\r\n");
	return csv;
}

export function getDay(index: number) {
	return ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][index];
}
