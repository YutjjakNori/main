import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import BGMAudioControl from "../present/common/Audio/BGMAudioControl";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <BGMAudioControl />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
