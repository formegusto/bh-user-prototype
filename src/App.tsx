import styled from "styled-components";
import ApiApplyProcessContainer from "./containers/ApiApplyProcessContainer";
import ConsoleContainer from "./containers/ConsoleContainer";

function App() {
  return (
    <Wrap>
      <ApiApplyProcessContainer />
      <ConsoleContainer />
    </Wrap>
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
