import axios from "axios";
import React from "react";
import styled from "styled-components";
import { decryptProcess } from "../utils/ARIAUtils";
// import xlsx from "xlsx";
import ExcelTestButton from "./ExcelTestButton";

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
      setResult(res.data["encryptBody"]);
      setDecryptResult(null);
    } catch (err) {}
  }, [apiKey]);

  const onDecryptResult = React.useCallback(() => {
    let decrypt = result;
    decrypt = decryptProcess(decrypt, decryptKey);

    const decBody = JSON.parse(decrypt);
    console.log(decBody);
    setDecryptResult(decBody);
  }, [decryptKey, result]);

  // const onExcelDownload = React.useCallback(() => {
  //   const ws = xlsx.utils.json_to_sheet(decryptResult.requestQuery);
  //   const wb = xlsx.utils.book_new();

  //   xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  //   xlsx.writeFile(wb, "test.xlsx");
  // }, [decryptResult]);

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
      {/* {decryptResult && (
        <button onClick={onExcelDownload}>Excel Download</button>
      )} */}
      <ExcelTestButton />
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
