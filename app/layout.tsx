import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
      <body className="min-h-full flex flex-col">
        {children}
        <Script id="visitor-notify" strategy="afterInteractive">{`
          (function() {
            var w = atob('aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDBBUzQ5RVFHSkQvQjBBUksxM0JIVDUvRk1mNlZ6eGlidUdYYWRLTnQzQUR1NU1U');
            var t = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
            var r = document.referrer || '직접 접속';
            fetch('https://api.ipify.org?format=json').then(function(res) { return res.json(); }).then(function(d) {
              fetch(w, {
                method: 'POST',
                body: JSON.stringify({ text: '💊 챗봇 방문\\nIP: ' + d.ip + '\\n시간: ' + t + '\\n리퍼러: ' + r }),
                mode: 'no-cors',
              });
            }).catch(function() {
              fetch(w, {
                method: 'POST',
                body: JSON.stringify({ text: '💊 챗봇 방문\\n시간: ' + t + '\\n리퍼러: ' + r }),
                mode: 'no-cors',
              });
            });
          })();
        `}</Script>
      </body>
    </html>
  );
}
