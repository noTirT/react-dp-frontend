import { useRef } from "react";
import { getAllFoodItems, uploadMultipleFood } from "../../api";
import { JSONtoCSV } from "../../util";
import "./FileOptions.scss";
import Papa from "papaparse";
import { IFoodItem } from "../../types";

interface Props {
	fetchItems: () => void;
}
function FileOptions({ fetchItems }: Props) {
	const csvInputRef = useRef<HTMLInputElement>(null);

	async function downloadFoodCSV() {
		const foodItems = await getAllFoodItems();
		const csv = JSONtoCSV(foodItems.data);
		const link = document.createElement("a");
		link.href = "data:text/csv," + encodeURIComponent(csv);
		link.download = "foodItems.csv";
		link.click();
	}

	function checkCSVHeader(header: unknown): boolean {
		const headerArray = header as string[];
		return (
			headerArray.includes("name") &&
			headerArray.includes("description") &&
			headerArray.includes("type") &&
			headerArray.includes("category")
		);
	}

	async function uploadFoodCsv() {
		const csvFile = csvInputRef.current!.files![0];
		Papa.parse(csvFile, {
			complete: async function (results) {
				var data = results.data;
				const foodItems: Omit<IFoodItem, "id">[] = [];
				if (checkCSVHeader(data.at(0)) && Array.isArray(data)) {
					var i;
					for (i = 1; i < data.length; i++) {
						const row = data[i];
						foodItems.push({
							name: row[data[0].indexOf("name")],
							type: row[data[0].indexOf("type")],
							description: row[data[0].indexOf("description")],
							category: row[data[0].indexOf("category")],
						});
					}
					const response = await uploadMultipleFood(foodItems);
					fetchItems();
				}
			},
		});
	}

	return (
		<div className="csv-option-container">
			<div className="button-container">
				<button
					className="csv-button"
					onClick={() => csvInputRef.current!.click()}
				>
					Importieren
				</button>
				<input
					type="file"
					style={{ display: "none" }}
					ref={csvInputRef}
					accept={
						".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					}
					onChange={uploadFoodCsv}
				/>
				<button
					className="csv-button"
					onClick={downloadFoodCSV}
				>
					Exportieren
				</button>
			</div>
		</div>
	);
}
export default FileOptions;
