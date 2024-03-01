import { Dispatch, SetStateAction, useEffect } from "react";
import "../../styles/history.css";

type commandOutputTuple = [string, string[][] | string];
type historyList = commandOutputTuple[];

interface HistoryProps {
    history: historyList;
    setHistory: Dispatch<SetStateAction<historyList>>;
    mode: string;
}

export function History(props: HistoryProps) {
    useEffect(() => {}, [props.history]);

    return (
        <div aria-label="History" className="history-container">
            {props.mode === "verbose"
                ? props.history.map((elem, i) =>
                      Array.isArray(elem[1]) ? (
                          <div key={i} className="command-output-pair">
                              <p aria-label={"vcommand" + i} className="text-output">
                                  command: {elem[0]}
                              </p>
                              output:
                              <table aria-label={"vtable" + i} className="array-output">
                                  <tbody>
                                      {elem[1].map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                              {row.map((cell, cellIndex) => (
                                                  <td key={cellIndex}>
                                                      {cell}
                                                  </td>
                                              ))}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      ) : (
                          <div key={i} className="verbose-output">
                              <p aria-label={"vcommand" + i} className="text-output">
                                  command: {elem[0]}
                              </p>
                              <p aria-label={"voutput" + i} className="text-output">
                                  output: {elem[1]}{" "}
                              </p>
                          </div>
                      )
                  )
                : props.history.map((elem, i) =>
                      Array.isArray(elem[1]) ? (
                          <div key={i} className="brief-output">
                              output:
                              <table aria-label={"btable" + i} className="array-output">
                                  <tbody>
                                      {elem[1].map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                              {row.map((cell, cellIndex) => (
                                                  <td key={cellIndex}>
                                                      {cell}
                                                  </td>
                                              ))}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      ) : (
                          <div key={i} className="brief-output">
                              <p aria-label={"boutput" + i} className="text-output">
                                  output: {elem[1]}
                              </p>
                          </div>
                      )
                  )}
        </div>
    );
}

export default History;
