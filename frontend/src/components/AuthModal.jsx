import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, KeyRound, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playGlassClick, playWaterDrop, playTaskCompleteSound } from '../utils/soundEffects';
import { GoogleLogin } from '@react-oauth/google';

const AVATAR_COLORS = [
  { id: 'retro-cyan', label: 'Cyber Cyan', color: 'var(--retro-cyan)' },
  { id: 'retro-violet', label: 'Neon Violet', color: 'var(--retro-purple)' },
  { id: 'retro-sunset', label: 'Sunset Tangerine', color: 'var(--retro-sunset)' },
  { id: 'retro-mint', label: 'Retro Mint', color: 'var(--retro-mint)' },
  { id: 'retro-gold', label: 'Vintage Amber', color: 'var(--retro-gold)' },
  { id: 'retro-coral', label: 'Neon Coral', color: 'var(--retro-coral)' }
];

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, googleLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarColor, setAvatarColor] = useState('retro-cyan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (newMode) => {
    playGlassClick();
    setMode(newMode);
    setError('');
  };

  const handleDemoLogin = async () => {
    playWaterDrop();
    setLoading(true);
    setError('');
    try {
      await login('retro_pilot', 'password123');
      playTaskCompleteSound();
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!identifier.trim() || !password) {
          setError('Please provide your username/email and password.');
          setLoading(false);
          return;
        }
        await login(identifier.trim(), password);
      } else {
        if (!username.trim() || !email.trim() || !password) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
          avatar_color: avatarColor
        });
      }
      playTaskCompleteSound();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
  setError('');
  setLoading(true);

  try {
    await googleLogin(credentialResponse.credential);
    playTaskCompleteSound();
    onClose();
  } catch (err) {
    setError(err.message || 'Google sign-in failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="liquid-modal-overlay" onClick={onClose}>
      <div
        className="liquid-glass-panel liquid-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', padding: '32px', position: 'relative' }}
      >
        {/* Accent Strip */}
        <div className="liquid-accent-strip" style={{
          background: 'linear-gradient(90deg, var(--retro-magenta), var(--retro-cyan), var(--retro-gold))'
        }} />

        {/* Modal Header */}
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
              background: 'linear-gradient(135deg, rgba(247, 37, 133, 0.4), rgba(0, 240, 255, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.35)'
            }}>
              <KeyRound size={20} color="var(--retro-cyan)" />
            </div>
            <div>
              <h2 className="retro-title" style={{ fontSize: '1.35rem', margin: 0 }}>
                {mode === 'login' ? 'SIGN IN' : 'Create Identity'}
              </h2>
              {/* <p style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.55)', margin: '2px 0 0 0' }}>
                JWT Secure • Liquid Session Engine
              </p> */}    
            </div>
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

        {/* 1-Click Quick Demo Login Pill */}
        {/* <div style={{
          marginBottom: '20px',
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--retro-cyan)' }}>
              <Zap size={14} />
              <span>Instant Test Access</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.55)', margin: '2px 0 0 0' }}>
              Sign in as seeded pilot <code>retro_pilot</code>
            </p>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="liquid-btn liquid-btn-cyan"
            style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            <span>1-Click Demo</span>
            <ArrowRight size={13} />
          </button>
        </div> */}

        {/* Mode Switcher Tabs */}
        <div className="liquid-tabs-container" style={{ width: '100%', marginBottom: '20px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`liquid-tab ${mode === 'login' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`liquid-tab ${mode === 'register' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Register Account
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
            fontSize: '0.84rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'login' ? (
            /* Login Fields */
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="liquid-input"
                    placeholder="e.g. retro_pilot or pilot@taskflow.dev"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="liquid-input"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Register Fields */
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Choose Username
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="liquid-input"
                    placeholder="e.g. cyber_vibe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="liquid-input"
                    placeholder="name@synthwave.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                  Password (min 6 chars)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="liquid-input"
                    placeholder="Create a strong password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Avatar Aura Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                  Select Retro Avatar Aura
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {AVATAR_COLORS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        playGlassClick();
                        setAvatarColor(av.id);
                      }}
                      title={av.label}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: av.color,
                        border: avatarColor === av.id ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: avatarColor === av.id ? `0 0 16px ${av.color}` : 'none',
                        cursor: 'pointer',
                        transform: avatarColor === av.id ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="liquid-btn liquid-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Go To TaskManagement' : 'Create & Dive'}</span>
          </button>
        </form>
        {mode === 'login' && (
  <div style={{ marginTop: '18px' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '0.78rem'
    }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
      OR CONTINUE WITH
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
    </div>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Google sign-in failed. Please try again.')}
        theme="filled_black"
        shape="pill"
        size="large"
        text="continue_with"
        width="300"
      />
    </div>
  </div>
)}
      </div>
    </div>
  );
}
