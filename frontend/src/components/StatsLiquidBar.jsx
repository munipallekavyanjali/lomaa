import React from 'react';
import { CheckCircle2, Clock, Flame, Layers } from 'lucide-react';

export default function StatsLiquidBar({ stats = {} }) {
  const {
    total = 0,
    inProgress = 0,
    completed = 0,
    urgentOrHigh = 0,
    completionRate = 0
  } = stats;

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto 24px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px'
    }}>
      {/* 1. Total Tasks Pod */}
      <div className="liquid-glass-panel liquid-glass-interactive" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Pipeline
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'rgba(58, 134, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(58, 134, 255, 0.4)'
          }}>
            <Layers size={18} color="var(--retro-cobalt)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="retro-title" style={{ fontSize: '2.2rem' }}>{total}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>registered</span>
        </div>
      </div>

      {/* 2. In Progress Pod */}
      <div className="liquid-glass-panel liquid-glass-interactive" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Flow
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'rgba(0, 240, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 240, 255, 0.4)'
          }}>
            <Clock size={18} color="var(--retro-cyan)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="retro-title" style={{ fontSize: '2.2rem', color: 'var(--retro-cyan)' }}>{inProgress}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>in motion</span>
        </div>
      </div>

      {/* 3. Completed Pod with Liquid Progress Bar */}
      <div className="liquid-glass-panel liquid-glass-interactive" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Completed
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'rgba(0, 245, 212, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 245, 212, 0.4)'
          }}>
            <CheckCircle2 size={18} color="var(--retro-mint)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span className="retro-title" style={{ fontSize: '2.2rem', color: 'var(--retro-mint)' }}>{completed}</span>
          <span className="retro-mono" style={{ fontSize: '0.88rem', color: 'var(--retro-mint)', fontWeight: 700 }}>
            {completionRate}%
          </span>
        </div>
        {/* Animated wave progress track */}
        <div className="liquid-progress-track">
          <div className="liquid-progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* 4. High / Urgent Priority Pod */}
      <div className="liquid-glass-panel liquid-glass-interactive" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            High & Urgent
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'rgba(255, 51, 102, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 51, 102, 0.45)'
          }}>
            <Flame size={18} color="var(--retro-coral)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="retro-title" style={{ fontSize: '2.2rem', color: 'var(--retro-coral)' }}>{urgentOrHigh}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>needs attention</span>
        </div>
      </div>
    </div>
  );
}
