import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LOCK IN - Goal Setting & Motivation App",
  description:
    "Set your goals, lock in, and stay motivated with our interactive goal setting platform. Share your commitments and track your progress.",
  keywords: "lock in, goals, motivation, productivity, focus, commitment, goal setting",
  openGraph: {
    title: "LOCK IN - Goal Setting & Motivation App",
    description: "Set your goals, lock in, and stay motivated with our interactive goal setting platform.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCK IN - Goal Setting & Motivation App",
    description: "Set your goals, lock in, and stay motivated with our interactive goal setting platform.",
    images: ["/og-image.png"],
    creator: "@zufichris_",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import { ThemeProvider } from "next-themes"
