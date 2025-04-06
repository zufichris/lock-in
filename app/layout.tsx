import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SITE_URL } from "@/components/particle-background"
import { ThemeProvider } from "next-themes"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("/", SITE_URL),
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
    images: ["/og-image.png"],
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


