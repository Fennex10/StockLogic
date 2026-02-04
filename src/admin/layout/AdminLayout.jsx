import React from 'react';
// Importamos el componente de búsqueda que está en la carpeta hermana
import AdminSearch from '../components/AdminSearch';

const AdminLayout = ({ children }) => {
    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>StockLogic 📦</div>
                <nav style={styles.nav}>
                    <div style={{ ...styles.menuItem, ...styles.active }}>📊 Dashboard</div>
                    <div style={styles.menuItem}>📦 Inventario</div>
                    <div style={styles.menuItem}>👥 Usuarios</div>
                    <div style={styles.menuItem}>⚙️ Configuración</div>
                </nav>
            </aside>
           
            <main style={styles.main}>
                <header style={styles.header}>
                    <AdminSearch /> 
                    <div style={styles.profile}>
                        <span>Hola, <strong>Admin</strong></span>
                        <div style={styles.avatar}>A</div>
                    </div>
                </header>

                <div style={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

const styles = {
    layout: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px' },
    logo: { fontSize: '22px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '40px', textAlign: 'center' },
    nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
    menuItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', transition: '0.2s' },
    active: { backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: 'bold' },
    main: { flex: 1, backgroundColor: '#f8fafc' },
    header: { height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    profile: { display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' },
    avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#38bdf8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    content: { padding: '30px' }
};

export default AdminLayout;