import axios from "axios";
import React from "react";
import styled from "styled-components";
import { Box, BoxBody, BoxTitle, BoxWrap } from "../styles";
import { responseDecrypt } from "../utils/ARIAUtils";
import BoxComponent from "./BoxComponent";
import _ from "lodash";

function ApiApplyProcessComponent() {
  const [userInfo, setUserInfo] = React.useState<any>({});
  const [decryptUserInfo, setDecryptUserInfo] = React.useState<string>("");
  const [applyInfo, setApplyInfo] = React.useState<any>({});
  const [decryptApplyInfo, setDecryptApplyInfo] = React.useState<string>("");

  React.useEffect(() => {
    const decrypt = _.cloneDeep(userInfo);
    responseDecrypt(decrypt, ["status", "password", "createdAt", "updatedAt"]);
    setDecryptUserInfo(JSON.stringify(decrypt, null, "\t"));
  }, [userInfo]);

  React.useEffect(() => {
    const decrypt = _.cloneDeep(applyInfo);
    responseDecrypt(decrypt, ["status", "id", "createdAt", "updatedAt"]);
    setDecryptApplyInfo(JSON.stringify(decrypt, null, "\t"));
  }, [applyInfo]);

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

  const userApiApply = React.useCallback(async () => {
    const token = process.env.REACT_APP_USER_JWT!;

    try {
      const res = await axios.post(
        "http://localhost:8080/apiService/apply",
        {
          purpose: "연구목적",
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setApplyInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

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
          <BoxBody>
            <button onClick={userApiApply}>api apply</button>
          </BoxBody>
        </Box>
        <BoxComponent
          title="Application Information"
          customBodyText={JSON.stringify(applyInfo, null, "\t")}
        />
        <BoxComponent
          title="Decrypt Application Information"
          customBodyText={decryptApplyInfo}
        />
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
