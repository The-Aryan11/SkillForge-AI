import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillForge — AI-Adaptive Onboarding Engine",
  description:
    "Intelligent onboarding that parses your capabilities via resume or diagnostic and dynamically maps optimized, personalized training pathways to role-specific competency.",
  keywords: ["onboarding", "skill gap", "AI", "learning pathway", "career"],
  openGraph: {
    title: "SkillForge",
    description: "AI-Adaptive Onboarding Engine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
