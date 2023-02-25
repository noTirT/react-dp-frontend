import { IFoodItem } from "../../types";
import { getDay } from "../../util";
import "./MealCard.scss";

interface Props {
	meal: IFoodItem;
	index: number;
}

export default function MealCard({ meal, index }: Props) {
	return (
		<div className="meal-card-container">
			<h2>{getDay(index)}</h2>
			<p>{meal.name}</p>
		</div>
	);
}
