import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "../context/AppContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProfileModal from "../components/UserProfileModal";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "EarnByApps | Discover Premium Money Earning Apps",
  description: "Explore the highest paying micro-task, gaming, survey, and passive income apps. Calculate your earnings, compare options, and complete tasks to start earning cash instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="light-theme">
        <SessionProviderWrapper>
          <AppContextProvider>
            {/* Glowing Background Orbs */}
            <div className="bg-glow-container">
              <div className="glow-orb-1"></div>
              <div className="glow-orb-2"></div>
            </div>

            {/* Global Client Navigation Header */}
            <Header />

            {/* User profile collection modal */}
            <UserProfileModal />

            {children}

            {/* Footer */}
            <Footer />
          </AppContextProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
