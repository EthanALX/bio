import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { GlobalHeader } from "../components/GlobalHeader";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
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
    <html lang="en" className={` ${spaceMono.variable}`}>
      <body className="antialiased">
        <div className="max-w-[75%] min-w-[900px] mx-auto relative z-10">
          <GlobalHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
