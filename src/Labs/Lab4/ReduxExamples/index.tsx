import React from "react";
import HelloRedux from "./HelloRedux";
import CountRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";


export default function ReduxExamples() {
  return (
    <div>
      <h2>Redux Examples</h2>
      <HelloRedux></HelloRedux>
      <CountRedux></CountRedux>
      <AddRedux></AddRedux>
      <TodoList></TodoList>
    </div>
  );
}
