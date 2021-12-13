import styled from "styled-components";
import ApiApplyProcessContainer from "./containers/ApiApplyProcessContainer";
import ConsoleContainer from "./containers/ConsoleContainer";
import { ConsoleInfoProvider } from "./store";

function App() {
  return (
    <ConsoleInfoProvider>
      <Wrap>
        <ApiApplyProcessContainer />
        <ConsoleContainer />
      </Wrap>
    </ConsoleInfoProvider>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;

  & > div {
    flex: 1;
  }
`;

export default App;
