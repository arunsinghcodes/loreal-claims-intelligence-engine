import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Plus,
  Settings2,
  X,
} from "lucide-react";
import { IconButton } from "../ui/IconButton";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Claims library", icon: FileText },
  { label: "Assessments", icon: FlaskConical },
];

export interface SidebarProps {
  activeNav: string;
  onSelectNav: (label: string) => void;
  claimsCount: number;
  onNewAssessment: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export function Sidebar({
  activeNav,
  onSelectNav,
  claimsCount,
  onNewAssessment,
  mobileMenuOpen,
  onCloseMobileMenu,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <FlaskConical size={21} strokeWidth={1.8} />
        </div>
        <div>
          <div className="brand-name">L'ORÉAL</div>
          <div className="brand-subtitle">CLAIMS INTELLIGENCE</div>
        </div>
        <IconButton
          className="sidebar-close"
          aria-label="Close menu"
          onClick={onCloseMobileMenu}
        >
          <X size={18} />
        </IconButton>
      </div>

      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switcher">
        <span className="workspace-avatar">R</span>
        <span className="workspace-copy">
          <strong>Research & Science</strong>
          <small>India workspace</small>
        </span>
        <ChevronDown size={15} />
      </button>

      <div className="nav-label">PLATFORM</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${activeNav === label ? "nav-item-active" : ""}`}
            onClick={() => {
              onSelectNav(label);
              onCloseMobileMenu();
            }}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {label === "Claims library" && (
              <span className="nav-count">{claimsCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="nav-label tools-label">TOOLS</div>
      <button className="nav-item" onClick={onNewAssessment}>
        <Plus size={18} />
        <span>New assessment</span>
      </button>
      <button
        className="nav-item"
        onClick={() =>
          window.alert("Settings will be added in a later milestone.")
        }
      >
        <Settings2 size={18} />
        <span>Settings</span>
      </button>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <CircleHelp size={18} />
          </div>
          <strong>Need a hand?</strong>
          <p>Learn how to review scientific claims and evidence.</p>
          <button
            onClick={() => window.alert("Documentation will be added soon.")}
          >
            Explore documentation <ArrowRight size={14} />
          </button>
        </div>

        <div className="profile">
          <div className="profile-avatar">AS</div>
          <div className="profile-copy">
            <strong>Research Scientist</strong>
            <small>Research & Science</small>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </aside>
  );
}
