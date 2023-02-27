import { useState } from "react";
import { login, register } from "../../api";

interface Props {
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegisterForm({ loading, setLoading, setLoggedIn }: Props) {
	const [email, setEmail] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			setLoading(true);
			await register(email, username, password, confirmPassword);
			const response = await login(username, password);
			document.cookie = `AuthToken=${response.data.authToken};`;
			setLoggedIn(true);
			setLoading(false);
		} catch (err) {
			console.log("something went wrong");
		}
	}

	function confirmBorder() {
		if (password !== "") {
			if (password === confirmPassword) return "2px solid green";
			else return "2px solid red";
		}
	}

	function confirmAnimation() {
		if (password !== "") {
			if (password !== confirmPassword) return "shake 300ms";
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<fieldset
				disabled={loading}
				className="form-fieldset"
			>
				<div className="input-container">
					<label htmlFor="email-input">Email</label>
					<br />
					<input
						type="text"
						name="email"
						id="email-input"
						className="name-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
					/>
					<br />
					<label htmlFor="name-input">Username</label>
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
					<br />
					<label htmlFor="confirm-password-input">Passwort wiederholen</label>
					<br />
					<input
						type="password"
						name="confirm-password"
						id="confirm-password-input"
						className="name-input"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						style={{
							border: confirmBorder(),
							animation: confirmAnimation(),
						}}
					/>
					<div style={{ display: "flex" }}>
						<button
							className="form-button"
							type="submit"
							disabled={
								email === "" || username === "" || password.length < 8 || confirmPassword !== password
							}
						>
							Registrieren
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
export default RegisterForm;
