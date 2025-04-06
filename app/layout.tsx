import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { SITE_URL } from "@/lib/utils"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "I am so LOCKED IN that I built a platform to help me Lock IN more😂",
  description:
    "Lock in your goals with our interactive platform! Stay motivated, share commitments, and track progress with the community.",
  keywords:
    "lock in, goals, motivation, productivity, focus, commitment, goal setting, interactive platform, progress tracking, community, success",
  openGraph: {
    title: "I am so LOCKED IN that I built a platform to help me Lock IN more😂",
    description:
      "Lock in your goals with our interactive platform! Share your hustle and track progress with a vibrant community.",
    images: [{
      url: SITE_URL.concat("/og-image.svg"),
      alt: "LOCK IN: Where your vibe meets the chat",
    }],
    type: "website",
    siteName: "LOCK IN",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "I am so LOCKED IN that I built a platform to help me Lock IN more😂",
    description:
      "Goals? Locked. Join LOCK IN to stay motivated, track wins, and vibe with the community!",
    images: [{
      url: SITE_URL.concat("/og-image.svg"),
      alt: "LOCK IN",
    }],
    creator: "@zufichris",
    site: "@lock_in_site",
  },
};


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


