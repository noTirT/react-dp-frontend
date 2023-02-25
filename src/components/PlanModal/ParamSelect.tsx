import { capitalizeString } from "../../util";

interface Props {
	data: { id: string; name: string }[];
	selectedList: string[];
	setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
}

function ParamSelect({ data, selectedList, setSelectedList }: Props) {
	const ID = window.crypto.randomUUID();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		switchValue(e.target.value);
	}

	function switchValue(value: string) {
		if (!selectedList.includes(value)) {
			setSelectedList((prev) => [...prev, value]);
		} else {
			setSelectedList((prev) => prev.filter((item) => item !== value));
		}
	}

	return (
		<details
			className="option-details"
			open
		>
			<summary role={"button"}>
				<a className="open-option-btn">Kategorie</a>
			</summary>
			<ul>
				{data.map((item, index) => (
					<li key={`${ID}-${index}`}>
						<div className="option-box">
							<input
								type={"checkbox"}
								id={ID}
								onChange={handleChange}
								value={item.name}
								checked={selectedList.includes(item.name)}
								className="option-checkbox"
							/>
							<span className="check"></span>
							<label
								htmlFor={`${ID}-${index}`}
								onClick={() => switchValue(item.name)}
							>
								{capitalizeString(item.name)}
							</label>
						</div>
					</li>
				))}
			</ul>
		</details>
	);
}
export default ParamSelect;
