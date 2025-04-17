import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./_components/theme-provider"
import { Toaster } from "./_components/ui/sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Salão Anna Telles",
  description: "Salão Anna Telles",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex h-full flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
