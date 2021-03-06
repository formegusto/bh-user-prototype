import axios from "axios";
import { publicEncrypt } from "crypto";
import React, { useContext } from "react";
import SessionCertTestComponent from "../components/SessionCertTestComponent";
import ConsoleInfoContext from "../store";
import { decryptProcess, encryptProcess } from "../utils/ARIAUtils";
import getRandomBytes from "../utils/getRandomBytes";

export type SessionCert = {
  id: number;
  publicKey: string;
};

function SessionCertTestContainer() {
  const {
    actions: { setSessionCert: globalSessionCertSetting, setCommunityKey },
  } = useContext(ConsoleInfoContext);
  const [sessionCert, setSessionCert] = React.useState<
    SessionCert | undefined
  >();
  const [symmetricKey, setSymmetricKey] = React.useState<string | undefined>();
  const [testString, setTestString] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!sessionCert) {
      const certInfo = sessionStorage.getItem("cert-info");
      axios.get("http://localhost:8080/sessionCert/publicKey").then((res) => {
        setSessionCert(res.data.sessionCert);
        // window.onunload = () => {
        //   axios.delete(
        //     `http://localhost:8080/sessionCert?id=${res.data.sessionCert.id}`
        //   );
        // };
        // 대칭키 생성
        const symKey = getRandomBytes(32);
        setSymmetricKey(symKey);
      });
      if (certInfo) {
        // const _certInfo = JSON.parse(certInfo);
        // const sessionCert: SessionCert = {
        //   id: (_certInfo as any).id,
        //   publicKey: (_certInfo as any).publicKey,
        // };
        // globalSessionCertSetting(sessionCert);
        // setCommunityKey((_certInfo as any).symmetricKey);
        // // window.onunload = () => {
        // //   axios.delete(
        // //     `http://localhost:8080/sessionCert?id=${sessionCert.id}`
        // //   );
        // // };
      } else {
        // axios.get("http://localhost:8080/sessionCert/publicKey").then((res) => {
        //   setSessionCert(res.data.sessionCert);
        //   // window.onunload = () => {
        //   //   axios.delete(
        //   //     `http://localhost:8080/sessionCert?id=${res.data.sessionCert.id}`
        //   //   );
        //   // };
        //   // 대칭키 생성
        //   const symKey = getRandomBytes(32);
        //   setSymmetricKey(symKey);
        // });
      }
    } else {
      console.log(sessionCert);
    }
  }, [sessionCert, globalSessionCertSetting, setCommunityKey]);

  React.useEffect(() => {
    if (sessionCert && symmetricKey) {
      const encSymKey = publicEncrypt(
        sessionCert.publicKey,
        Buffer.from(symmetricKey)
      ).toString("base64");
      console.log("대칭키 평문 :", symmetricKey);
      console.log("대칭키 암호화 :", encSymKey);

      axios
        .post("http://localhost:8080/sessionCert/symmetricKey", {
          id: sessionCert.id,
          symmetricKey: encSymKey,
        })
        .then((res) => {
          console.log("test String", res.data);
          setTestString(res.data);
        });
    }
  }, [sessionCert, symmetricKey]);

  React.useEffect(() => {
    if (testString && symmetricKey && sessionCert) {
      const decBody = decryptProcess(testString, symmetricKey);
      const encBody = encryptProcess(decBody, symmetricKey);

      axios
        .patch("http://localhost:8080/sessionCert/establish", encBody, {
          headers: {
            "session-cert-id": sessionCert.id.toString(),
            "Content-Type": "text/plain",
            "request-encrypt": "cert-community",
            "response-encrypt": "cert-community",
          },
        })
        .then((res) => {
          const { establish } = res.data;
          if (establish) {
            globalSessionCertSetting(sessionCert);
            setCommunityKey(symmetricKey);

            const certInfo = {
              ...sessionCert,
              symmetricKey,
            };
            sessionStorage.setItem("cert-info", JSON.stringify(certInfo));
          }
        });
    }
  }, [
    testString,
    symmetricKey,
    sessionCert,
    setCommunityKey,
    globalSessionCertSetting,
  ]);
  return <SessionCertTestComponent />;
}

export default SessionCertTestContainer;
