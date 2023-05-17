import useGameReset from "@/actions/hook/useGameReset";
import ReadyLayout from "@/present/layout/ready/ReadyLayout";
<<<<<<< HEAD
import { useRouter } from "next/router";

//로비 페이지
const ready = () => {
  const router = useRouter();
=======
import { useEffect } from "react";

//로비 페이지
const ready = () => {
  const { resetGame } = useGameReset();

  useEffect(() => {
    resetGame();
  }, []);
>>>>>>> 84bf09bbca2cd1c5d2d52b286ce999b9dcbb4a26

  return (
    <>
      <button onClick={() => router.push("/game")}>click</button>
      <ReadyLayout />
    </>
  );
};

export default ready;
