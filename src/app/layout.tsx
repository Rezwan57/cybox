import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppWrapper from "../Context/AppWrapper";

const localFontBold = localFont({
  src: "./fonts/Bold.ttf",
  variable: "--font-bold",
  weight: "700",
  display: "swap",
});

const localFontItalic = localFont({
  src: "./fonts/Italic.ttf",
  variable: "--font-italic",
  style: "italic",
  display: "swap",
});

const localFontRegular = localFont({
  src: "./fonts/Regular.ttf",
  variable: "--font-regular",
  weight: "400",
  display: "swap",
});

const localFontPoints = localFont({
  src: "./fonts/points.otf",
  variable: "--font-points",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Cybersecurity Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${localFontBold.variable} ${localFontItalic.variable} ${localFontRegular.variable} ${localFontPoints.variable}`}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}