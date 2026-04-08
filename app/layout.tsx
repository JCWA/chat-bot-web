import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "AI 의약품 식별 챗봇",
    template: "%s | AI 의약품 식별 챗봇",
  },
  description:
    "약의 모양, 색상, 식별문자를 입력하면 AI가 의약품을 찾아드립니다. 외관 기반 의약품 검색 서비스.",
  keywords: ["의약품 식별", "약 검색", "알약 찾기", "의약품 챗봇", "약 모양 검색"],
  openGraph: {
    title: "AI 의약품 식별 챗봇",
    description: "약의 모양, 색상, 식별문자로 의약품을 찾아드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "AI 의약품 식별 챗봇",
  },
  twitter: {
    card: "summary",
    title: "AI 의약품 식별 챗봇",
    description: "약의 모양, 색상, 식별문자로 의약품을 찾아드립니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
