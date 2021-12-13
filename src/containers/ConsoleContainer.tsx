import { useContext } from "react";
import ConsoleComponent from "../components/ConsoleComponent";
import ConsoleInfoContext from "../store";

function ConsoleContainer() {
  const { state } = useContext(ConsoleInfoContext);
  return <ConsoleComponent {...state} />;
}

export default ConsoleContainer;
