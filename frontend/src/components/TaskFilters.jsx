import React from 'react';
import { Search, X, LayoutGrid, Columns3, SlidersHorizontal } from 'lucide-react';
import { playGlassClick } from '../utils/soundEffects';

const CATEGORIES = ['All', 'Work', 'Development', 'Design', 'Creative', 'Retro Tech', 'General'];
const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export default function TaskFilters({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange
}) {
  const handleStatusChange = (status) => {
    playGlassClick();
    onFilterChange({ ...filters, status });
  };

  const handleCategoryChange = (category) => {
    playGlassClick();
    onFilterChange({ ...filters, category: category === 'All' ? 'all' : category });
  };

  const handlePriorityChange = (e) => {
    playGlassClick();
    onFilterChange({ ...filters, priority: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const clearSearch = () => {
    playGlassClick();
    onFilterChange({ ...filters, search: '' });
  };

  return (
    <div className="liquid-glass-panel" style={{
      maxWidth: '1280px',
      margin: '0 auto 24px auto',
      padding: '18px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top row: Search input, Status Tabs, and View Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search
            size={18}
            color="rgba(255, 255, 255, 0.5)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="liquid-input"
            style={{ paddingLeft: '40px', paddingRight: filters.search ? '36px' : '14px' }}
            placeholder="Search retro tasks..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Pill Tabs */}
        <div className="liquid-tabs-container">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={`liquid-tab ${filters.status === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Toggle (Grid vs Kanban) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              playGlassClick();
              onViewModeChange('grid');
            }}
            className={`liquid-btn liquid-btn-icon ${viewMode === 'grid' ? 'liquid-btn-primary' : ''}`}
            title="Grid View"
            style={{ width: '38px', height: '38px' }}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => {
              playGlassClick();
              onViewModeChange('kanban');
            }}
            className={`liquid-btn liquid-btn-icon ${viewMode === 'kanban' ? 'liquid-btn-primary' : ''}`}
            title="Kanban Board View"
            style={{ width: '38px', height: '38px' }}
          >
            <Columns3 size={18} />
          </button>
        </div>
      </div>

      {/* Bottom row: Category Filter Chips and Priority dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '14px'
      }}>
        {/* Category Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', marginRight: '4px' }}>
            Categories:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category === 'all' && cat === 'All') || filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--retro-cyan)' : '1px solid rgba(255, 255, 255, 0.14)',
                  background: isSelected ? 'rgba(0, 240, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#00f0ff' : 'rgba(255, 255, 255, 0.7)',
                  boxShadow: isSelected ? '0 0 14px rgba(0, 240, 255, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={14} color="rgba(255, 255, 255, 0.6)" />
          <select
            value={filters.priority}
            onChange={handlePriorityChange}
            className="liquid-input"
            style={{
              padding: '6px 14px',
              fontSize: '0.84rem',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value} style={{ background: '#120e28', color: '#fff' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
