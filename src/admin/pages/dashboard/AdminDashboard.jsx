import React from 'react';

const AdminDashboard = () => {
    return (
        <div style={styles.dashboard}>
            <h2 style={styles.header}>Panel de Control Principal</h2>

            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3>Total Productos</h3>
                    <p style={styles.number}>1,250</p>
                    <span style={{ color: 'green' }}>+5% este mes</span>
                </div>

                <div style={{ ...styles.card, borderLeft: '5px solid orange' }}>
                    <h3>Alertas de Stock</h3>
                    <p style={styles.number}>12</p>
                    <span style={{ color: 'orange' }}>Requieren atención</span>
                </div>

                <div style={styles.card}>
                    <h3>Ventas de Hoy</h3>
                    <p style={styles.number}>$4,500</p>
                    <span style={{ color: 'green' }}>Normal</span>
                </div>
            </div>

            <div style={styles.chartPlaceholder}>
                <p>Gráfico de Rendimiento Mensual (Placeholder)</p>
            </div>
        </div>
    );
};

const styles = {
    dashboard: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' },
    header: { color: '#333', marginBottom: '20px' },
    grid: { display: 'flex', gap: '20px', marginBottom: '30px' },
    card: { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    number: { fontSize: '32px', fontWeight: 'bold', margin: '10px 0' },
    chartPlaceholder: { backgroundColor: '#e9e9e9', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#888', border: '2px dashed #ccc' }
};

export default AdminDashboard;