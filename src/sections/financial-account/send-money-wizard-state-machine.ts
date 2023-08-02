import { createMachine } from "xstate";

const stateMachine = createMachine({
  initial: "selectingNetwork",
  states: {
    selectingNetwork: {
      on: { NEXT: "collectingDestinationAddress", RESET: "selectingNetwork" },
    },
    collectingDestinationAddress: {
      on: {
        NEXT: "confirmingTransfer",
        BACK: "selectingNetwork",
        RESET: "selectingNetwork",
      },
    },
    confirmingTransfer: {
      on: {
        BACK: "collectingDestinationAddress",
        RESET: "selectingNetwork",
        COMPLETE: "notifyingCompletion",
      },
    },
    notifyingCompletion: {
      on: { RESET: "selectingNetwork" },
    },
  },
});

export default stateMachine;
