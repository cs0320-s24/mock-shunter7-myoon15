import { Dispatch, SetStateAction, useState } from "react";
import { jsonMap } from "../../mock_data/mockedJson";

let currentCSV: string[][] | null = null;

type commandOutputTuple = [string, string[][] | string];
// type commandOutputTuple = string | string[][];

type historyList = commandOutputTuple[];

interface CommandInputProps {
    // key: map.size, val: 2d string array
    history: historyList;
    // history: string[] | string[][][];
    setHistory: Dispatch<SetStateAction<historyList>>;
    // setHistory: Dispatch<SetStateAction<string | string[][]>>;
}

// string output = CommandInput.REPLFunctions.getOutput(...)
// addtohistory(output)
export interface REPLFunction {
    (args: Array<string>): string | string[][];
}

export class REPLFunctions {
    static processCommand(command: string): string | string[][] {
        const splitCommand = command.split(" ");
        const args = splitCommand.slice(1);
        switch (splitCommand[0]) {
            case "load_file":
                // console.log("load file");
                return this.loadCSV(args);
                break;
            case "view":
                // console.log("view");
                return this.viewCSV();
                break;
            case "search":
                // console.log("search");
                // return this.searchCSV(args);
                break;
        }

        return "";
    }

    static loadCSV(args: Array<string>): string {
        const filePath = args[0];

        const csv = jsonMap.get(filePath);
        if (csv) {
            currentCSV = csv;
            return `Successfully loaded '${filePath}'`;
        } else {
            return `The file '${filePath}' not found`;
        }
    }

    static viewCSV(): string | string[][] {
        if (currentCSV != null) {
            return currentCSV;
        } else {
            return `No loaded csv file`;
        }
    }

    static searchCSV(args: Array<string>): string | string[][] {
        if (args.length > 2) {
            return "Invalid number of args: please put '+' wherever necessary (valid command: search Rhode+Island state)";
        } else if (args.length < 2) {
            return "Invalid number of args: valid command search <value> <column>";
        }

        return [[], []];
    }

    // static searchCSV(args: Array<string>):
}

export function CommandInput(props: CommandInputProps) {
    const [command, setCommand] = useState<string>("");
    const [output, setOutput] = useState<string[][]>([]);

    const handleSubmit = () => {
        const commandOutput = REPLFunctions.processCommand(command);
        // console.log(commandOutput);
        // console.log("hi");

        const newItem: commandOutputTuple = [
            command,
            commandOutput,
        ];
        props.setHistory([...props.history, newItem]);
        // const newItem: commandOutputTuple = [command, commandOutput];
        // const newItem = commandOutput;
        console.log(newItem);
        const tempList = props.history;
        tempList.push(newItem);
        props.setHistory(tempList);

        // props.setHistory([...props.history, commandOutput])

        console.log("history: ", props.history);
    };

    return (
        <div className="command-input">
            <input type="text" onChange={(e) => setCommand(e.target.value)} />
            <button type="submit" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}

export default CommandInput;
