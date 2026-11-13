import React from 'react';
import { Calendar, CheckCircle2, CircleDot, Clock, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { playWaterDrop, playTaskCompleteSound, playGlassClick } from '../utils/soundEffects';

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const {
    id,
    title,
    description,
    status,
    priority,
    category,
    due_date,
    color_tag = 'retro-violet'
  } = task;

  // Cycle status: pending -> in_progress -> completed -> pending
  const handleCycleStatus = (e) => {
    e.stopPropagation();
    let nextStatus = 'in_progress';
    if (status === 'pending') {
      nextStatus = 'in_progress';
      playWaterDrop();
    } else if (status === 'in_progress') {
      nextStatus = 'completed';
      playTaskCompleteSound();
    } else {
      nextStatus = 'pending';
      playWaterDrop();
    }
    onStatusChange(id, nextStatus);
  };

  // Due date formatting and overdue check
  let formattedDate = null;
  let isOverdue = false;
  let isToday = false;

  if (due_date) {
    const todayStr = new Date().toISOString().split('T')[0];
    isOverdue = due_date < todayStr && status !== 'completed';
    isToday = due_date === todayStr;

    try {
      const parts = due_date.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else {
        formattedDate = due_date;
      }
    } catch {
      formattedDate = due_date;
    }
  }

  return (
    <div
      className={`liquid-glass-panel liquid-glass-interactive tag-${color_tag}`}
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '220px'
      }}
    >
      {/* Top glowing liquid color strip */}
      <div className="liquid-accent-strip" />

      {/* Header: Category & Priority & Status Badge */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          gap: '8px'
        }}>
          {/* Category Pill */}
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--tag-color, var(--retro-cyan))',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            {category}
          </span>

          {/* Priority Pill */}
          <span className={`liquid-badge priority-${priority}`}>
            <span className="status-pulsing-dot" />
            {priority}
          </span>
        </div>

        {/* Task Title */}
        <h3 style={{
          fontSize: '1.18rem',
          fontWeight: 700,
          lineHeight: 1.35,
          color: status === 'completed' ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
          textDecoration: status === 'completed' ? 'line-through' : 'none',
          marginBottom: '8px',
          letterSpacing: '-0.01em',
          wordBreak: 'break-word'
        }}>
          {title}
        </h3>

        {/* Task Description */}
        {description && (
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.5,
            color: status === 'completed' ? 'rgba(255, 255, 255, 0.38)' : 'rgba(255, 255, 255, 0.72)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '14px',
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Left: Due Date or Quick Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {formattedDate && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '8px',
              background: isOverdue ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: isOverdue ? 'var(--retro-coral)' : (isToday ? 'var(--retro-gold)' : 'rgba(255, 255, 255, 0.6)'),
              border: `1px solid ${isOverdue ? 'rgba(255, 51, 102, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`
            }}>
              <Calendar size={13} />
              <span>{isOverdue ? `Overdue (${formattedDate})` : (isToday ? 'Due Today' : formattedDate)}</span>
            </div>
          )}

          {/* Quick Status Cycle Button */}
          <button
            onClick={handleCycleStatus}
            className={`liquid-badge badge-${status}`}
            title="Click to advance status"
            style={{ cursor: 'pointer', border: '1px solid' }}
          >
            {status === 'completed' && <CheckCircle2 size={13} />}
            {status === 'in_progress' && <Clock size={13} />}
            {status === 'pending' && <CircleDot size={13} />}
            <span>{status.replace('_', ' ')}</span>
            <ArrowRight size={11} style={{ opacity: 0.6 }} />
          </button>
        </div>

        {/* Right: Edit & Delete buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playGlassClick();
              onEdit(task);
            }}
            className="liquid-btn liquid-btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Edit Task"
          >
            <Edit3 size={14} color="rgba(255, 255, 255, 0.85)" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="liquid-btn liquid-btn-icon liquid-btn-danger"
            style={{ width: '32px', height: '32px' }}
            title="Delete Task"
          >
            <Trash2 size={14} color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  );
}
