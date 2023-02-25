import { useEffect, useState } from "react";
import { getAllDiettypes, getAllFoodItems, getAllFootCategories, deleteFoodItem as deleteFoodItemAPI } from "./api";
import { IDiettype, IFoodCategory, IFoodItem, SELECTION } from "./types";
import "./App.scss";
import FoodItemsTable from "./components/FoodItemsTable/FoodItemsTable";
import { BackendResponse } from "./api/types";
import FormInputs from "./components/FormInputs/FormInputs";
import FileOptions from "./components/FileOptions/FileOptions";
import PlanModal from "./components/PlanModal/PlanModal";

function App() {
	const [editItem, setEditItem] = useState<IFoodItem>();
	const [categories, setCategories] = useState<IFoodCategory[]>([] as IFoodCategory[]);
	const [dietTypes, setDietTypes] = useState<IDiettype[]>([] as IDiettype[]);
	const [allFoodItems, setAllFoodItems] = useState<IFoodItem[]>([] as IFoodItem[]);
	const [showPlan, setShowPlan] = useState<boolean>(false);

	const [formSelection, setFormSelection] = useState<SELECTION>("CREATE");

	async function loadValues() {
		const response = await Promise.allSettled([getAllFootCategories(), getAllDiettypes(), getAllFoodItems()]);
		handleDataResponse(response);
	}

	function handleDataResponse(response: PromiseSettledResult<BackendResponse<any>>[]) {
		const [categories, dietTypes, foodItems] = response;

		if (categories.status === "fulfilled") {
			setCategories(categories.value.data);
		} else {
			console.log("Error while fetching categories");
		}
		if (dietTypes.status === "fulfilled") {
			setDietTypes(dietTypes.value.data);
		} else {
			console.log("Error while fetching diettypes");
		}
		if (foodItems.status === "fulfilled") {
			setAllFoodItems(foodItems.value.data);
		} else {
			console.log("Error while fetching fooditems");
		}
	}

	useEffect(() => {
		loadValues();
	}, []);

	function deleteFoodItem(id: string) {
		deleteFoodItemAPI(id);
		setAllFoodItems((prev) => prev.filter((item) => item.id !== id));
	}

	function cancelEdit() {
		setEditItem(undefined);
	}

	function updateEditItem(foodItem: IFoodItem | undefined) {
		setFormSelection("EDIT");
		setEditItem(foodItem);
	}

	async function resetFoodItems() {
		const response = await getAllFoodItems();
		setAllFoodItems(response.data);
	}

	return (
		<>
			<div className={"mainflex"}>
				<div
					className="table-container"
					style={{ opacity: showPlan ? ".5" : "1" }}
				>
					<FoodItemsTable
						foodItems={allFoodItems}
						setEditItem={updateEditItem}
						deleteItem={deleteFoodItem}
						resetFoodItems={resetFoodItems}
						disabled={showPlan}
					/>
				</div>
				<div
					className="editItemContainer"
					style={{ opacity: showPlan ? ".5" : "1" }}
				>
					{dietTypes.length > 0 && (
						<FormInputs
							selection={formSelection}
							setSelection={setFormSelection}
							editItem={editItem}
							categories={categories}
							dietTypes={dietTypes}
							cancelEdit={cancelEdit}
							fetchValues={loadValues}
							disabled={showPlan}
						/>
					)}
					<FileOptions
						fetchItems={loadValues}
						openPlanModal={() => setShowPlan(true)}
						disabled={showPlan}
					/>
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<PlanModal
						open={showPlan}
						close={() => setShowPlan(false)}
						categories={categories}
						types={dietTypes}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
