import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        const result = await login(email, password);
        if (result.success) {
            console.log('Login successful');
            // TODO: Redirect to dashboard or home
        } else {
            console.error('Login failed:', result.error);
        }
    };

    const styles = {
        container: { 
            position: 'relative',
            display: 'flex', 
            minHeight: '100vh', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontFamily: 'Segoe UI, sans-serif',
            overflow: 'hidden'
        },
        backgroundLeft: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)'
        },
        backgroundRight: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#38bdf8',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
        },
        blurLine: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(-29.5deg, transparent 42%, rgba(255, 255, 255, 0.2) 50%, transparent 51%)',
            filter: 'blur(2px)',
            zIndex: 0
        },
        form: { 
            backgroundColor: '#1e293b', 
            padding: '40px', 
            borderRadius: '8px', 
            width: '400px', 
            color: '#38bdf8',
            zIndex: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        },
        title: { 
            textAlign: 'center', 
            marginBottom: '20px', 
            fontSize: '24px' 
        },
        input: { 
            width: '100%', 
            padding: '10px', 
            marginBottom: '15px', 
            border: 'none', 
            borderRadius: '4px', 
            backgroundColor: '#334155', 
            color: '#38bdf8' 
        },
        button: { 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#38bdf8', 
            color: '#0f172a', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
        },
        registerText: {
            textAlign: 'center',
            marginTop: '15px',
            fontSize: '14px',
            color: '#38bdf8',
            cursor: 'pointer'
        },
        link: {
            color: '#38bdf8',
            textDecoration: 'underline',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundLeft}></div>
            <div style={styles.backgroundRight}></div>
            <div style={styles.blurLine}></div>
            <div style={styles.form}>
                <h2 style={styles.title}>Iniciar sesión</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={styles.input} 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={styles.input} 
                />
                <button onClick={handleLogin} style={styles.button} disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <p style={styles.registerText}>
                    ¿No tienes cuenta? <Link to="/register" style={styles.link}>Registrarse</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
