import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { SITE_URL } from "@/lib/utils"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LOCK IN - Set Goals & Stay Motivated 😂",
  description:
    "Lock in your goals with our interactive platform! Stay motivated, share commitments, and track progress with the community.",
  keywords:
    "lock in, goals, motivation, productivity, focus, commitment, goal setting, interactive platform, progress tracking, community, success",
  openGraph: {
    title: "LOCK IN - Set Goals & Stay Motivated 😂",
    description:
      "Lock in your goals with our interactive platform! Share your hustle and track progress with a vibrant community.",
    images: [{
      url: SITE_URL.concat("/og-image.png"),
      width: 1200,
      height: 630,
      alt: "AnonChat: Where your vibe meets the chat",
    }],
    type: "website",
    siteName: "LOCK IN",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCK IN - Set Goals & Stay Motivated 😂",
    description:
      "Goals? Locked. Join LOCK IN to stay motivated, track wins, and vibe with the community!",
    images: [{
      url: SITE_URL.concat("/og-image.png"),
      width: 1200,
      height: 630,
      alt: "AnonChat: Where your vibe meets the chat",
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


