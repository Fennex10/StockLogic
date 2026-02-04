import React, { useState } from 'react';
import { Link } from 'react-router';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // TODO: Implement register logic
        console.log('Register attempt:', { email, password, confirmPassword });
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
        loginText: {
            textAlign: 'center',
            marginTop: '15px',
            fontSize: '14px',
            color: '#38bdf8'
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
            <div style={styles.form}>
                <h2 style={styles.title}>Registrarse</h2>
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
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleRegister} style={styles.button}>Registrarse</button>
                <p style={styles.loginText}>
                    ¿Ya tienes cuenta? <Link to="/" style={styles.link}>Iniciar sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
