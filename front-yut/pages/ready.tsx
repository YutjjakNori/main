import ReadyLayout from "@/present/layout/ready/ReadyLayout";
import { useRouter } from "next/router";

//로비 페이지
const ready = () => {
  const router = useRouter();

  return (
    <>
      <button onClick={() => router.push("/game")}>click</button>
      <ReadyLayout />
    </>
  );
};

export default ready;
