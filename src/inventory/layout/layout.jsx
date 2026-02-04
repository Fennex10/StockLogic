import React from 'react';
import Search from '../components/Search';

const InventoryLayout = ({ children }) => {
    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>StockLogic 📦</div>
                <nav style={styles.nav}>
                    <div style={styles.menuItem}>📊 Dashboard</div>
                    <div style={{ ...styles.menuItem, ...styles.active }}>📦 Inventario</div>
                    <div style={styles.menuItem}>👥 Usuarios</div>
                    <div style={styles.menuItem}>⚙️ Configuración</div>
                </nav>
            </aside>
            
            <main style={styles.main}>
                <header style={styles.header}>
                    <Search />
                    <div style={styles.profile}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Almacén Central</span>
                        <div style={styles.avatar}>INV</div>
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
    menuItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', transition: '0.2s', display: 'flex', gap: '10px' },
    active: { backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: 'bold', borderLeft: '4px solid #38bdf8' },
    main: { flex: 1, backgroundColor: '#f8fafc' },
    header: { height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e2e8f0' },
    profile: { display: 'flex', alignItems: 'center', gap: '10px' },
    avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
    content: { padding: '30px' }
};

export default InventoryLayout;