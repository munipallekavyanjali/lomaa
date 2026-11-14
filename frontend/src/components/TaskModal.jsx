import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';
import { playGlassClick, playWaterDrop } from '../utils/soundEffects';

const COLOR_TAGS = [
  { id: 'retro-violet', name: 'Violet Neon', color: 'var(--retro-purple)' },
  { id: 'retro-cyan', name: 'Cyber Cyan', color: 'var(--retro-cyan)' },
  { id: 'retro-sunset', name: 'Sunset Tangerine', color: 'var(--retro-sunset)' },
  { id: 'retro-gold', name: 'Vintage Amber', color: 'var(--retro-gold)' },
  { id: 'retro-mint', name: 'Retro Mint', color: 'var(--retro-mint)' },
  { id: 'retro-coral', name: 'Neon Coral', color: 'var(--retro-coral)' }
];

const CATEGORIES = ['General', 'Work', 'Development', 'Design', 'Creative', 'Retro Tech'];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#4cc9f0' },
  { id: 'medium', label: 'Medium', color: '#fee440' },
  { id: 'high', label: 'High', color: '#ff8500' },
  { id: 'urgent', label: 'Urgent', color: '#ff3366' }
];

// Get today's local date in YYYY-MM-DD
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TaskModal({ isOpen, onClose, onSave, task = null }) {
  const isEditing = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [colorTag, setColorTag] = useState('retro-violet');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'General');
      setStatus(task.status || 'pending');
      setDueDate(task.due_date || '');
      setColorTag(task.color_tag || 'retro-violet');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setStatus('pending');
      setDueDate('');
      setColorTag('retro-violet');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const todayStr = getTodayDateString();
    if (dueDate && dueDate < todayStr) {
      setError('Due date cannot be in the past. Please select today or a future date.');
      return;
    }

    playWaterDrop();
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      status,
      due_date: dueDate || null,
      color_tag: colorTag
    });
  };

  const todayDate = getTodayDateString();

  return (
    <div className="liquid-modal-overlay" onClick={onClose}>
      <div
        className="liquid-glass-panel liquid-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px', position: 'relative' }}
      >
        {/* Top Liquid Color Accent */}
        <div className={`liquid-accent-strip tag-${colorTag}`} />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.4), rgba(0, 240, 255, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Sparkles size={18} color="#00f0ff" />
            </div>
            <div>
              <h2 className="retro-title" style={{ fontSize: '1.35rem', margin: 0 }}>
                {isEditing ? 'Edit Liquid Task' : 'Create New Retro Task'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0 0' }}>
                {isEditing ? 'Update task attributes and priority' : 'Infuse task into the liquid pipeline'}
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

        {/* Error notification */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 51, 102, 0.2)',
            border: '1px solid rgba(255, 51, 102, 0.4)',
            color: 'var(--retro-coral)',
            fontSize: '0.85rem',
            marginBottom: '18px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Task Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Task Title *
            </label>
            <input
              type="text"
              className="liquid-input"
              placeholder="e.g. Synthesize holographic tape loops..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          {/* Description input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Description / Notes
            </label>
            <textarea
              className="liquid-input"
              rows={3}
              placeholder="Provide deep details, parameters, or specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          {/* Priority Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
              Priority Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playGlassClick();
                      setPriority(p.id);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '12px',
                      border: isSelected ? `1px solid ${p.color}` : '1px solid rgba(255, 255, 255, 0.15)',
                      background: isSelected ? `${p.color}25` : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? p.color : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 14px ${p.color}40` : 'none',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Status & Due Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                Category
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="liquid-input"
                  style={{ cursor: 'pointer' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#120e28', color: '#fff' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status (if editing) or Due Date */}
            {isEditing ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="liquid-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="pending" style={{ background: '#120e28', color: '#fff' }}>Pending</option>
                  <option value="in_progress" style={{ background: '#120e28', color: '#fff' }}>In Progress</option>
                  <option value="completed" style={{ background: '#120e28', color: '#fff' }}>Completed</option>
                </select>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted, rgba(255, 255, 255, 0.7))', marginBottom: '6px' }}>
                  Due Date (Calendar)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    className="liquid-input liquid-date-input"
                    value={dueDate}
                    min={todayDate}
                    onClick={(e) => {
                      try {
                        if (e.target.showPicker) e.target.showPicker();
                      } catch (err) {}
                    }}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (error) setError('');
                    }}
                    style={{ cursor: 'pointer', paddingLeft: '40px' }}
                  />
                  <Calendar
                    size={16}
                    color="var(--retro-cyan)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle, rgba(255, 255, 255, 0.45))', marginTop: '4px', display: 'block' }}>
                  Today ({todayDate}) or future dates only
                </span>
              </div>
            )}
          </div>

          {/* If editing, show Due Date on its own row */}
          {isEditing && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted, rgba(255, 255, 255, 0.7))', marginBottom: '6px' }}>
                Due Date (Calendar)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="liquid-input liquid-date-input"
                  value={dueDate}
                  min={todayDate}
                  onClick={(e) => {
                    try {
                      if (e.target.showPicker) e.target.showPicker();
                    } catch (err) {}
                  }}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (error) setError('');
                  }}
                  style={{ cursor: 'pointer', paddingLeft: '40px' }}
                />
                <Calendar
                  size={16}
                  color="var(--retro-cyan)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle, rgba(255, 255, 255, 0.45))', marginTop: '4px', display: 'block' }}>
                Today ({todayDate}) or future dates only
              </span>
            </div>
          )}

          {/* Retro Color Theme Aura */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
              Retro Liquid Aura
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {COLOR_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    playGlassClick();
                    setColorTag(tag.id);
                  }}
                  title={tag.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: tag.color,
                    border: colorTag === tag.id ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: colorTag === tag.id ? `0 0 16px ${tag.color}` : 'none',
                    cursor: 'pointer',
                    transform: colorTag === tag.id ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '18px'
          }}>
            <button
              type="button"
              onClick={() => {
                playGlassClick();
                onClose();
              }}
              className="liquid-btn"
              style={{ padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="liquid-btn liquid-btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
