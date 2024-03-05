import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
        <div aria-label="History" className="history">
            {props.mode === "verbose"
                ? props.history.map((elem, i) =>
                      // HTML table handling
                      Array.isArray(elem[1]) ? (
                          <div key={i}>
                              <p aria-label={"vcommand" + i}>
                                  command: {elem[0]}
                              </p>
                              output:
                              <table aria-label={"vtable" + i}>
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
                          <div key={i}>
                              <p aria-label={"vcommand" + i}>
                                  command: {elem[0]}
                              </p>
                              <p aria-label={"voutput" + i}>
                                  output: {elem[1]}{" "}
                              </p>
                          </div>
                      )
                  )
                : props.history.map((elem, i) =>
                      Array.isArray(elem[1]) ? (
                          <div key={i}>
                              output:
                              <table aria-label={"btable" + i}>
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
                          <div key={i}>
                              <p aria-label={"boutput" + i}>
                                  output: {elem[1]}
                              </p>
                          </div>
                      )
                  )}
        </div>
    );
}

export default History;
