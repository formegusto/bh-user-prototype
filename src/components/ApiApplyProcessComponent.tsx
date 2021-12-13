import axios from "axios";
import React, { useContext } from "react";
import styled from "styled-components";
import { Box, BoxBody, BoxTitle, BoxWrap } from "../styles";
import {
  encryptProcess,
  requestBodyEncrypt,
  responseDecrypt,
} from "../utils/ARIAUtils";
import BoxComponent from "./BoxComponent";
import _ from "lodash";
import ConsoleInfoContext from "../store";

function ApiApplyProcessComponent() {
  const { actions } = useContext(ConsoleInfoContext);
  const [token, setToken] = React.useState<any>({});
  const [decryptToken, setDecryptToken] = React.useState<any>({});
  const [userInfo, setUserInfo] = React.useState<any>({});
  const [decryptUserInfo, setDecryptUserInfo] = React.useState<any>({});
  const [applyInfo, setApplyInfo] = React.useState<any>({});
  const [decryptApplyInfo, setDecryptApplyInfo] = React.useState<any>({});
  const [confirmInfo, setConfirmInfo] = React.useState<any>({});
  const [decryptConfirmInfo, setDecryptConfirmInfo] = React.useState<any>({});

  React.useEffect(() => {
    const userJoinInfo = {
      username: "keti1215",
      email: "keti@keti.re.kr",
      phone: "070-xxxx-xxxx",
      nickname: "keti_user",
      password: "keti123$",
    };
    requestBodyEncrypt(userJoinInfo);
    axios
      .post("http://localhost:8080/user", userJoinInfo)
      .then((res) => {
        setToken({ token: res.data.token });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  React.useEffect(() => {
    const decrypt = _.cloneDeep(token);
    responseDecrypt(decrypt, undefined, ["status"]);
    setDecryptToken(decrypt);
  }, [token]);

  React.useEffect(() => {
    const token = decryptToken.token;
    axios
      .get("http://localhost:8080/user/check", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [decryptToken]);

  React.useEffect(() => {
    const decrypt = _.cloneDeep(userInfo);
    responseDecrypt(decrypt, undefined, ["password", "createdAt", "updatedAt"]);
    setDecryptUserInfo(decrypt);
  }, [userInfo]);

  React.useEffect(() => {
    const decrypt = _.cloneDeep(applyInfo);
    responseDecrypt(decrypt, undefined, ["id", "createdAt", "updatedAt"]);
    setDecryptApplyInfo(decrypt);
    actions.setApiKey(decrypt.apiKey);
    actions.setDecryptKey(decrypt.decryptKey);
  }, [applyInfo, actions]);

  React.useEffect(() => {
    const decrypt = _.cloneDeep(confirmInfo);
    responseDecrypt(decrypt, undefined, ["id", "createdAt", "updatedAt"]);
    setDecryptConfirmInfo(decrypt);
  }, [confirmInfo]);

  const userApiApply = React.useCallback(async () => {
    const token = decryptToken.token!;

    try {
      const res = await axios.post(
        "http://localhost:8080/apiService/apply",
        {
          purpose: encryptProcess("연구목적"),
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setApplyInfo(res.data.application);
    } catch (err) {
      console.error(err);
    }
  }, [decryptToken]);

  const adminApiConfirm = React.useCallback(async () => {
    const requestAdminKey = process.env.REACT_APP_ADMIN_KEY!;

    try {
      const res = await axios.patch(
        "http://localhost:8080/admin/apiService/confirm",
        {
          id: encryptProcess(applyInfo.id),
        },
        {
          headers: {
            authorization: requestAdminKey,
          },
        }
      );
      setConfirmInfo(res.data.application);
    } catch (err) {
      console.error(err);
    }
  }, [applyInfo]);

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
