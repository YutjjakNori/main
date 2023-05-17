import useGameReset from "@/actions/hook/useGameReset";
import ReadyLayout from "@/present/layout/ready/ReadyLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";

//로비 페이지
const ready = () => {
  const router = useRouter();
  const { resetGame } = useGameReset();

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <>
      <button onClick={() => router.push("/game")}>click</button>
      <ReadyLayout />
    </>
  );
};

export default ready;
