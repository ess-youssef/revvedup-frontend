import "@/styles/globals.css";
import 'primeicons/primeicons.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-purple/theme.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";

const client = new QueryClient();

export default function App({ Component, pageProps }: any) {

  const getLayout = Component.getLayout ?? ((page: any) => page);

  return (
    <PrimeReactProvider>
      <QueryClientProvider client={client}>
        <Head>
          <title>RevvedUp</title>    
        </Head>
        {getLayout(<Component {...pageProps} />)}
        {/* {<ReactQueryDevtools />} */}
      </QueryClientProvider>
    </PrimeReactProvider>
  );
}
