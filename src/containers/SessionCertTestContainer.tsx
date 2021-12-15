import axios from "axios";
import { publicEncrypt } from "crypto";
import React from "react";
import SessionCertTestComponent from "../components/SessionCertTestComponent";
import { requestBodyEncrypt, responseDecrypt } from "../utils/ARIAUtils";
import getRandomBytes from "../utils/getRandomBytes";

type SessionCert = {
  id: number;
  publicKey: string;
};

function SessionCertTestContainer() {
  const [sessionCert, setSessionCert] = React.useState<
    SessionCert | undefined
  >();
  const [symmetricKey, setSymmetricKey] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!sessionCert) {
      axios.get("http://localhost:8080/publicKey").then((res) => {
        setSessionCert(res.data.sessionCert);

        // 대칭키 생성
        const symKey = getRandomBytes(32);
        setSymmetricKey(symKey);
      });
    } else {
      console.log(sessionCert);
    }
  }, [sessionCert]);

  React.useEffect(() => {
    if (sessionCert && symmetricKey) {
      const encSymKey = publicEncrypt(
        sessionCert.publicKey,
        Buffer.from(symmetricKey)
      ).toString("base64");
      console.log("대칭키 평문 :", symmetricKey);
      console.log("대칭키 암호화 :", encSymKey);

      axios
        .post("http://localhost:8080/symmetricKey", {
          id: sessionCert.id,
          symmetricKey: encSymKey,
        })
        .then((res) => {
          console.log(res.data.decSymKey);
          console.log(res.data.decSymKey === symmetricKey);

          const body = {
            test: "hello",
          };
          requestBodyEncrypt(body, symmetricKey);
          axios
            .post("http://localhost:8080/certTest", body, {
              headers: {
                "session-cert-id": sessionCert.id.toString(),
                "request-encrypt": "cert-community",
                "response-encrypt": "cert-community",
              },
            })
            .then((res) => {
              const data = res.data;
              responseDecrypt(data, symmetricKey);
              console.log(data);
            });
        });
    }
  }, [sessionCert, symmetricKey]);
  return <SessionCertTestComponent />;
}

export default SessionCertTestContainer;
