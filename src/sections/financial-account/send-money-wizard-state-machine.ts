import { createMachine } from "xstate";

const stateMachine = createMachine({
  initial: "green",
  states: {
    green: {
      on: { NEXT: "yellow" },
    },
    yellow: {
      on: { NEXT: "red" },
    },
    red: {
      on: { NEXT: "green" },
    },
  },
});

export default stateMachine;
