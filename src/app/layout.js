import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Linktree -Link All in One',
  description: 'Link Your Tag in Urls Instagram,Facebook,Google,Tiktok',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
        {/* Favicon */}
        <link rel="icon" href="/batman.svg" />
        <meta property="og:title" content="Linktree" />
        <meta property="og:description" content="The fast, friendly and powerful link in bio tool. ... Seamlessly connect your Linktree with the tools you already use" />
        <meta property="og:image" content="https://en.wikipedia.org/wiki/Linktree#/media/File:Linktree_logo.svg" />
        <meta property="og:url" content="https://lktree.netlify.app/" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
