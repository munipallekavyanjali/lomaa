import React, { useState, useEffect } from 'react';
import { Plus, Database, Volume2, VolumeX, NotebookPen, Clock, LogOut, KeyRound, User } from 'lucide-react';
import { isSoundEnabled, toggleSound, playGlassClick, playBubblePop } from '../utils/soundEffects';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenNewTask, onOpenDBeaverGuide, onOpenAuthModal }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playGlassClick();
  };

  const handleLogout = () => {
    playBubblePop();
    logout();
  };

  return (
    <header className="liquid-glass-panel" style={{
      margin: '20px auto',
      maxWidth: '1280px',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Brand & Retro Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.8), rgba(0, 240, 255, 0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <NotebookPen size={24} color="#ffffff" />
        </div>
        <div>
          <h1 className="retro-title" style={{ fontSize: '1.45rem', lineHeight: 1.1, margin: 0 }}>
            LOMAA<span style={{ color: 'var(--retro-cyan)', fontSize: '0.85em' }}>•TASKFLOW</span>
          </h1>
          <p style={{
            fontSize: '0.74rem',
            color: 'rgba(255, 255, 255, 0.55)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '2px 0 0 0'
          }}>
            Manage your tasks with retro vibes
          </p>
        </div>
      </div>

      {/* Center Vintage Digital Clock */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '999px',
        background: 'rgba(15, 12, 34, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <Clock size={15} color="var(--retro-cyan)" />
        <span className="retro-mono" style={{ fontSize: '0.82rem', color: '#c7d2fe' }}>
          {time}
        </span>
      </div>

      {/* Right Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Sound toggle button */}
        <button
          onClick={handleSoundToggle}
          className="liquid-btn liquid-btn-icon"
          title={soundOn ? 'Mute Sound Effects' : 'Enable Liquid Sound Effects'}
          style={{ width: '40px', height: '40px' }}
        >
          {soundOn ? <Volume2 size={18} color="var(--retro-cyan)" /> : <VolumeX size={18} color="rgba(255,255,255,0.4)" />}
        </button>

        {/* DBeaver / DB Guide Button */}
        {/* <button
          onClick={() => {
            playGlassClick();
            onOpenDBeaverGuide();
          }}
          className="liquid-btn"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          title="View SQLite database path and DBeaver connection guide"
        >
          <Database size={16} color="var(--retro-mint)" />
          <span>DBeaver DB</span>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00f5d4',
            boxShadow: '0 0 8px #00f5d4'
          }} />
        </button> */}

        {/* User JWT Profile or Login Button */}
        {isAuthenticated && user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 6px 4px 12px',
            borderRadius: '999px',
            background: 'rgba(18, 14, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)'
          }}>
            {/* Avatar aura dot */}
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: `var(--${user.avatar_color || 'retro-cyan'}, #00f0ff)`,
              boxShadow: `0 0 10px var(--${user.avatar_color || 'retro-cyan'}, #00f0ff)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.74rem',
              color: '#0a0818'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>

            <span style={{
              fontSize: '0.86rem',
              fontWeight: 600,
              color: '#ffffff',
              maxWidth: '110px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.username}
            </span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="liquid-btn liquid-btn-icon"
              style={{ width: '30px', height: '30px' }}
              title="Logout from JWT Session"
            >
              <LogOut size={13} color="rgba(255, 255, 255, 0.65)" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              playGlassClick();
              onOpenAuthModal();
            }}
            className="liquid-btn liquid-btn-cyan"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <KeyRound size={15} />
            <span>Sign In</span>
          </button>
        )}

        {/* Create Task Button */}
        <button
          onClick={() => {
            playGlassClick();
            if (!isAuthenticated) {
              onOpenAuthModal();
            } else {
              onOpenNewTask();
            }
          }}
          className="liquid-btn liquid-btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Plus size={19} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
