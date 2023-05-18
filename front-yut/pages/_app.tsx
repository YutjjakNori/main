import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import BGMAudioControl from "../present/common/Audio/BGMAudioControl";
import GlobalFonts from "./GlobalFonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <GlobalFonts />
      <BGMAudioControl />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
