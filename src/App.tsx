import axios from "axios";
import React, { useContext } from "react";
import styled from "styled-components";
import ApiApplyProcessContainer from "./containers/ApiApplyProcessContainer";
import ConsoleContainer from "./containers/ConsoleContainer";
import SessionCertTestContainer from "./containers/SessionCertTestContainer";
import ConsoleInfoContext from "./store";

function App() {
  // const {
  //   state: { communityKey },
  //   actions: { setCommunityKey },
  // } = useContext(ConsoleInfoContext);

  // React.useEffect(() => {
  //   if (!communityKey) {
  //     axios
  //       .get("http://localhost:8080/admin/key", {
  //         headers: {
  //           authorization: process.env.REACT_APP_ADMIN_KEY!,
  //           "Response-Encrypt": "plain",
  //         },
  //       })
  //       .then((res) => {
  //         setCommunityKey(res.data.key);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }, [communityKey, setCommunityKey]);

  return <SessionCertTestContainer />;
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
