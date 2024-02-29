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
                          <p key={i} aria-label="Verbose With Array">
                              command: {elem[0]}
                              <br></br>
                              output:
                              <table>
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
                          </p>
                      ) : (
                          <p key={i} aria-label="Verbose Without Array">
                              command: {elem[0]}
                              <br></br>
                              output: {elem[1]}
                          </p>
                      )
                  )
                : props.history.map((elem, i) =>
                      Array.isArray(elem[1]) ? (
                          <p key={i}>
                              output:
                              <table aria-label={"table" + i}>
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
                          </p>
                      ) : (
                          <p key={i} aria-label="Brief Without Array">
                              output: {elem[1]}
                          </p>
                      )
                  )}
        </div>
    );
}

export default History;
