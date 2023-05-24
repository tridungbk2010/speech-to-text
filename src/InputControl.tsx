import { useDrag } from "@use-gesture/react";
import { useMachine } from "@xstate/react";
import { ChangeEvent, useEffect } from "react";
import { assign, createMachine } from "xstate";

const inputMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEsB2AHArgFwLQFsBDAYwAs0wA6E7ZANzAGIBJAOWYBUB9AEQEEOfANoAGALqJQ6APaxktaakkgAHolwBGAEyUArADZ9AFhH6tugDQgAnuqMbKAdgCc+gByPdAXy9W0WPCIyCmpiWgZGHgAlPgBxWLZY0QkkEBk5BSVUtQRNXUoAZm1LG0RzER8-DBwCEnJUKhp6JjYABQBVbgBhAAk+VliAUWTldPlkRWUc3C0Ct0oRRzdiq1sEDVdKNy0RIvNKkH8aoPrGsObGAGlBgE1eAHkAdVYR1LHMqfUd-IKjAs9VupHAVKPoRM5-t4DqhpBA4MojoE6hRRrJxpNsupdM4fhpjKZzIDcniHBpwZCDojasEGqFwmBURkJllQNNdEZHIU8SYzCU1q4fD4gA */
  id: "input-machine",
  schema: {
    context: {} as {
      value: number;
      isDragging: boolean;
      isPressingKey: boolean;
    },
    events: {} as
      | { type: "INIT_DATA"; value: number }
      | { type: "DRAGGING"; value: number }
      | { type: "KEY_DOWN" }
      | { type: "INPUT_CHANGE"; value: number | string },
  },
  context: {
    value: 0,
    isDragging: false,
    isPressingKey: false,
  },
  initial: "active",
  states: {
    active: {
      on: {
        INIT_DATA: {
          actions: assign({
            value: (_, event) => event.value,
          }),
        },
        DRAGGING: {
          actions: assign({
            isDragging: true,
            isPressingKey: false,
            value: (context, event) => {
              if (event.value < 0) {
                return context.value - 1;
              } else {
                return context.value + 1;
              }
            },
          }),
        },
        INPUT_CHANGE: {
          actions: assign({
            value: 1,
          }),
        },
        KEY_DOWN: {},
      },
    },
  },
});

export default function InputControl({
  initialValue,
}: {
  initialValue?: number;
}) {
  const [state, send] = useMachine(inputMachine);

  useEffect(() => {
    send({ type: "INIT_DATA", value: initialValue || 0 });
  }, []);

  const bind = useDrag(
    ({ delta: [x] }) => {
      send({ type: "DRAGGING", value: x });
    },
    {
      axis: "x",
    }
  );

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    send({ type: "INPUT_CHANGE", value: evt.target.value });
  }

  return (
    <div>
      <label {...bind()}>Value</label>
      <input
        type="text"
        value={state.context.value}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}
