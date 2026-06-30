import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Werewolf Moderator",
  description: "Asisten digital untuk memandu permainan Werewolf bersama teman-teman.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-scene">
        <div className="fog-layer" />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#121f18",
              color: "#e9eef3",
              border: "1px solid rgba(207,227,255,0.15)",
            },
          }}
        />
      </body>
    </html>
  );
}
