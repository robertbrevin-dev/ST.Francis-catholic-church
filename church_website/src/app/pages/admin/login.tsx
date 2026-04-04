import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signIn } from '../../../lib/auth'

const ROLES = [
  'Parish Priest',
  'Father 2',
  'Parish Secretary',
  'Treasurer',
  'Parish IT Officer',
  'Parish IT Officer 2',
]

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-brand">
        <div className="admin-login-brand-inner">
          <div className="admin-login-seal">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1.4" strokeLinecap="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <h2>St. Francis Cheptarit</h2>
          <p className="tag">Catholic Parish · Mosoriot</p>
          <p className="diocese">Diocese of Kapsabet</p>
          <div className="admin-login-roles">
            {ROLES.map((role) => (
              <div key={role} className="admin-login-role-row">
                <span className="admin-login-role-dot" />
                <span>{role}</span>
              </div>
            ))}
            <p className="admin-login-footnote">
              Only authorised parish administrators may access this area.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-login-form-col">
        <div className="admin-login-card">
          <h1>Admin sign in</h1>
          <p className="lead">Enter your credentials to open the parish console.</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-login-label" htmlFor="admin-email">
                Email address
              </label>
              <input
                id="admin-email"
                className="admin-login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
                placeholder="your@email.com"
                style={{
                  borderColor: focused === 'email' ? '#8d5439' : undefined,
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="admin-login-label" htmlFor="admin-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  className="admin-login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                  placeholder="Enter your password"
                  style={{
                    paddingRight: '2.75rem',
                    borderColor: focused === 'password' ? '#8d5439' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6e3c28',
                    padding: '4px',
                    opacity: 0.75,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fce8e8',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '1rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: '0.8125rem', color: '#991b1b' }}>{error}</span>
              </div>
            )}

            <button type="submit" className="admin-login-submit" disabled={loading || !email || !password}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ animation: 'admin-spin 1s linear infinite' }}
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign in to dashboard'
              )}
            </button>
          </form>

          <p className="admin-login-hint">
            This portal is restricted to authorised parish administrators. If you have forgotten your password, contact
            the Parish IT Officer.
          </p>
        </div>
      </div>
    </div>
  )
}
