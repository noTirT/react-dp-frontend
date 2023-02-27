import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface Props {
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function AuthForm({ setLoggedIn }: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const [register, setRegister] = useState<boolean>(false);

	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
			<div
				className="tab-container"
				style={{ opacity: loading ? ".75" : "1" }}
			>
				<div className="btn-container">
					<a
						className={`btn ${register && "selected"}`}
						onClick={() => !loading && setRegister(true)}
						style={{ pointerEvents: loading ? "none" : "auto" }}
					>
						Registrieren
					</a>
					<a
						className={`btn ${!register && "selected"}`}
						onClick={() => {
							if (loading) return;
							setRegister(false);
						}}
						style={{ pointerEvents: loading ? "none" : "auto" }}
					>
						Login
					</a>
				</div>
				<div className="content">
					{register ? (
						<RegisterForm
							loading={loading}
							setLoading={setLoading}
							setLoggedIn={setLoggedIn}
						/>
					) : (
						<LoginForm
							loading={loading}
							setLoading={setLoading}
							setLoggedIn={setLoggedIn}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default AuthForm;
