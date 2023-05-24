import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";

const counterMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFzAJwFoBbAQ2QAsBLTMAOjO0oDcwBiASQDkBhAbQAYAuolAAHVLEqNUmESAAeiAExLaAVgDs-AMwBGJWoA0IAJ6IAbKrUBfa8bRZchUhWp0GzNgBEAonyFy4pLSskgKylZaegbGZgj6NrbGmKgQcHIOOPjEZFQ0gRJSlDJyiggEKlYAHGoAnNoaRqaIFYn2GFnOuW70yIwsBcHFoaBlBLoaACzqNfWNsYi15ra2QA */
  id: "counter-machine",
  context: {
    count: 0,
  },
  initial: "active",
  states: {
    active: {
      on: {
        INC: {
          actions: assign({
            count: (context) => context.count + 1,
          }),
        },
        DEC: {
          actions: assign({
            count: (context) => context.count - 1,
          }),
        },
      },
    },
  },
});

export default function Counter() {
  const [state, send] = useMachine(counterMachine);

  return (
    <div>
      <button onClick={() => send("INC")}>Increase</button>
      <h3>{state.context.count}</h3>
      <button onClick={() => send("DEC")}>Decrease</button>
    </div>
  );
}
