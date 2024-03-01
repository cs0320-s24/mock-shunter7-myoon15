import { Dispatch, useState, SetStateAction } from "react";
import { CommandInput } from "./CommandInput";
import { History } from "./History";
import "../../styles/home.css";

/**
 * Custom type to fill our historyList with tuples of commandName
 * to either a 2d string array or string message
 */
type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

/**
 * Props for the function Home. Includes the boolean
 * and the ability to set the boolean for isLoggedIn.
 */
interface homeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * This is our Home class where we toggle between the login page and Home
 * page depending on if you're logged in with correct credentials.
 */
export default function Home(props: homeProps) {
  const [history, setHistory] = useState<historyList>([]);
  const [mode, setMode] = useState<string>("brief");

  return (
    <div className="home-container">
      <nav className="nav-bar">
        <div>
          <h1 className="logo">MOCK</h1>
        </div>
        <div>
          <button
            type="submit"
            className="logout-btn"
            onClick={() => props.setIsLoggedIn(false)}
          >
            Logout
          </button>
        </div>
      </nav>

      <CommandInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
      />

      <History history={history} setHistory={setHistory} mode={mode} />
    </div>
  );
}
