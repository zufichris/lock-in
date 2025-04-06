import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
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
    images: ["https://lock-in-pink.vercel.app/og-image.png"],
    type: "website",
    siteName: "LOCK IN",
    url: "https://lock-in-pink.vercel.app",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCK IN - Set Goals & Stay Motivated 😂",
    description:
      "Goals? Locked. Join LOCK IN to stay motivated, track wins, and vibe with the community!",
    images: ["https://lock-in-pink.vercel.app/og-image.png"],
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


