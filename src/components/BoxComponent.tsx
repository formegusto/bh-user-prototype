import React from "react";
import { Box, BoxBody, BoxTitle } from "../styles";

type Props = {
  title: string;
  setBodyRequestFunction?: () => Promise<string>;
  customBodyText?: string;
};

function BoxComponent({
  title,
  setBodyRequestFunction,
  customBodyText,
}: Props) {
  const [bodyText, setBodyText] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (setBodyRequestFunction)
      setBodyRequestFunction().then((res) => {
        setBodyText(res);
      });
  }, [setBodyRequestFunction]);

  return (
    <Box>
      <BoxTitle>{title}</BoxTitle>
      {customBodyText && (
        <BoxBody>
          <code>
            <pre>{customBodyText}</pre>
          </code>
        </BoxBody>
      )}
      {bodyText && (
        <BoxBody>
          <code>
            <pre>{bodyText}</pre>
          </code>
        </BoxBody>
      )}
    </Box>
  );
}

export default BoxComponent;
