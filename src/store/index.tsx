import React, { createContext, useState } from "react";

export type ConsoleInfoType = {
  state: {
    communityKey?: string;
    apiKey: string;
    decryptKey: string;
  };
  actions: {
    setCommunityKey: (communityKey: string) => void;
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
    setCommunityKey: () => {},
    setApiKey: () => {},
    setDecryptKey: () => {},
  },
});

function ConsoleInfoProvider({ children }: React.PropsWithChildren<any>) {
  const [apiKey, setApiKey] = useState<string>("");
  const [decryptKey, setDecryptKey] = useState<string>("");
  const [communityKey, setCommunityKey] = useState<string | undefined>();

  const value = {
    state: { apiKey, decryptKey, communityKey },
    actions: { setApiKey, setDecryptKey, setCommunityKey },
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
