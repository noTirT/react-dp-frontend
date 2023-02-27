import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import {
	deleteFoodItem as deleteFoodItemAPI,
	getAllDiettypes,
	getAllFoodItems,
	getAllFootCategories,
	logout,
} from "./api";
import { BackendResponse } from "./api/types";
import "./App.scss";
import AuthForm from "./components/Auth/AuthForm";
import FileOptions from "./components/FileOptions/FileOptions";
import FoodItemsTable from "./components/FoodItemsTable/FoodItemsTable";
import FormInputs from "./components/FormInputs/FormInputs";
import PlanModal from "./components/PlanModal/PlanModal";
import { IDiettype, IFoodCategory, IFoodItem, SELECTION } from "./types";
import { getCookie } from "./util";

function App() {
	const [editItem, setEditItem] = useState<IFoodItem>();
	const [categories, setCategories] = useState<IFoodCategory[]>([] as IFoodCategory[]);
	const [dietTypes, setDietTypes] = useState<IDiettype[]>([] as IDiettype[]);
	const [allFoodItems, setAllFoodItems] = useState<IFoodItem[]>([] as IFoodItem[]);
	const [showPlan, setShowPlan] = useState<boolean>(false);
	const [loggedIn, setLoggedIn] = useState<boolean>(document.cookie.includes("AuthToken"));
	const [loading, setLoading] = useState<boolean>(false);

	const [formSelection, setFormSelection] = useState<SELECTION>("CREATE");

	async function loadValues() {
		setLoading(true);
		const response = await Promise.allSettled([getAllFootCategories(), getAllDiettypes(), getAllFoodItems()]);
		handleDataResponse(response);
		setLoading(false);
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
		if (document.cookie.includes("AuthToken")) loadValues();
	}, [loggedIn]);

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

	async function logOut() {
		await logout(getCookie("AuthToken")!);
		document.cookie = "AuthToken=; Max-Age=-99999";
		setLoggedIn(false);
	}

	return (
		<>
			{loggedIn && !loading ? (
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
					<div
						className="logout-container"
						onClick={logOut}
					>
						<FiLogOut
							size={40}
							color={"white"}
						/>
					</div>
				</div>
			) : (
				<AuthForm setLoggedIn={setLoggedIn} />
			)}
		</>
	);
}

export default App;
