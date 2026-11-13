import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { playGlassClick, playBubblePop } from '../utils/soundEffects';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, task }) {
  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    playBubblePop();
    onConfirm(task.id);
  };

  return (
    <div className="liquid-modal-overlay" onClick={onClose}>
      <div
        className="liquid-glass-panel liquid-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '28px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'rgba(255, 51, 102, 0.25)',
            border: '1px solid rgba(255, 51, 102, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255, 51, 102, 0.35)'
          }}>
            <AlertTriangle size={22} color="var(--retro-coral)" />
          </div>
          <button
            onClick={() => {
              playGlassClick();
              onClose();
            }}
            className="liquid-btn liquid-btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={15} />
          </button>
        </div>

        <h3 className="retro-title" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
          Dissolve Liquid Task?
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, marginBottom: '20px' }}>
          Are you sure you want to permanently remove <strong style={{ color: '#fff' }}>"{task.title}"</strong> from the database? This action cannot be reversed.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => {
              playGlassClick();
              onClose();
            }}
            className="liquid-btn"
            style={{ padding: '8px 18px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="liquid-btn liquid-btn-danger"
            style={{ padding: '8px 20px' }}
          >
            <Trash2 size={16} />
            <span>Dissolve Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
