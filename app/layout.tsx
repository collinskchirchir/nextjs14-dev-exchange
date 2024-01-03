import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { feixenMono, inter, jetBrains } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrains.variable} ${feixenMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
