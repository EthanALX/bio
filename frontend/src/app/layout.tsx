// import type { Metadata } from "next";
// import { Space_Grotesk } from "next/font/google";
// import "./globals.css";

// const spaceGrotesk = Space_Grotesk({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
// });

// export const metadata: Metadata = {
//   title: "跑步历程",
//   description: "个人跑步记录",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={`${spaceGrotesk.variable} dark`}>
//       <body className="antialiased">
//         <div className="max-w-[1200px] mx-auto relative z-10">{children}</div>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { GlobalHeader } from "../components/GlobalHeader";
import "./globals.css";

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-jetbrains-mono",
// });

// const ibmPlexMono = IBM_Plex_Mono({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   variable: "--font-ibm-plex-mono",
// });

// const firaCode = Fira_Code({
//   subsets: ["latin"],
//   variable: "--font-fira-code",
// });

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
