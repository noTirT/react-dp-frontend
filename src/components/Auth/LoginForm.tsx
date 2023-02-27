import { useState } from "react";
import { login } from "../../api";

interface Props {
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginForm({ loading, setLoading, setLoggedIn }: Props) {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		try {
			setLoading(true);
			const response = await login(username, password);
			document.cookie = `AuthToken=${response.data.authToken};`;
			setLoading(false);
			setLoggedIn(true);
		} catch (err) {
			console.log("Wrong credentials");
		}
	}
	async function asGuest() {
		setLoading(true);
		const response = await login("guest", "password");
		document.cookie = `AuthToken=${response.data.authToken};`;
		setLoading(false);
		setLoggedIn(true);
	}
	return (
		<form onSubmit={handleSubmit}>
			<fieldset
				disabled={loading}
				className="form-fieldset"
			>
				<div className="input-container">
					<label htmlFor="name-input">Username oder Email</label>
					<br />
					<input
						type="text"
						id="name-input"
						className="name-input"
						name="name"
						autoComplete={"off"}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<br />
					<label htmlFor="password-input">Passwort</label>
					<br />
					<input
						type="password"
						name="password"
						id="password-input"
						className="name-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div style={{ display: "flex" }}>
						<button
							className="form-button"
							type="submit"
							disabled={username === "" || password === ""}
						>
							Login
						</button>
						<button
							className="form-button"
							type="button"
							onClick={asGuest}
						>
							Als Gast fortfahren
						</button>
					</div>
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
	);
}
export default LoginForm;
