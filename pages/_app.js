// Import React and the necessary Next.js modules
import React from "react";
import { AppProps } from "next/app";

// Define the App component
export default function App({ Component, pageProps }) {
  // Render the Component with its props
  return <Component {...pageProps} />;
}
