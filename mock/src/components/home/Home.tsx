// interface applicationProps {
//     isLoggedIn: boolean;
// }
import { useState } from "react";
import { CommandInput } from "./CommandInput";
import { History } from "./History";
import { View } from "./View";

type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

export function Home() {
    const [history, setHistory] = useState<historyList>([]);
    // type HistoryItem = {
    //     command: string;
    //     output: string[][] | string;
    // };
    
    // // Using a Map to store history items
    // type HistoryMap = Map<number, HistoryItem>;
    
    // // In the React component state
    // const [history, setHistory] = useState<HistoryMap>(new Map());

    /*

    output = CommandInput.getOutput(commandString)

    getOutput{
        return function load...

    }

    */
    return (
        <div className="home">
            <CommandInput history={history} setHistory={setHistory}/>
            <View />
            <History />
        </div>
    );
}

export default Home;
