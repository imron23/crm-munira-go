'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Save token to localStorage (Simple for now)
                localStorage.setItem('munira_token', data.token);
                localStorage.setItem('munira_user', JSON.stringify(data.user));
                router.push('/');
            } else {
                setError(data.error || 'Login gagal');
            }
        } catch (err) {
            setError('Gagal terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)',
        }}>
            <div className="glass-card login-card" style={{
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
            }}>
                <img src="/logo.png" alt="Munira" style={{ height: '60px', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '10px' }}>Login Munira World</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Masukkan akses admin Anda</p>

                <form onSubmit={handleLogin}>
                    {error && <div style={{ color: '#EF4444', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                    <div className="search-field" style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)' }}>
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="search-field" style={{ marginBottom: '25px', background: 'rgba(255,255,255,0.05)' }}>
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
