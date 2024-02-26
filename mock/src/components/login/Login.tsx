import { useState, Dispatch, SetStateAction } from "react";
import { userMap } from "../../mock_data/mockedJson";

interface loginProps {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export function Login(props: loginProps) {
    const [username, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        // console.log(e);
        if (userMap.get(username) == password) {
            props.setIsLoggedIn(true);
        }
    };

    return (
        <div className="login-container">
            <header>
                <h1>Mock</h1>
            </header>
            <h2>Login</h2>
            <form action="">
                <label htmlFor="text">Username: </label>
                <input
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                />

                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    aria-label="Submit"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Login;
