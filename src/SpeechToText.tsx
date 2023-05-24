import { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import ListeningButton from "./components/ListeningButton.tsx";
import { assign, createMachine } from "xstate";
import Mic from "./components/icons/Mic.tsx";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const voiceMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcD2BLAxmAtAWwENMALdAOzADp0IAbMAYgGUAVAQQCUWBtABgF1EoAA6pY6AC7pUZISAAeiAMwBGSrwAsGgBwBWXQE4ATCoO8VRgGwAaEAE9EKpb0oGVl3rqNf9OjUYBfANs0LFxCEnIqGnoGNgAhAHkuPkEkEFFxKRk5RQQcdwB2Sg0lJUMlQt1bBwQVXSVKS28gkIxsfCJSCkoAJzACCDtKAHcCSXIoZgAFAFFZgGEACQB9Vk4eATlMiZz0vKdivQ0vSw0ncprELyNKbUrLXXPNIwMNVpBQjojuqn7B4ZjCZkKYLNgAOQWswAMqltmJdrJ9ogjIUXCpCgYnv4lJYzrxtFcEEZtC4lFjTDiqq8DB8vuEulE+gMhpRaOhYBIwGRJjN5ssVrNwQAROHpHbZJGgPLk3SUQoaQqFCyeJ7uIknAyUJRGXjk-z1XEPOntBmRHr-Vnsznc3kAMQAkuCHUwlmKRAjJblEBo3CUnr4lNoldSbPZHM4mn4VTpLAYDGUgsEQGRUBA4HJ6Z1zWB4VlpFKFIgcN5buUA77Co9SioVESSxptdpLMrZbpCsGypYTWFs79qHRc+LPQXvfkvE0qh2LNVwwhLI1azrtDOe99GRaWbUPfm9tLHJZKCpO7oW7j8XoiUYNC5tBT4+5TxZ6muzf3LYDxlIQXnEWOzkeJ5nniN6XnOy7aliJgYoqVbmEor59kyH5shyXI8j+w67oWeSomo8a6vomjHlodbgSu-pYucsYaAuVaIT8TIAK5kLATHCKIvRchAv5esi+S6o25YnJW1aqGRtT6PhZzKrq8aKrwhRJgEQA */
  id: "voice-machine",
  schema: {
    context: {} as { content: string },
    events: {} as
      | { type: "ABORT" }
      | { type: "START" }
      | { type: "CANCEL" }
      | { type: "SPEECH_START" }
      | { type: "SPEECH_END" }
      | { type: "FINISH"; value?: string },
  },
  context: {
    content: "",
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "ready",
        ABORT: "unsupported",
      },
    },
    ready: {
      initial: "waiting",
      states: {
        waiting: {
          on: {
            SPEECH_START: "listening",
            CANCEL: "#voice-machine.idle",
          },
        },
        listening: {
          on: {
            SPEECH_END: "waiting",
            FINISH: {
              target: "#voice-machine.idle",
              actions: assign({
                content: (_, event) => (event.value ? event.value : ""),
              }),
            },
          },
        },
      },
    },
    unsupported: {
      type: "final",
    },
  },
});

export default function SpeechToText() {
  const recognitionRef = useRef<any>();
  const textRef = useRef<HTMLDivElement>(null);
  const [state, send] = useMachine(voiceMachine);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition === "undefined") {
      send("ABORT");
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognitionRef.current = recognition;

      recognition.addEventListener("result", (event: any) => {
        if (textRef.current) {
          textRef.current.innerHTML = "";
        }
        let content = "";
        for (const res of event.results) {
          const text = document.createTextNode(res[0].transcript);
          const span = document.createElement("span");
          content += " " + res[0].transcript;
          if (res.isFinal) {
            span.classList.add("final");
            recognition.stop();
            send({ type: "FINISH", value: content });
          }
          span.appendChild(text);
          textRef.current?.appendChild(span);
        }
      });

      recognition.addEventListener("speechstart", () => {
        send("SPEECH_START");
      });

      recognition.addEventListener("speechend", () => {
        send("SPEECH_END");
      });
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [send]);

  const start = () => {
    send("START");
    recognitionRef.current?.start();
  };

  const cancel = () => {
    recognitionRef.current.stop();
    send("CANCEL");
  };

  if (state.matches("unsupported")) {
    return <p>Do not support SpeechRecognition</p>;
  }

  return (
    <section className="">
      <div className="flex flex-col items-center">
        <div className="my-5">
          <div className="p-3 text-xl italic text-gray-500" ref={textRef}>
            Speak now
          </div>
        </div>
        {state.matches("ready") && (
          <ListeningButton
            onClick={cancel}
            listening={state.matches("ready.listening")}
          />
        )}
        {state.matches("idle") && (
          <button
            className="btn shadow-md rounded-full w-20 h-20 justify-center"
            onClick={start}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
        <p className="italic text-xs mt-3 text-gray-500">
          {state.matches("listening") ? "Listening" : ""}
        </p>
      </div>
    </section>
  );
}
