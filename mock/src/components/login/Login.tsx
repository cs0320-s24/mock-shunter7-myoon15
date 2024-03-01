import { useState, Dispatch, SetStateAction } from "react";
import { userMap } from "../../mock_data/mockedJson";
import "../../styles/login.css";

interface loginProps {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export function Login(props: loginProps) {
    const [username, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [errorClass, setErrorClass] = useState<string>("hidden");

    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        if (userMap.get(username) == password) {
            props.setIsLoggedIn(true);
        }
        else {
            setError("Username or password is invalid!")
            setErrorClass("not-hidden");
        }
    };

    return (
        <main className="login-container">
            <header className="login-header">
                <h1>Mock</h1>
            </header>
            <section className="form-container">
                <form className="login-form">
                    <div className="form-header">
                        <h6>Login</h6>
                    </div>

                    <div className="label-input-pair">
                        <label htmlFor="text" className="field-labels">
                            Username:{" "}
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                            aria-label="Username Input"
                            className="field-inputs"
                            required
                        />
                    </div>

                    <div className="label-input-pair">
                        <label htmlFor="password" className="field-labels">
                            Password:{" "}
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Password Input"
                            className="field-inputs"
                            required
                        />
                    </div>

                    <div className={errorClass}>
                        <p className="form-error">{error}</p>
                    </div>

                    <div className="btn-div">
                        <button
                            aria-label="Login Button"
                            type="submit"
                            onClick={handleSubmit}
                            className="form-button"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default Login;
