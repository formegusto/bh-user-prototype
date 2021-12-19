import axios from "axios";
import React, { useContext } from "react";
import styled from "styled-components";
import { Box, BoxBody, BoxTitle, BoxWrap } from "../styles";
import { decryptProcess, encryptProcess } from "../utils/ARIAUtils";
import BoxComponent from "./BoxComponent";
import _ from "lodash";
import ConsoleInfoContext from "../store";

function ApiApplyProcessComponent() {
  const {
    state: { communityKey, sessionCert },
    actions,
  } = useContext(ConsoleInfoContext);
  const [token, setToken] = React.useState<any>(undefined);
  const [decryptToken, setDecryptToken] = React.useState<any>(undefined);
  const [userInfo, setUserInfo] = React.useState<any>(undefined);
  const [decryptUserInfo, setDecryptUserInfo] = React.useState<any>(undefined);
  const [applyInfo, setApplyInfo] = React.useState<any>(undefined);
  const [decryptApplyInfo, setDecryptApplyInfo] =
    React.useState<any>(undefined);
  const [confirmInfo, setConfirmInfo] = React.useState<any>(undefined);
  const [decryptConfirmInfo, setDecryptConfirmInfo] =
    React.useState<any>(undefined);

  React.useEffect(() => {
    console.log(communityKey);
    if (communityKey && sessionCert) {
      const userInfo = {
        username: "keti1215",
        password: "keti123$",
        name: "케티연구원",
        organization: "KETI",
        email: "keti@keti.re.kr",
        phone: "070-xxxx-xxxx",
      };
      const reqBody = JSON.stringify(userInfo);
      const encReqBody = encryptProcess(reqBody, communityKey);
      axios
        .post("http://localhost:8080/user", encReqBody, {
          headers: {
            "session-cert-id": sessionCert.id.toString(),
            "Content-Type": "text/plain",
            "request-encrypt": "cert-community",
            "response-encrypt": "cert-community",
          },
        })
        .then((res) => {
          const encBodyStr = res.data;
          setToken(encBodyStr);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [communityKey, sessionCert]);

  React.useEffect(() => {
    if (token && communityKey) {
      console.log("token", token);
      const decrypt = token;
      const decBodyStr = decryptProcess(decrypt, communityKey);
      const decBody = JSON.parse(decBodyStr);
      setDecryptToken(decBody.token);
    }
  }, [token, communityKey]);

  React.useEffect(() => {
    if (decryptToken && sessionCert) {
      axios
        .get("http://localhost:8080/user/check", {
          headers: {
            authorization: decryptToken,
            "session-cert-id": sessionCert.id.toString(),
            "request-encrypt": "cert-community",
            "response-encrypt": "cert-community",
          },
        })
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [decryptToken, sessionCert]);

  React.useEffect(() => {
    if (userInfo && communityKey) {
      const decrypt = _.cloneDeep(userInfo);
      const decBodyStr = decryptProcess(decrypt, communityKey);
      const decBody = JSON.parse(decBodyStr);
      setDecryptUserInfo(decBody.user);
    }
  }, [userInfo, communityKey]);

  React.useEffect(() => {
    if (communityKey && applyInfo) {
      const decrypt = applyInfo;
      const decBodyStr = decryptProcess(decrypt, communityKey);
      const decBody = JSON.parse(decBodyStr);
      setDecryptApplyInfo(decBody.application);
      actions.setApiKey(decBody.application.apiKey);
      actions.setDecryptKey(decBody.application.symmetricKey);
    }
  }, [applyInfo, actions, communityKey]);

  React.useEffect(() => {
    if (communityKey && confirmInfo) {
      const decrypt = confirmInfo;
      const decBodyStr = decryptProcess(decrypt, communityKey);
      const decBody = JSON.parse(decBodyStr);
      console.log(decBody);
      setDecryptConfirmInfo(decBody.application);
    }
  }, [confirmInfo, communityKey]);

  const userApiApply = React.useCallback(async () => {
    if (communityKey && sessionCert) {
      try {
        const body = {
          purpose: "연구목적",
        };
        const encBody = encryptProcess(JSON.stringify(body), communityKey);
        const res = await axios.post(
          "http://localhost:8080/apiService/apply",
          encBody,
          {
            headers: {
              authorization: decryptToken,
              "session-cert-id": sessionCert.id.toString(),
              "Content-Type": "text/plain",
              "request-encrypt": "cert-community",
              "response-encrypt": "cert-community",
            },
          }
        );

        setApplyInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  }, [decryptToken, communityKey, sessionCert]);

  const adminApiConfirm = React.useCallback(async () => {
    if (communityKey && sessionCert) {
      const requestAdminKey = process.env.REACT_APP_ADMIN_KEY!;

      try {
        const body = {
          id: decryptApplyInfo.id,
        };
        console.log(body);
        const encBody = encryptProcess(JSON.stringify(body), communityKey);
        console.log(encBody);
        const res = await axios.patch(
          "http://localhost:8080/admin/apiService/confirm",
          encBody,
          {
            headers: {
              authorization: requestAdminKey,
              "session-cert-id": sessionCert.id.toString(),
              "Content-Type": "text/plain",
              "request-encrypt": "cert-community",
              "response-encrypt": "cert-community",
            },
          }
        );
        setConfirmInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  }, [decryptApplyInfo, communityKey, sessionCert]);

  return (
    <Wrap>
      <BoxWrap>
        <BoxComponent
          title="Token Information"
          customBodyText={JSON.stringify(token, null, "\t")}
        />
        <BoxComponent
          title="Decrypt Token Information"
          customBodyText={JSON.stringify(decryptToken, null, "\t")}
        />
      </BoxWrap>
      <BoxWrap>
        <BoxComponent
          title="User Information"
          customBodyText={JSON.stringify(userInfo, null, "\t")}
        />
        <BoxComponent
          title="Decrypt User Information"
          customBodyText={JSON.stringify(decryptUserInfo, null, "\t")}
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
          customBodyText={JSON.stringify(decryptApplyInfo, null, "\t")}
        />
      </BoxWrap>
      <BoxWrap>
        <Box>
          <BoxTitle>Admin Confirm Api Application</BoxTitle>
          <BoxBody>
            <button onClick={adminApiConfirm}>api confirm</button>
          </BoxBody>
        </Box>
        <BoxComponent
          title="Application Information"
          customBodyText={JSON.stringify(confirmInfo, null, "\t")}
        />
        <BoxComponent
          title="Decrypt Application Information"
          customBodyText={JSON.stringify(decryptConfirmInfo, null, "\t")}
        />
      </BoxWrap>
    </Wrap>
  );
}

const Wrap = styled.div``;

export default ApiApplyProcessComponent;
