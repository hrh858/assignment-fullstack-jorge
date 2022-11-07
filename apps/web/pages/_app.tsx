import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AnyComponent {...pageProps} />
    </QueryClientProvider>
  );
}
