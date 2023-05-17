import useGameReset from "@/actions/hook/useGameReset";
import ReadyLayout from "@/present/layout/ready/ReadyLayout";
import { useEffect } from "react";

//로비 페이지
const ready = () => {
  const { resetGame } = useGameReset();

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <>
      <ReadyLayout />
    </>
  );
};

export default ready;
