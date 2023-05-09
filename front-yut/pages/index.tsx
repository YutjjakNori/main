import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router) return;

    router.replace("/lobby");
  }, [router.isReady]);

  return <></>;
};

export default Home;
