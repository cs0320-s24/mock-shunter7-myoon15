import { Dispatch, SetStateAction, useEffect } from "react";
import "../../styles/history.css";

type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

interface HistoryProps {
  history: historyList;
  setHistory: Dispatch<SetStateAction<historyList>>;
  mode: string;
}
/**
 * We toggle between the type of output for History depending on which
 * mode we are in. If in verbose mode, the outputs will be labeled:
 * "vcommand+i" and "vtable+i," or "voutput+i," where i is command index.
 * This way we can check whether the output is brief or verbose
 */
export function History(props: HistoryProps) {
  useEffect(() => {}, [props.history]);

  return (
    <div aria-label="History" className="history-container">
      {props.mode === "verbose"
        ? props.history.map((elem, i) =>
            Array.isArray(elem[1]) ? (
              <div key={i} className="verbose-output">
                <p aria-label={"vcommand" + i} className="command-output">
                  {elem[0]}
                </p>
                <table
                  aria-label={"vtable" + i}
                  className="verbose-array-output"
                >
                  <tbody>
                    {elem[1].map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div key={i} className="verbose-output">
                <p aria-label={"vcommand" + i} className="command-output">
                  {elem[0]}
                </p>
                <p aria-label={"voutput" + i} className="verbose-text-output">
                  {elem[1]}
                </p>
              </div>
            )
          )
        : props.history.map((elem, i) =>
            Array.isArray(elem[1]) ? (
              <div key={i} className="brief-output">
                <table aria-label={"btable" + i} className="brief-array-output">
                  <tbody>
                    {elem[1].map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div key={i} className="brief-output">
                <p aria-label={"boutput" + i} className="brief-text-output">
                  {elem[1]}
                </p>
              </div>
            )
          )}
    </div>
  );
}

export default History;
