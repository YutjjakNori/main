import LobbyLayout from "@/present/layout/lobby/LobbyLayout";
import { useRecoilState } from "recoil";
import { BgmAutoPlayState } from "@/store/GameStore";

//로비 페이지
const lobby = () => {
  // console.log(
  //   "process.env.NEXT_PUBLIC_SERVER_URL >>> ",
  //   process.env.NEXT_PUBLIC_SERVER_URL
  // );
  // console.log("process.env.NEXT_PUBLIC_SERVER_URL >>> ");
  // console.log(process.env.NEXT_PUBLIC_SERVER_URL);

  const [bgmAutoPlay, setBgmAutoPlay] = useRecoilState(BgmAutoPlayState);
  const autoPlayToggle = () => {
    setBgmAutoPlay(!bgmAutoPlay);
  };

  return (
    <>
      <button onClick={autoPlayToggle}>autoPlay Toggle 버튼</button>
      <LobbyLayout />

      {/* <button onClick={play}>Play</button>
      <audio ref={audioRef} src='/static/src.mp3' /> */}
    </>
  );
};

export default lobby;
