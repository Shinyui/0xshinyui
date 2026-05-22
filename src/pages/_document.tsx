import { Html, Head, Main, NextScript } from "next/document";

const bunnyHost = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
const bunnyOrigin = bunnyHost ? `https://${bunnyHost}` : undefined;

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        {/* Favicon / app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* CDN preconnect for faster image LCP */}
        {bunnyOrigin && (
          <>
            <link rel="preconnect" href={bunnyOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={bunnyOrigin} />
          </>
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
