import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ReduxExamples from "./ReduxExamples";
export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
    <div>
      <ClickEvent></ClickEvent>
      <PassingDataOnEvent></PassingDataOnEvent>
      <PassingFunctions theFunction={sayHello}></PassingFunctions>
      <EventObject></EventObject>
      <Counter></Counter>
      <BooleanStateVariables></BooleanStateVariables>
      <StringStateVariables></StringStateVariables>
      <DateStateVariable></DateStateVariable>
      <ReduxExamples />
    </div>
  );
}
