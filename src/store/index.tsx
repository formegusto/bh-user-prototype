import React, { createContext, useState } from "react";
import { SessionCert } from "../containers/SessionCertTestContainer";

export type ConsoleInfoType = {
  state: {
    communityKey?: string;
    apiKey: string;
    decryptKey: string;
    sessionCert?: SessionCert;
  };
  actions: {
    setCommunityKey: (communityKey: string) => void;
    setApiKey: (apiKey: string) => void;
    setDecryptKey: (decryptKey: string) => void;
    setSessionCert: (sessionCert: SessionCert) => void;
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
    setSessionCert: () => {},
  },
});

function ConsoleInfoProvider({ children }: React.PropsWithChildren<any>) {
  const [apiKey, setApiKey] = useState<string>("");
  const [decryptKey, setDecryptKey] = useState<string>("");
  const [communityKey, setCommunityKey] = useState<string | undefined>();
  const [sessionCert, setSessionCert] = useState<SessionCert | undefined>();

  const value = {
    state: { apiKey, decryptKey, communityKey, sessionCert },
    actions: { setApiKey, setDecryptKey, setCommunityKey, setSessionCert },
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
