import { useState } from "react";
import { generatePlan } from "../../api";
import { IDiettype, IFoodCategory, IFoodItem, PlanParameters } from "../../types";
import MealCard from "./MealCard";
import ParamSelect from "./ParamSelect";
import "./PlanModal.scss";

interface Props {
	open: boolean;
	close: () => void;
	categories: IFoodCategory[];
	types: IDiettype[];
}

function PlanModal({ open, close, categories, types }: Props) {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [mealPlan, setMealPlan] = useState<IFoodItem[]>([]);

	async function handleGenerate() {
		const planParams: PlanParameters = {
			...(selectedCategories.length > 0 && { categories: selectedCategories }),
			...(selectedTypes.length > 0 && { types: selectedTypes }),
		};
		if ("categories" in planParams || "types" in planParams) {
			setLoading(true);
			const response = await generatePlan(planParams);
			setMealPlan(response.data);

			setSelectedCategories([]);
			setSelectedTypes([]);

			setLoading(false);
		} else {
			setMealPlan([]);
		}
	}

	function closeModal() {
		close();
		setMealPlan([]);
		setSelectedCategories([]);
		setSelectedTypes([]);
	}

	return (
		<dialog
			open={open}
			className="plan-modal"
		>
			<div className="modal-content">
				<form className="parameter-form">
					<fieldset
						className="plan-generator-fieldset"
						disabled={loading}
					>
						<div className="control-container">
							<div className="option-container">
								<ParamSelect
									data={categories}
									selectedList={selectedCategories}
									setSelectedList={setSelectedCategories}
								/>
							</div>
							<div className="option-container">
								<ParamSelect
									data={types}
									selectedList={selectedTypes}
									setSelectedList={setSelectedTypes}
								/>
							</div>
							<div>
								<button
									className="generate-btn"
									onClick={handleGenerate}
									type="button"
								>
									Plan generieren
								</button>
							</div>
						</div>
					</fieldset>
				</form>
				<div className="plan-container">
					{mealPlan.length > 0 &&
						mealPlan.map((meal, index) => (
							<MealCard
								key={`meal-card-${index}`}
								meal={meal}
								index={index}
							/>
						))}
				</div>
				<a
					className="close-button"
					onClick={closeModal}
				></a>
			</div>
		</dialog>
	);
}
export default PlanModal;
