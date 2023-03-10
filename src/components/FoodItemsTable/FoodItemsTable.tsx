import { useEffect, useState } from "react";
import { FaRegFilePdf, FaTrash } from "react-icons/fa";
import { IFoodItem } from "../../types";
import { capitalizeString } from "../../util";
import "./FoodItemsTable.scss";

interface Props {
	foodItems: IFoodItem[];
	setEditItem: (foodItem: IFoodItem) => void;
	deleteItem: (id: string) => void;
	resetFoodItems: () => void;
	disabled: boolean;
}

const UPARROW = "\t" + String.fromCharCode(8593);
const DOWNARROW = "\t" + String.fromCharCode(8595);

function FoodItemsTable({ resetFoodItems, foodItems, setEditItem, deleteItem, disabled }: Props) {
	const [buttonHover, setButtonHover] = useState<boolean>(false);
	const [sortingDetails, setSortingDetails] = useState<{ key: keyof IFoodItem; reversed: boolean }>();
	const [localFood, setLocalFood] = useState<IFoodItem[]>([...foodItems]);

	useEffect(() => {
		setLocalFood([...foodItems]);
	}, [foodItems]);

	function handleSortingClick(key: keyof IFoodItem) {
		if (disabled) return;
		let reversed = undefined;

		if (sortingDetails === undefined) {
			reversed = false;
		} else {
			if (sortingDetails.key === key) {
				reversed = !sortingDetails.reversed;
			} else {
				reversed = false;
			}
		}

		setSortingDetails({ key, reversed });
		sortFoodItems(key, reversed);
	}

	function sortFoodItems(key: keyof IFoodItem, reversed: boolean) {
		console.log(reversed);
		const copy = [...localFood];
		copy.sort((a, b) => {
			return reversed ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
		});
		setLocalFood(copy);
	}

	function getArrow(key: keyof IFoodItem) {
		return sortingDetails === undefined
			? ""
			: sortingDetails?.key === key
			? !sortingDetails.reversed
				? UPARROW
				: DOWNARROW
			: "";
	}

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		setLocalFood(
			foodItems.filter((item) => item.name.toLocaleUpperCase().startsWith(e.target.value.toLocaleUpperCase()))
		);
	}

	return (
		<div className={"foodItemContainer"}>
			<h2>Alle Gerichte</h2>
			<div style={{ display: "flex" }}>
				<input
					type="text"
					className="search-bar"
					placeholder="Suchen..."
					onChange={handleSearch}
				/>
				<i className="fa fa-search search-icon" />
			</div>
			<ul className={"foodItemTable"}>
				<li className={"tableHeader"}>
					<div
						className="col col-1"
						onClick={() => handleSortingClick("name")}
					>
						Gerichtname
						{getArrow("name")}
					</div>
					<div
						className="col col-2"
						onClick={() => handleSortingClick("type")}
					>
						Typ
						{getArrow("type")}
					</div>
					<div
						className="col col-3"
						onClick={() => handleSortingClick("category")}
					>
						Kategorie
						{getArrow("category")}
					</div>
					<div className="col col-4">Optionen</div>
				</li>
			</ul>
			<ul
				className={"foodItemTable"}
				style={{ height: "63vh" }}
			>
				{localFood.length > 0 &&
					localFood.map((item, index) => (
						<li
							className="tableRow"
							key={`tableRow_${index}`}
							onClick={() => !buttonHover && !disabled && setEditItem(item)}
						>
							<div className="col col-1">{item.name}</div>
							<div className="col col-2">{capitalizeString(item.type)}</div>
							<div className="col col-3">{capitalizeString(item.category)}</div>
							<div className="col col-4">
								<div className="table-option-container">
									<FaTrash
										onMouseOver={() => setButtonHover(true)}
										onMouseLeave={() => setButtonHover(false)}
										onClick={() => !disabled && deleteItem(item.id)}
										className={"deleteIcon"}
										size={30}
									/>
									<a
										href={`${import.meta.env.VITE_BASE_URL}static/${item.description}.pdf`}
										target="blank"
										style={{ pointerEvents: disabled ? "none" : "all" }}
									>
										<FaRegFilePdf
											onMouseOver={() => setButtonHover(true)}
											onMouseLeave={() => setButtonHover(false)}
											className={"recipe-icon"}
											size={30}
										/>
									</a>
								</div>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}
export default FoodItemsTable;
