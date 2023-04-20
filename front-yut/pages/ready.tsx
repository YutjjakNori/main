//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";

const Ready = () => {
  return (
    <>
      <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={"박재희"}
      />
    </>
  );
};

export default Ready;
