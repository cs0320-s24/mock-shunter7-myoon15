import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { jsonMap, searchMap } from "../../mock_data/mockedJson";
import "../../styles/command_input.css";

let currentCSV: string[][] | null = null;

/**
 * Custom type to fill our historyList with tuples of commandName
 * to either a 2d string array or string message.
 */
type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when 
 * the command is done executing.
 * 
 * The arguments passed in the input (which need not be named "args") should 
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
    (args: Array<string>, command: string): string | string[][];
}

/**
 * This class handles the REPL functionality, where it takes and processes a command.
 * It handles load, view, search, and toggling between modes. To add to history, we
 * use a custom type, commandOutputTuple, where the first elt is a string that
 * represents the command as a string, and the second elt is either a string (output)
 * or a 2D array of strings that represent a table
 */
class REPLFunctions {
    /**
     * Record where all the commands are stored and can add more commands.
     * Maps the commandName to the commandFunction that should be in the 
     * format of REPLFunction.
     */
    private static registry: Record<string, REPLFunction> = {};

    /**
     * Function that adds a command into the registry.
     * 
     * @param commandName the name of the command
     * @param commandFunction the function associated with the command
     */
    public static processCommand(commandName: string, commandFunction: REPLFunction): void {
        REPLFunctions.registry[commandName] = commandFunction;
    }

    /**
     * Function that runs the function associated with the commandName.
     * 
     * @param command the command from the input
     * @returns the correct function or an error string
     */
    public static runCommand(command: string): string | string[][] {
        const [commandName, ...args] = command.split(" ");
        const commandFunction = REPLFunctions.registry[commandName];
        if (commandFunction) {
            return commandFunction(args, command);
        }
        return "Invalid: Please enter a valid command (basic commands: load_file, view, search, mode)";
    }
}

/**
 * Function for the command 'load_file' that returns a string representing if the
 * file was loaded successfully. Gives an invalid error if not.
 *
 * @param args the arguments from the command
 * @returns a successful string or a error string
 */
const loadFileCommand: REPLFunction = (args) => {
    if (args.length != 1) {
        return "Invalid: load_file should have one argument (example: load_file <filepath>)";
    }
    const filePath = args[0];

    const csv = jsonMap.get(filePath);
    if (csv) {
        currentCSV = csv;
        return `The file '${filePath}' was successfully loaded`;
    } else {
        return `Invalid: The file '${filePath}' not found`;
    }
};
REPLFunctions.processCommand("load_file", loadFileCommand);

/**
 * Function for the command 'view' that returns the currentCSV as a string 2d array.
 * If no file loaded or invalid number of args, it returns an error string.
 *
 * @param args the arguments from the command
 * @returns the currentCSV or error string
 */
const viewCommand: REPLFunction = (args) => {
    if (args.length > 0) {
        return "Invalid: view should have no argruments (example: view)";
    } else if (currentCSV != null) {
        return currentCSV;
    } else {
        return "Invalid: No loaded csv file";
    }
};
REPLFunctions.processCommand("view", viewCommand);

/**
 * Function for the command 'search' that returns the search results from currentCSV given the args
 * <value to search> and <column to search> as a string 2d array.
 * If no file loaded or invalid number of args, it returns an error string.
 *
 * @param args the arguments from the command
 * @returns the search results rows or error string
 */
const searchCommand: REPLFunction = (args, command) => {
    if (!currentCSV) {
        return "Invalid: No loaded csv file";
    } else if (args.length != 2) {
        return "Invalid: search should have two arguments (example: search <value> <column>)";
    }

    const results = searchMap.get(command.toLowerCase());

    if (results) {
        return results;
    } else {
        return `No results for '${args[0]} ${args[1]}'`;
    }
};
REPLFunctions.processCommand("search", searchCommand);

/**
 * Function for the command 'mode' that returns a string that represents mode needs to be switched.
 * If invalid number of args, it returns an error string.
 *
 * @param args the arguments from the command
 * @returns the string "switch_mode" or error string
 */
const modeCommand: REPLFunction = (args) => {
    if (args.length > 0) {
        return "Invalid: mode should have no arguments (example: mode)";
    }
    return "switch_mode";
};
REPLFunctions.processCommand("mode", modeCommand);


/**
 * Props to be used in CommandInput function. These props are for
 * setting the history and also setting the mode.
 */
interface CommandInputProps {
    history: historyList;
    setHistory: Dispatch<SetStateAction<historyList>>;
    mode: string;
    setMode: Dispatch<SetStateAction<string>>;
}

/**
 * This is our main logic class for CommandInput, which handles the commands
 * being put in as the input and runs the right command based on the input.
 */
export function CommandInput(props: CommandInputProps) {
    const [command, setCommand] = useState<string>("");
    const [error, setError] = useState<string | string[][]>("");

    /**
     * Function for handling switching mode, setting the error message if needed,
     * and setting history when the command input is submitted. Triggered by clicking
     * 'Submit Button'.
     */
    const handleSubmit = () => {
        let commandOutput = REPLFunctions.runCommand(command);

        if (commandOutput === "switch_mode") {
            props.setMode((prevMode) =>
                prevMode === "brief" ? "verbose" : "brief"
            );
            commandOutput = `Mode switched to ${
                props.mode === "brief" ? "verbose" : "brief"
            }`;
            setError("");
        } else if (
            typeof commandOutput === "string" &&
            commandOutput.includes("Invalid")
        ) {
            setError(commandOutput);
            return;
        }

        const newItem: commandOutputTuple = [command, commandOutput];
        props.setHistory((tempList) => [...tempList, newItem]);

        setError("");
        setCommand("");
    };

    return (
        <div className="command-input-container">
            <div className="input-error-pair">
                <div>
                    <input
                        aria-label="Command Input"
                        value={command}
                        type="text"
                        onChange={(e) => setCommand(e.target.value)}
                        className="command-input"
                    />
                </div>

                <div>
                    <p className="command-error">{error}</p>
                </div>
            </div>

            <div className="btn-container">
                <button
                    aria-label="Submit Button"
                    type="submit"
                    onClick={handleSubmit}
                    className="submit-btn"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default CommandInput;
