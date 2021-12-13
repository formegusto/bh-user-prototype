import React, { createContext, useState } from "react";

export type ConsoleInfoType = {
  state: {
    apiKey: string;
    decryptKey: string;
  };
  actions: {
    setApiKey: (apiKey: string) => void;
    setDecryptKey: (decryptKey: string) => void;
  };
};

const ConsoleInfoContext = createContext<ConsoleInfoType>({
  state: {
    apiKey: "",
    decryptKey: "",
  },
  actions: {
    setApiKey: () => {},
    setDecryptKey: () => {},
  },
});

function ConsoleInfoProvider({ children }: React.PropsWithChildren<any>) {
  const [apiKey, setApiKey] = useState<string>("");
  const [decryptKey, setDecryptKey] = useState<string>("");

  const value = {
    state: { apiKey, decryptKey },
    actions: { setApiKey, setDecryptKey },
  };

  return (
    <ConsoleInfoContext.Provider value={value}>
      {children}
    </ConsoleInfoContext.Provider>
  );
}

const { Consumer: ConsoleInfoConsumer } = ConsoleInfoContext;

export { ConsoleInfoConsumer, ConsoleInfoProvider };

export default ConsoleInfoContext;
