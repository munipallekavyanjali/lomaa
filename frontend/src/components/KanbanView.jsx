import React from 'react';
import TaskCard from './TaskCard';
import { CircleDot, Clock, CheckCircle2 } from 'lucide-react';

export default function KanbanView({ tasks, onStatusChange, onEdit, onDelete }) {
  const columns = [
    {
      id: 'pending',
      title: 'Pending',
      icon: <CircleDot size={18} color="var(--retro-gold)" />,
      color: 'var(--retro-gold)',
      tasks: tasks.filter(t => t.status === 'pending')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock size={18} color="var(--retro-cyan)" />,
      color: 'var(--retro-cyan)',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 size={18} color="var(--retro-mint)" />,
      color: 'var(--retro-mint)',
      tasks: tasks.filter(t => t.status === 'completed')
    }
  ];

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {columns.map(col => (
        <div key={col.id} className="kanban-column">
          {/* Column Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {col.icon}
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em'
              }}>
                {col.title}
              </h3>
            </div>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: col.color,
              border: `1px solid ${col.color}40`
            }}>
              {col.tasks.length}
            </span>
          </div>

          {/* Column Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {col.tasks.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.35)',
                fontSize: '0.88rem',
                borderRadius: '16px',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                marginTop: '10px'
              }}>
                No tasks in {col.title}
              </div>
            ) : (
              col.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
