import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

export interface WelcomeBannerProps {
  onNewAssessment: () => void;
}

export function WelcomeBanner({ onNewAssessment }: WelcomeBannerProps) {
  return (
    <section className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-kicker">
          <ShieldCheck size={15} /> CLAIMS ASSURANCE WORKSPACE
        </div>
        <h2>Evidence that earns confidence.</h2>
        <p>
          Bring scientific evidence and product claims together. Get structured
          AI-assisted insights to support informed human review.
        </p>
        <button className="banner-button" onClick={onNewAssessment}>
          Assess a new claim <ArrowRight size={15} />
        </button>
      </div>
      <div className="banner-art" aria-hidden="true">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-orbit orbit-three" />
        <div className="art-core">
          <FlaskConical size={42} strokeWidth={1.2} />
        </div>
        <div className="art-chip chip-top">
          <CheckCircle2 size={16} /> Evidence
        </div>
        <div className="art-chip chip-bottom">
          <Activity size={16} /> AI analysis
        </div>
      </div>
    </section>
  );
}

