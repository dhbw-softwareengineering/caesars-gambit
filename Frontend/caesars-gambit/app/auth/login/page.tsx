"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/');
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <main style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center'}}>
      <form onSubmit={submit} style={{width:320,display:'flex',flexDirection:'column',gap:8}}>
        <h2>Login</h2>
        {err && <div style={{color:'red'}}>{err}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
        <button type="button" onClick={() => router.push('/auth/register')}>Register</button>
      </form>
    </main>
  );
}
