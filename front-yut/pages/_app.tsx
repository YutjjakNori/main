import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AudioToggleCompo from "./AudioCompo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AudioToggleCompo />

      <Component {...pageProps} />
    </RecoilRoot>
  );
}
