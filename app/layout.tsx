import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { SITE_URL } from "@/lib/utils"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "I am so LOCKED IN that i built a site to LOCK IN more😂",
  description:
    "Set your goals, lock in, and stay motivated with our interactive goal setting platform. Share your commitments and track your progress.",
  keywords: "lock in, goals, motivation, productivity, focus, commitment, goal setting",
  openGraph: {
    title: "LOCK IN - I am so LOCKED IN that i built a site to LOCK IN more😂",
    description: "Set your goals, lock in, and stay motivated with our interactive goal setting platform.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCK IN - I am so LOCKED IN that i built a site to LOCK IN more😂",
    description: "Set your goals, lock in, and stay motivated with our interactive goal setting platform.",
    images: "https://lock-in-pink.vercel.app/og-image.png",
    creator: "@zufichris",
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


