import React, { useState, useEffect, useCallback } from 'react';
import LiquidBackground from './components/LiquidBackground';
import Navbar from './components/Navbar';
import StatsLiquidBar from './components/StatsLiquidBar';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import KanbanView from './components/KanbanView';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DBeaverGuideModal from './components/DBeaverGuideModal';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  fetchTasks,
  fetchTaskStats,
  fetchDBeaverInfo,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  updateTaskStatus as apiUpdateStatus,
  deleteTask as apiDeleteTask
} from './api/taskApi';
import { Loader2, AlertCircle, RefreshCw, Sparkles, Inbox, ShieldCheck, KeyRound, Zap } from 'lucide-react';
import { playWaterDrop, playGlassClick } from './utils/soundEffects';

function AppContent() {
  const { user, isAuthenticated, loading: authLoading, login } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem('retro_theme') || 'dark');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, urgentOrHigh: 0, completionRate: 0 });
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all', search: '' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDBeaverModalOpen, setIsDBeaverModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [dbInfo, setDbInfo] = useState(null);

  // Load tasks and stats for authenticated user
  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setStats({ total: 0, pending: 0, inProgress: 0, completed: 0, urgentOrHigh: 0, completionRate: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [tasksRes, statsRes, dbeaverRes] = await Promise.all([
        fetchTasks(filters),
        fetchTaskStats(),
        fetchDBeaverInfo().catch(() => null)
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (dbeaverRes && dbeaverRes.success) {
        setDbInfo(dbeaverRes);
      }
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        setIsAuthModalOpen(true);
      } else {
        console.error('Failed to load tasks data:', err);
        setError('Cannot connect to backend server. Ensure Express API is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load DBeaver info even when logged out
  useEffect(() => {
    fetchDBeaverInfo().then(res => {
      if (res && res.success) setDbInfo(res);
    }).catch(() => {});
  }, []);

  // Sync theme with HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('retro_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    playGlassClick();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Quick 1-click demo login helper
  const handleQuickDemo = async () => {
    playWaterDrop();
    try {
      await login('retro_pilot', 'password123');
    } catch (err) {
      alert(`Demo login error: ${err.message}`);
    }
  };

  // Handle Save (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await apiUpdateTask(editingTask.id, taskData);
        if (res.success) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data : t));
        }
      } else {
        const res = await apiCreateTask(taskData);
        if (res.success) {
          setTasks(prev => [res.data, ...prev]);
        }
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      // Refresh stats
      const statsRes = await fetchTaskStats();
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
    }
  };

  // Handle Quick Status Change
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await apiUpdateStatus(taskId, newStatus);
      const statsRes = await fetchTaskStats();
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to update status:', err);
      loadData(); // rollback
    }
  };

  // Handle Delete
  const handleDeleteTask = async (taskId) => {
    try {
      await apiDeleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setDeletingTask(null);
      const statsRes = await fetchTaskStats();
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '0 20px 60px 20px' }}>
      {/* Background with fluid blobs and cursor refraction */}
      <LiquidBackground />

      {/* Top Navbar */}
      <Navbar
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenDBeaverGuide={() => setIsDBeaverModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main style={{ position: 'relative', zIndex: 10 }}>
        {authLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '80px 0',
            color: 'var(--retro-cyan)'
          }}>
            <Loader2 size={32} className="status-pulsing-dot" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              Verifying JWT Session Signature...
            </span>
          </div>
        ) : !isAuthenticated ? (
          /* Unauthenticated Landing / Lock Screen */
          <div className="liquid-glass-panel" style={{
            maxWidth: '680px',
            margin: '40px auto',
            padding: '48px 36px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div className="liquid-accent-strip" style={{
              background: 'linear-gradient(90deg, var(--retro-cyan), var(--retro-magenta), var(--retro-gold))'
            }} />

            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.35), rgba(0, 240, 255, 0.35))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)'
            }}>
              <ShieldCheck size={36} color="var(--retro-cyan)" />
            </div>

            <h2 className="retro-title" style={{ fontSize: '1.9rem', marginBottom: '10px' }}>
Plan Smarter. Get Things Done
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: '0 auto 28px auto'
            }}>
              Bring all your tasks into one place, stay organized, track your progress, and turn your everyday goals into achievements.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              {/* Quick 1-click Demo */}
              <button
                onClick={handleQuickDemo}
                className="liquid-btn liquid-btn-cyan"
                style={{ padding: '12px 24px' }}
              >
                <Zap size={18} />
                <span>1-Click Demo Login (`retro_pilot`)</span>
              </button>

              {/* Open Auth Modal */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="liquid-btn liquid-btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <KeyRound size={18} />
                <span>Sign In or Register</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated User View */
          <>
            {/* Liquid Stats Pods */}
            <StatsLiquidBar stats={stats} />

            {/* Filters and View Switcher */}
            <TaskFilters
              filters={filters}
              onFilterChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Error notification banner if server is unreachable */}
            {error && (
              <div className="liquid-glass-panel" style={{
                maxWidth: '1280px',
                margin: '0 auto 24px auto',
                padding: '16px 24px',
                borderColor: 'rgba(255, 51, 102, 0.5)',
                background: 'rgba(255, 51, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle color="var(--retro-coral)" size={20} />
                  <span style={{ fontSize: '0.9rem', color: '#ffc2d1' }}>{error}</span>
                </div>
                <button
                  onClick={loadData}
                  className="liquid-btn"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '60px 0',
                color: 'var(--retro-cyan)'
              }}>
                <Loader2 size={28} className="status-pulsing-dot" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Refracting liquid database streams...
                </span>
              </div>
            )}

            {/* Task List / View */}
            {!loading && !error && (
              <>
                {tasks.length === 0 ? (
                  /* Empty state */
                  <div className="liquid-glass-panel" style={{
                    maxWidth: '680px',
                    margin: '40px auto',
                    padding: '50px 30px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.2), rgba(0, 240, 255, 0.2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)'
                    }}>
                      <Inbox size={32} color="var(--retro-cyan)" />
                    </div>
                    <h3 className="retro-title" style={{ fontSize: '1.4rem' }}>
                      No Liquid Tasks Found
                    </h3>
                    <p style={{ maxWidth: '420px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.priority !== 'all'
                        ? 'No tasks matched your active search or filters. Try adjusting your query.'
                        : 'Your pipeline is pristine. Create a new retro task to begin fluid progress tracking.'}
                    </p>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="liquid-btn liquid-btn-primary"
                      style={{ marginTop: '10px' }}
                    >
                      <Sparkles size={16} />
                      <span>Create First Task</span>
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  /* Fluid Grid View */
                  <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '20px'
                  }}>
                    {tasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsTaskModalOpen(true);
                        }}
                        onDelete={(t) => setDeletingTask(t)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Kanban Columns View */
                  <KanbanView
                    tasks={tasks}
                    onStatusChange={handleStatusChange}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsTaskModalOpen(true);
                    }}
                    onDelete={(t) => setDeletingTask(t)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Task Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        task={deletingTask}
      />

      {/* DBeaver Connection Guide Modal */}
      <DBeaverGuideModal
        isOpen={isDBeaverModalOpen}
        onClose={() => setIsDBeaverModalOpen(false)}
        dbInfo={dbInfo}
      />

      {/* JWT Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
