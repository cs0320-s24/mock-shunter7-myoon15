// interface applicationProps {
//     isLoggedIn: boolean;
// }
import { useState } from "react";
import { CommandInput } from "./CommandInput";
import { History } from "./History";
import { View } from "./View";

type commandOutputTuple = [string, string[][]?];
type historyList = commandOutputTuple[];

export function Home() {
    const [history, setHistory] = useState<historyList>([]);
    

    return (
        <div className="home">
            <CommandInput history={history} setHistory={setHistory}/>
            <View />
            <History />
        </div>
    );
}

export default Home;
