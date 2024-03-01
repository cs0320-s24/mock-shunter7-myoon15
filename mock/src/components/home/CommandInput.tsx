import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { jsonMap, searchMap } from "../../mock_data/mockedJson";
import "../../styles/command_input.css";

let currentCSV: string[][] | null = null;
type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

export interface REPLFunction {
  (args: Array<string>): string | string[][];
}
/**
 * This class handles the REPL functionality, where it takes and processes a command.
 * It handles load, view, search, and toggling between modes. To add to history, we
 * use a custom type, commandOutputTuple, where the first elt is a string that
 * represents the command as a string, and the second elt is either a string (output)
 * or a 2D array of strings that represent a table
 */
class REPLFunctions {
  private static registry: Record<
    string,
    (args: Array<string>, command: string) => string | string[][]
  > = {};

  public static processCommand(
    commandName: string,
    commandFunction: (
      args: Array<string>,
      command: string
    ) => string | string[][]
  ): void {
    REPLFunctions.registry[commandName] = commandFunction;
  }

  public static runCommand(command: string): string | string[][] {
    const [commandName, ...args] = command.split(" ");
    const commandFunction = REPLFunctions.registry[commandName];
    if (commandFunction) {
      return commandFunction(args, command);
    }
    return "Invalid: Please enter a valid command (basic commands: load_file, view, search, mode)";
  }
}

REPLFunctions.processCommand("load_file", (args): string | string[][] => {
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
});

REPLFunctions.processCommand("view", (args): string | string[][] => {
  if (args.length > 0) {
    return "Invalid: view should have no argruments (example: view)";
  } else if (currentCSV != null) {
    return currentCSV;
  } else {
    return "Invalid: No loaded csv file";
  }
});

REPLFunctions.processCommand("search", (args, command): string | string[][] => {
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
});

REPLFunctions.processCommand("mode", (args): string | string[][] => {
  if (args.length > 0) {
    return "Invalid: mode should have no arguments (example: mode)";
  }
  return "switch_mode";
});

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
    let commandOutput = REPLFunctions.runCommand(command);

    if (commandOutput === "switch_mode") {
      props.setMode((prevMode) => (prevMode === "brief" ? "verbose" : "brief"));
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
