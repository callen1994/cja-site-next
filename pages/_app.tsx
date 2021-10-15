import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  console.log("Running _app.tsx");
  return <Component {...pageProps} />;
}
