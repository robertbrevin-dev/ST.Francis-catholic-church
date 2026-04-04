import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signIn } from '../../../lib/auth'

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

  const inputStyle = (name: string) => ({
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '11px 14px',
    borderRadius: '8px',
    border: focused === name ? '1.5px solid #7c4c2e' : '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    color: '#3a1f13',
    transition: 'border 0.2s',
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8efe2' }}>
      <div style={{ width: '45%', background: '#3a1f13', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #c8a84b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='#c8a84b' strokeWidth='1.5' strokeLinecap='round'><path d='M12 2v20M2 12h20'/></svg>
        </div>
        <h2 style={{ color: '#c8a84b', fontSize: '20px', fontWeight: 600, margin: '0 0 8px', textAlign: 'center' }}>St. Francis Cheptarit</h2>
        <p style={{ color: '#d9c3b0', fontSize: '13px', margin: '0 0 4px', textAlign: 'center' }}>Catholic Parish · Mosoriot</p>
        <p style={{ color: '#7c6050', fontSize: '12px', margin: '0 0 40px', textAlign: 'center' }}>Diocese of Kapsabet</p>
        <div style={{ borderTop: '1px solid #5a3020', width: '100%', paddingTop: '32px' }}>
          {['Parish Priest', 'Father 2', 'Parish Secretary', 'Treasurer', 'Parish IT Officer'].map(role => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8a84b', flexShrink: 0 }}></div>
              <span style={{ color: '#d9c3b0', fontSize: '13px' }}>{role}</span>
            </div>
          ))}
          <p style={{ color: '#7c6050', fontSize: '11px', marginTop: '20px', lineHeight: 1.6 }}>Only authorised parish administrators may access this area.</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#3a1f13', margin: '0 0 6px' }}>Admin sign in</h1>
          <p style={{ fontSize: '14px', color: '#9e8070', margin: '0 0 32px' }}>Enter your credentials to access the parish dashboard</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#3a1f13', marginBottom: '6px' }}>Email address</label>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
                placeholder='your@email.com'
                style={inputStyle('email')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#3a1f13', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                  placeholder='Enter your password'
                  style={{ ...inputStyle('password'), paddingRight: '44px' }}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e8070', padding: '2px' }}>
                  {showPassword ? (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24'/><line x1='1' y1='1' x2='23' y2='23'/></svg>
                  ) : (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fce4e4', border: '1px solid #f5c0c0', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px' }}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#a32d2d' strokeWidth='2' strokeLinecap='round'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
                <span style={{ fontSize: '13px', color: '#a32d2d' }}>{error}</span>
              </div>
            )}

            <button
              type='submit'
              disabled={loading || !email || !password}
              style={{ width: '100%', padding: '12px', background: loading || !email || !password ? '#b08060' : '#7c4c2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: loading || !email || !password ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' style={{ animation: 'spin 1s linear infinite' }}><path d='M21 12a9 9 0 11-6.219-8.56'/></svg>
                  Signing in...
                </>
              ) : 'Sign in to dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '32px', padding: '14px', background: '#fff', borderRadius: '8px', border: '0.5px solid #e0d0c0' }}>
            <p style={{ fontSize: '11px', color: '#9e8070', margin: 0, lineHeight: 1.6 }}>
              This portal is restricted to the 5 authorised parish administrators. If you have forgotten your password, contact the Parish IT Officer.
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
