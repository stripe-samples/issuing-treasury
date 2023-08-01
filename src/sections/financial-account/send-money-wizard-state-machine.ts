import { createMachine } from "xstate";

const stateMachine = createMachine({
  initial: "selectingNetwork",
  states: {
    selectingNetwork: {
      on: { NEXT: "collectingDestinationAddress" },
    },
    collectingDestinationAddress: {
      on: { NEXT: "confirmingTransfer", BACK: "selectingNetwork" },
    },
    confirmingTransfer: {
      on: { BACK: "collectingDestinationAddress" },
    },
  },
});

export default stateMachine;
