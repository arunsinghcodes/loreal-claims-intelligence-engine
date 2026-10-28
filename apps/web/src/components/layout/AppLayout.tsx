import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface AppLayoutProps {
  activeNav: string;
  onSelectNav: (label: string) => void;
  claimsCount: number;
  onNewAssessment: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: (open: boolean) => void;
  children: React.ReactNode;
}

export function AppLayout({
  activeNav,
  onSelectNav,
  claimsCount,
  onNewAssessment,
  mobileMenuOpen,
  onToggleMobileMenu,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => onToggleMobileMenu(false)}
        />
      )}

      <Sidebar
        activeNav={activeNav}
        onSelectNav={onSelectNav}
        claimsCount={claimsCount}
        onNewAssessment={onNewAssessment}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => onToggleMobileMenu(false)}
      />

      <main className="main-area">
        <Topbar
          activeNav={activeNav}
          onOpenMobileMenu={() => onToggleMobileMenu(true)}
        />
        {children}
      </main>
    </div>
  );
}

