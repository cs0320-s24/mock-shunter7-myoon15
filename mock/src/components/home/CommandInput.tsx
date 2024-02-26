import { Dispatch, SetStateAction, useState } from "react";
import { jsonMap } from "../../mock_data/mockedJson";

type commandOutputTuple = [string, string[][]?];
type historyList = commandOutputTuple[];

interface CommandInputProps {
    // key: map.size, val: 2d string array
    history: historyList;
    setHistory: Dispatch<SetStateAction<historyList>>;
}

export function CommandInput(props: CommandInputProps) {
    const [command, setCommand] = useState<string>("");
    const [output, setOutput] = useState<string[][]>([]);


    const handleSubmit = () => {
        /* functionality: 
         *  use "command" to set output to the proper 2d array
            import mock_data and call "get" function with param command
         */

        if (command.startsWith("load_file") && jsonMap.size > 0){
            // const temp = jsonMap.get("key");
            // // const temp = [["hi", "hi"], ["bye", "bye"]];
            // setOutput(temp);
            // setOutput(jsonMap.get(command.split(" ").));
            // setOutput([[]]);
        }
        else if (command.startsWith("view")){

        }
        else if (command.startsWith("search")){

        }
        
        
        const newItem: commandOutputTuple = [command, output];
        const tempList = props.history;
        tempList.push(newItem);
        props.setHistory(tempList);

        console.log(props.history);
    };

    return (
        <div className="home">
            <input type="text" onChange={(e) => setCommand(e.target.value)} />
            <button type="button">Mode</button>
        </div>
    );
}

export default CommandInput;
