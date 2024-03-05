import { Dispatch, useState, SetStateAction } from "react";
import { CommandInput } from "./CommandInput";
import { History } from "./History";

type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

interface homeProps {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export default function Home(props: homeProps) {
    const [history, setHistory] = useState<historyList>([]);
    const [mode, setMode] = useState<string>("brief");

    return (
        <div className="home">
            <nav className="nav-bar">
                <p className="logo">MOCK</p>
                <button type="submit" className="logout-btn" onClick={() => props.setIsLoggedIn(false)}>Logout</button>
            </nav>

            <CommandInput
                history={history}
                setHistory={setHistory}
                mode={mode}
                setMode={setMode}
            />
            <hr></hr>

            <History history={history} setHistory={setHistory} mode={mode}/>
        </div>
    );
}