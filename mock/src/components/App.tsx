import { useState } from "react";
import "../styles/App.css";
import Login from "./login/Login";
import Home from "./home/Home";

/**
 * This is the highest level component!
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return (
        <div className="App">
            {isLoggedIn ? (
                <Home />
            ) : (
                <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            )}
        </div>
    );
}

export default App;
