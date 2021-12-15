import styled from "styled-components";
import ApiApplyProcessContainer from "./containers/ApiApplyProcessContainer";
import ConsoleContainer from "./containers/ConsoleContainer";
import SessionCertTestContainer from "./containers/SessionCertTestContainer";

function App() {
  return (
    <Wrap>
      <SessionCertTestContainer />
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
