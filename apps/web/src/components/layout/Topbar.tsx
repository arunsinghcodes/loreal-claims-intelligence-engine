import { Bell, ChevronRight, Menu } from "lucide-react";
import { IconButton } from "../ui/IconButton";

export interface TopbarProps {
  activeNav: string;
  onOpenMobileMenu: () => void;
}

export function Topbar({ activeNav, onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <IconButton
          className="mobile-menu-button"
          aria-label="Open navigation"
          onClick={onOpenMobileMenu}
        >
          <Menu size={20} />
        </IconButton>
        <span>Claims Intelligence</span>
        <ChevronRight size={15} />
        <strong>{activeNav}</strong>
      </div>
      <div className="topbar-actions">
        <span className="environment-pill">
          <span />
          Development
        </span>
        <IconButton
          className="notification-button"
          aria-label="Notifications"
          onClick={() => window.alert("No new notifications.")}
        >
          <Bell size={18} />
          <i />
        </IconButton>
        <div className="topbar-divider" />
        <div className="topbar-avatar">AS</div>
      </div>
    </header>
  );
}

