import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-purple/theme.css";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </PrimeReactProvider>
  );
}
