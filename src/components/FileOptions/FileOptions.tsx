import { useRef } from "react";
import "./FileOptions.scss";

function FileOptions() {
	const csvInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="csv-option-container">
			<div className="button-container">
				<button
					className="csv-button"
					onClick={() => csvInputRef.current!.click()}
				>
					Datei importieren
				</button>
				<input
					type="file"
					style={{ display: "none" }}
					ref={csvInputRef}
					accept={
						".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					}
				/>
				<button className="csv-button">CSV exportieren</button>
			</div>
		</div>
	);
}
export default FileOptions;
