import LobbyLayout from "@/present/layout/lobby/LobbyLayout";

//로비 페이지
const lobby = () => {
  console.log(
    "process.env.NEXT_PUBLIC_SERVER_URL >>> ",
    process.env.NEXT_PUBLIC_SERVER_URL
  );
  console.log("process.env.NEXT_PUBLIC_SERVER_URL >>> ");
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  return (
    <>
      <LobbyLayout />
    </>
  );
};

export default lobby;
