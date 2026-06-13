import { createContext } from "react";

enum RegistrationMode {
  IssuingTreasury,
  Issuing,
}

const RegistrationModeContext = createContext({
  mode: RegistrationMode.IssuingTreasury,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMode: (_: RegistrationMode) => {},
});

export { RegistrationMode, RegistrationModeContext };
