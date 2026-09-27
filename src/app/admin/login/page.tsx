'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl border border-stone-200">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">bababui nails</p>
          <h1 className="text-2xl font-light text-stone-800">Admin Login</h1>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
            className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full py-3 bg-stone-800 text-white text-sm rounded-lg disabled:opacity-40"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  )
}