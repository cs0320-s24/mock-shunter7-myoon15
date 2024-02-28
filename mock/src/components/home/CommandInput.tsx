import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { jsonMap, searchMap } from "../../mock_data/mockedJson";

let currentCSV: string[][] | null = null;
type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

export interface REPLFunction {
    (args: Array<string>): string | string[][];
}

export class REPLFunctions {
    static processCommand(command: string): string | string[][] {
        const splitCommand = command.split(" ");
        const args = splitCommand.slice(1);
        switch (splitCommand[0]) {
            case "load_file":
                return this.loadCSV(args);
            case "view":
                return this.viewCSV(args);
            case "search":
                return this.searchCSV(args, command);
            case "mode":
                return "mode";
        }

        return "Please enter a valid command";
    }

    static loadCSV(args: Array<string>): string {
        if (args.length != 1) {
            return "Invalid args: load_file should have two arguments (example: load_file <filepath>)";
        }
        const filePath = args[0];

        const csv = jsonMap.get(filePath);
        if (csv) {
            currentCSV = csv;
            return `The file '${filePath}' was successfully loaded`;
        } else {
            return `The file '${filePath}' not found`;
        }
    }

    static viewCSV(args: Array<string>): string | string[][] {
        if (args.length > 0) {
            return "Invalid args: view should have no argruments (example: view)";
        } else if (currentCSV != null) {
            return currentCSV;
        } else {
            return `No loaded csv file`;
        }
    }

    static searchCSV(
        args: Array<string>,
        command: string
    ): string | string[][] {
        if (!currentCSV) {
            return "No loaded csv file";
        } else if (args.length != 2) {
            return "Invalid args: search should have two arguments (example: search <value> <column>)";
        }

        const results = searchMap.get(command.toLowerCase());

        if (results) {
            return results;
        } else {
            return `No results for '${args[0]} ${args[1]}'`;
        }
    }
}

interface CommandInputProps {
    history: historyList;
    setHistory: Dispatch<SetStateAction<historyList>>;
    mode: string;
    setMode: Dispatch<SetStateAction<string>>;
}

export function CommandInput(props: CommandInputProps) {
    const [command, setCommand] = useState<string>("");
    const [error, setError] = useState<string | string[][]>("");

    const handleSubmit = () => {
        let commandOutput = REPLFunctions.processCommand(command);

        if (command === "") {
            setError(commandOutput);
            setCommand("");
            return;
        } else if (commandOutput === "mode") {
            if (props.mode === "brief") {
                commandOutput = "Mode switched to verbose";
                props.setMode("verbose");
            } else {
                commandOutput = "Mode switched to brief";
                props.setMode("brief");
            }
            setError("");
        }

        setError("");
        const newItem: commandOutputTuple = [command, commandOutput];

        console.log(newItem);
        props.setHistory((tempList) => [...tempList, newItem]);

        console.log("history: ", props.history);
        setCommand("");
    };

    return (
        <div className="history">
            <div className="command-input">
                <input
                    value={command}
                    type="text"
                    onChange={(e) => setCommand(e.target.value)}
                />
                <p>{error}</p>
                <button type="submit" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default CommandInput;
