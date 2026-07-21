import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AntiGravity Studio - No-Code AI Website Builder",
  description: "Deploy a fully functional, production-ready, and breathtakingly beautiful website builder using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-slate-950 text-slate-50 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
