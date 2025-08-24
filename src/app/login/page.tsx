'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Si "Confirm email" está OFF, ya habrá sesión: guardamos alias en profiles (opcional)
        const { data: { user } } = await supabase.auth.getUser();
        if (user && alias.trim()) {
          await supabase.from('profiles').upsert({ id: user.id, alias }, { onConflict: 'id' });
        }
        router.replace('/');
      }
    } catch (err: any) {
      setMsg(err.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>Plataforma de Test</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('signin')} disabled={mode === 'signin'}>Entrar</button>
        <button onClick={() => setMode('signup')} disabled={mode === 'signup'}>Crear cuenta</button>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/>
        </label>
        {mode==='signup' && (
          <label>Alias (opcional)
            <input type="text" value={alias} onChange={e=>setAlias(e.target.value)} minLength={3} maxLength={30}/>
          </label>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando…' : (mode==='signin' ? 'Entrar' : 'Crear cuenta')}
        </button>
        {msg && <p style={{ color:'crimson' }}>{msg}</p>}
      </form>
    </main>
  );
}
