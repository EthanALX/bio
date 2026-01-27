import type { Metadata } from "next";
import {
  JetBrains_Mono,
  IBM_Plex_Mono,
  Fira_Code,
  Space_Mono,
  Inter,
  Bebas_Neue,
} from "next/font/google";
import { GlobalHeader } from "../components/GlobalHeader";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// Athletic Performance Typography
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "跑步历程",
  description: "个人跑步记录",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${ibmPlexMono.variable} ${firaCode.variable} ${spaceMono.variable} ${inter.variable} ${bebasNeue.variable}`}
    >
      <body className="antialiased">
        <div className="max-w-[75%] min-w-[900px] mx-auto relative z-10">
          <GlobalHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
