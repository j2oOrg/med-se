import { Link } from 'react-router-dom';
import { ArrowRight, Vote } from 'lucide-react';
import { electionLinks } from '../lib/site-meta';

type ElectionHubProps = {
  compact?: boolean;
  className?: string;
};

export function ElectionHub({ compact = false, className = '' }: ElectionHubProps) {
  return (
    <section className={`election-hub ${compact ? 'election-hub-compact' : ''} ${className}`}>
      <div className="election-hub-copy">
        <span className="election-icon" aria-hidden="true">
          <Vote size={24} />
        </span>
        <p className="kicker">Val 2026</p>
        <h2>Allt inför vägen till riksdagen</h2>
        {!compact ? (
          <p>
            Samlad ingång till MED:s valfrågor, riksdagslista, partiledarens budskap och granskningen av kommunernas
            ekonomi.
          </p>
        ) : null}
      </div>
      <div className="election-link-grid">
        {electionLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <span>
              <strong>{link.label}</strong>
              {!compact ? <small>{link.text}</small> : null}
            </span>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}
