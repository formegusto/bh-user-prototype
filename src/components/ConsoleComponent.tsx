import axios from "axios";
import React from "react";
import styled from "styled-components";
import _ from "lodash";
import { responseDecrypt } from "../utils/ARIAUtils";

type Props = {
  apiKey: string;
  decryptKey: string;
};
function ConsoleComponent({ apiKey, decryptKey }: Props) {
  const [result, setResult] = React.useState<any>({});
  const [decryptResult, setDecryptResult] = React.useState<any>(null);

  const actionApi = React.useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/humanData", {
        headers: {
          authorization: apiKey,
        },
      });
      setResult(res.data);
      setDecryptResult(null);
    } catch (err) {}
  }, [apiKey]);

  const onDecryptResult = React.useCallback(() => {
    const decrypt = _.cloneDeep(result);
    responseDecrypt(decrypt, decryptKey, [
      "status",
      "query",
      "id",
      "createdAt",
      "updatedAt",
    ]);
    setDecryptResult(decrypt);
  }, [decryptKey, result]);

  return (
    <Wrap>
      <KeyBlock>
        <p>api key : {apiKey}</p>
        <p>decrypt key : {decryptKey}</p>
      </KeyBlock>
      <Options>
        <button onClick={actionApi}>action</button>
      </Options>
      <Result>
        <code>
          <pre>
            {decryptResult
              ? JSON.stringify(decryptResult, null, "\t")
              : JSON.stringify(result, null, "\t")}
          </pre>
        </code>
      </Result>
      <button onClick={onDecryptResult}>Decrypt</button>
    </Wrap>
  );
}

const Wrap = styled.div`
  & > div {
    margin: 10px 0 10px;

    border: 1px solid #333;
    padding: 20px;
  }
`;

const KeyBlock = styled.div`
  height: 70px;

  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Options = styled.div``;

const Result = styled.div`
  max-width: 40vw;
  max-height: 600px;
  overflow: scroll;
`;

export default ConsoleComponent;
