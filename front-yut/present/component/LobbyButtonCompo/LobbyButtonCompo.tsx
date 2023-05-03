import * as style from "./LobbyButtonCompo.style";

interface LobbyButtonCompoProps {
  color: string;
  text: string;
  isEditable: boolean;
  handler: () => void;
}

const LobbyButtonCompo = ({
  text,
  color,
  isEditable,
  handler,
}: LobbyButtonCompoProps) => {
  return (
    <>
      <style.Button color={color}>{text}</style.Button>
    </>
  );
};

export default LobbyButtonCompo;
export type { LobbyButtonCompoProps };
