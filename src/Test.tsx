import { useControls } from "leva";

function MyComponent() {
  const { myValue } = useControls({ myValue: 10 });
  return <span>{myValue}</span>;
}

function AnotherComponent() {
  const { anotherValue } = useControls({ anotherValue: "alive!!" });

  return <div>Hey, I'm {anotherValue}</div>;
}

function UnmountedComponent() {
  const { barValue } = useControls({ barValue: false });

  return barValue ? <div>Hello!</div> : null;
}

export default function Test() {
  return (
    <>
      <MyComponent />
      <AnotherComponent />
    </>
  );
}
