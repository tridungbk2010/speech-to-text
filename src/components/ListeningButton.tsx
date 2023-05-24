import "./loader.css";
import Mic from "./icons/Mic.tsx";
import Mute from "./icons/Mute.tsx";

const ListeningButton = ({
  onClick,
  listening,
}: {
  onClick?: () => void;
  listening?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center relative w-20 h-20 text-white rounded-full bg-red-500"
    >
      {listening ? <Mic className="w-5 h-5" /> : <Mute className="w-5 h-5" />}
      {listening && <span className="effect" />}
    </button>
  );
};

export default ListeningButton;
