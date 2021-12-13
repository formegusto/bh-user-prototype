import axios from "axios";
import React from "react";
import styled from "styled-components";
import { Box, BoxTitle, BoxWrap } from "../styles";
import { responseDecrypt } from "../utils/ARIAUtils";
import BoxComponent from "./BoxComponent";
import _ from "lodash";

function ApiApplyProcessComponent() {
  const [userInfo, setUserInfo] = React.useState<any>({});
  const [decryptUserInfo, setDecryptUserInfo] = React.useState<string>("");

  React.useEffect(() => {
    const decrypt = _.cloneDeep(userInfo);
    responseDecrypt(decrypt, ["status", "password", "createdAt", "updatedAt"]);
    setDecryptUserInfo(JSON.stringify(decrypt, null, "\t"));
  }, [userInfo]);

  const RequestUserInfo = React.useCallback(async (): Promise<string> => {
    const token = process.env.REACT_APP_USER_JWT!;

    try {
      const res = await axios.get("http://localhost:8080/user/check", {
        headers: {
          authorization: token,
        },
      });

      setUserInfo(res.data);
      return JSON.stringify(res.data, null, "\t");
    } catch (err) {
      return "error!";
    }
  }, []);

  const RequestDecryptUserInfo = React.useCallback(() => {}, []);

  return (
    <Wrap>
      <BoxWrap>
        <BoxComponent
          title="User Information"
          setBodyRequestFunction={RequestUserInfo}
        />
        <BoxComponent
          title="Decrypt User Information"
          customBodyText={decryptUserInfo}
        />
      </BoxWrap>
      <BoxWrap>
        <Box>
          <BoxTitle>User Apply Api</BoxTitle>
        </Box>
        <Box>
          <BoxTitle>Application Information</BoxTitle>
        </Box>
        <Box>
          <BoxTitle>Decrypt Application Information</BoxTitle>
        </Box>
      </BoxWrap>
      <BoxWrap>
        <Box>
          <BoxTitle>Admin Confirm Api Application</BoxTitle>
        </Box>
        <Box>
          <BoxTitle>Application Information</BoxTitle>
        </Box>
        <Box>
          <BoxTitle>Decrypt Application Information</BoxTitle>
        </Box>
      </BoxWrap>
    </Wrap>
  );
}

const Wrap = styled.div``;

export default ApiApplyProcessComponent;
