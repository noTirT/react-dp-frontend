import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createFoodItem, updateFoodItemById } from "../../api";
import { IDiettype, IFoodCategory, IFoodItem, SELECTION } from "../../types";
import { capitalizeString } from "../../util";
import "./FormInputs.scss";

interface Props {
	selection: SELECTION;
	setSelection: React.Dispatch<React.SetStateAction<SELECTION>>;
	categories: IFoodCategory[];
	dietTypes: IDiettype[];
	editItem: IFoodItem | undefined;
	cancelEdit: () => void;
	fetchValues: () => void;
}

export default function FormInputs({
	cancelEdit,
	fetchValues,
	editItem,
	selection,
	setSelection,
	categories,
	dietTypes,
}: Props) {
	const [currentValues, setCurrentValues] = useState<Omit<IFoodItem, "id"> | undefined>(() => {
		if (editItem) {
			return { ...editItem };
		} else {
			if (selection === "CREATE")
				return { name: "", category: categories[0].name, type: dietTypes[0].name, description: "" };
		}
		return undefined;
	});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (editItem !== undefined) {
			if (selection === "EDIT") {
				setCurrentValues({ ...editItem });
			}
		}
	}, [editItem]);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (currentValues) {
			if (selection === "CREATE") {
				setLoading(true);
				const response = await createFoodItem(currentValues);
				resetForm();
				fetchValues();
				setLoading(false);
			} else {
				if (editItem) {
					setLoading(true);
					const response = await updateFoodItemById(editItem.id, currentValues);
					cancelEdit();
					clickCreate();
					fetchValues();
					setLoading(false);
				}
			}
		}
	}

	function clickCreate() {
		setSelection("CREATE");
		cancelEdit();
		setCurrentValues({ name: "", category: categories[0].name, type: dietTypes[0].name, description: "" });
	}

	function handleReset(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		resetForm();
	}

	function resetForm() {
		if (editItem) setCurrentValues({ ...editItem });
		else setCurrentValues({ name: "", category: categories[0].name, type: dietTypes[0].name, description: "" });
	}

	function handleChange(e: ChangeEvent<any>) {
		setCurrentValues((curr) => curr && { ...curr, [e.target.name]: e.target.value });
	}

	function checkValues() {
		return currentValues === undefined || currentValues.name === "";
	}

	function handleCancel() {
		clickCreate();
	}

	return (
		<>
			<div
				className="tab-container"
				style={{ opacity: loading ? ".75" : "1" }}
			>
				<div className="btn-container">
					<a
						className={`btn ${selection === "CREATE" && "selected"}`}
						onClick={clickCreate}
						style={{ pointerEvents: loading ? "none" : "auto" }}
					>
						Neu
					</a>
					<a
						className={`btn ${selection === "EDIT" && "selected"}`}
						onClick={() => {
							setSelection("EDIT");
							cancelEdit();
						}}
						style={{ pointerEvents: loading ? "none" : "auto" }}
					>
						Bearbeiten
					</a>
				</div>
				<div className="content">
					<form
						onSubmit={handleSubmit}
						onReset={handleReset}
					>
						<fieldset
							disabled={(selection === "EDIT" && editItem === undefined) || loading}
							className="form-fieldset"
						>
							<div className="input-container">
								<label htmlFor="name-input">Gerichtname</label>
								<br />
								<input
									type="text"
									id="name-input"
									className="name-input"
									name="name"
									onChange={handleChange}
									value={currentValues?.name}
								/>
								<br />
								<label htmlFor="category-input">Kategorie wählen</label>
								<br />
								<select
									id="category-input"
									name="category"
									className="select-input"
									onChange={handleChange}
									value={currentValues?.category}
								>
									{categories.map((category, index) => (
										<option
											key={`category-option-${index}`}
											value={category.name}
										>
											{capitalizeString(category.name)}
										</option>
									))}
								</select>
								<br />
								<label htmlFor="type-input">Typ wählen</label>
								<br />
								<select
									name="type"
									id="type-input"
									className="select-input"
									onChange={handleChange}
									value={currentValues?.type}
								>
									{dietTypes.map((type, index) => (
										<option
											key={`diettype-option-${index}`}
											value={type.name}
										>
											{capitalizeString(type.name)}
										</option>
									))}
								</select>
								<br />
								<label htmlFor="description-input">Beschreibung</label>
								<br />
								<textarea
									name="description"
									id="description-input"
									className="description-input"
									onChange={handleChange}
									value={currentValues?.description}
								>
									{currentValues?.description}
								</textarea>
								<br />
								<div style={{ display: "flex" }}>
									<button
										className="form-button"
										type="submit"
										disabled={checkValues()}
									>
										Änderungen anwenden
									</button>
									<button
										className="form-button"
										type="reset"
									>
										Zurücksetzen
									</button>
									<button
										className="form-button"
										onClick={selection === "EDIT" ? handleCancel : resetForm}
										type="button"
									>
										Abbrechen
									</button>
								</div>
								{!editItem && selection === "EDIT" && (
									<div className="input-tipp-container">
										<p style={{ color: "red" }}>Gericht aus Tabelle zum Bearbeiten auswählen</p>
									</div>
								)}
							</div>
							{loading && (
								<div className="loading-container">
									<div className="loading-element">
										<div className="loading-point"></div>
										<div className="loading-point"></div>
										<div className="loading-point"></div>
										<div className="loading-point"></div>
									</div>
								</div>
							)}
						</fieldset>
					</form>
				</div>
			</div>
		</>
	);
}
