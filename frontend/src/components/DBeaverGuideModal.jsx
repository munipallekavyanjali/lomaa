import React, { useState } from 'react';
import { Database, Copy, Check, X, ExternalLink, Terminal, HardDrive } from 'lucide-react';
import { playGlassClick } from '../utils/soundEffects';

export default function DBeaverGuideModal({ isOpen, onClose, dbInfo }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dbPath = dbInfo?.filePath || 'E:\\Tech folders\\LOMAA_practice\\task_Management\\backend\\tasks.db';

  const handleCopyPath = () => {
    playGlassClick();
    navigator.clipboard.writeText(dbPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="liquid-modal-overlay" onClick={onClose}>
      <div
        className="liquid-glass-panel liquid-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '32px' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 245, 212, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
            }}>
              <Database size={22} color="#00f5d4" />
            </div>
            <div>
              <h2 className="retro-title" style={{ fontSize: '1.35rem', margin: 0 }}>
                DBeaver Database Explorer
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', margin: '2px 0 0 0' }}>
                Connect DBeaver directly to your live SQLite database file
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playGlassClick();
              onClose();
            }}
            className="liquid-btn liquid-btn-icon"
            style={{ width: '34px', height: '34px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Database File Path Bar with 1-Click Copy */}
        <div style={{
          background: 'rgba(12, 10, 26, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '16px',
          padding: '14px 18px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--retro-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <HardDrive size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
              Database File Path (.db)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>
              SQLite 3 • WAL Mode
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <code style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: '0.84rem',
              color: '#ffffff',
              wordBreak: 'break-all',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 10px',
              borderRadius: '8px'
            }}>
              {dbPath}
            </code>

            <button
              onClick={handleCopyPath}
              className="liquid-btn liquid-btn-cyan"
              style={{ padding: '7px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Path'}</span>
            </button>
          </div>
        </div>

        {/* Step by step DBeaver connection guide */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '12px', fontWeight: 700 }}>
            Quick 4-Step Connection in DBeaver:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.72)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                background: 'rgba(247, 37, 133, 0.25)',
                color: 'var(--retro-magenta)',
                border: '1px solid rgba(247, 37, 133, 0.5)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.78rem',
                flexShrink: 0
              }}>1</span>
              <span>Launch <strong>DBeaver</strong> on your computer.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                background: 'rgba(0, 240, 255, 0.25)',
                color: 'var(--retro-cyan)',
                border: '1px solid rgba(0, 240, 255, 0.5)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.78rem',
                flexShrink: 0
              }}>2</span>
              <span>Click <strong>Database</strong> in menu bar &rarr; <strong>New Database Connection</strong> (or press the plug icon).</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                background: 'rgba(255, 183, 3, 0.25)',
                color: 'var(--retro-gold)',
                border: '1px solid rgba(255, 183, 3, 0.5)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.78rem',
                flexShrink: 0
              }}>3</span>
              <span>Select <strong>SQLite</strong> and click <strong>Next</strong>.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                background: 'rgba(0, 245, 212, 0.25)',
                color: 'var(--retro-mint)',
                border: '1px solid rgba(0, 245, 212, 0.5)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.78rem',
                flexShrink: 0
              }}>4</span>
              <span>In the <strong>Path</strong> field, paste the copied path above, then click <strong>Finish</strong>!</span>
            </div>
          </div>
        </div>

        {/* Sample SQL snippet */}
        <div style={{
          background: 'rgba(10, 8, 20, 0.55)',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '6px' }}>
            <Terminal size={13} />
            <span>Try in DBeaver SQL Editor:</span>
          </div>
          <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--retro-cyan)' }}>
            SELECT title, status, priority, category FROM tasks ORDER BY created_at DESC;
          </code>
        </div>
      </div>
    </div>
  );
}
