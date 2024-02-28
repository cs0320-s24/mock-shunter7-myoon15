// interface applicationProps {
//     isLoggedIn: boolean;
// }
import { useState } from "react";
import { CommandInput } from "./CommandInput";
import { History } from "./History";
import { View } from "./View";

type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

export default function Home() {
    const [history, setHistory] = useState<historyList>([]);
    const [mode, setMode] = useState<string>("brief");

    return (
        <div className="home">

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

// export default Home;
