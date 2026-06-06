import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "百科问答 - 探索知识的乐趣",
  description: "涵盖历史、地理、天文、生活常识的百科问答平台",
};

const navLinks = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/life-hacks", label: "生活常识", icon: "💡" },
  { href: "/history", label: "历史", icon: "📜" },
  { href: "/geography", label: "地理", icon: "🌍" },
  { href: "/astronomy", label: "天文", icon: "🔭" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-100 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-lg">📚</span>
              <span>百科问答</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 px-3 py-1.5 rounded-md transition-all"
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/60 py-6 text-center">
          <p className="text-xs text-zinc-500">
            百科问答 — 探索知识的乐趣
          </p>
        </footer>
      </body>
    </html>
  );
}
