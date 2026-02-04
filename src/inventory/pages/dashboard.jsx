import React from 'react';

const InventoryDashboard = () => {
    return (
        <div>
            <div style={styles.pageHeader}>
                <div>
                    <h2 style={styles.title}>Gestión de Productos</h2>
                    <p style={styles.subtitle}>Administra el stock y las categorías.</p>
                </div>
                <button style={styles.addButton}>+ Nuevo Producto</button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.th}>SKU</th>
                            <th style={styles.th}>Producto</th>
                            <th style={styles.th}>Categoría</th>
                            <th style={styles.th}>Precio</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Estado</th>
                            <th style={styles.th}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={styles.row}>
                            <td style={styles.td}>#LP-001</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>Laptop Dell G15</td>
                            <td style={styles.td}>Electrónica</td>
                            <td style={styles.td}>$850.00</td>
                            <td style={styles.td}>15</td>
                            <td style={styles.td}><span style={styles.badgeGreen}>En Stock</span></td>
                            <td style={styles.td}><button style={styles.actionBtn}>✏️</button></td>
                        </tr>
                        <tr style={styles.row}>
                            <td style={styles.td}>#MS-204</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>Mouse Logitech</td>
                            <td style={styles.td}>Accesorios</td>
                            <td style={styles.td}>$25.00</td>
                            <td style={styles.td}>0</td>
                            <td style={styles.td}><span style={styles.badgeRed}>Agotado</span></td>
                            <td style={styles.td}><button style={styles.actionBtn}>✏️</button></td>
                        </tr>
                        <tr style={styles.row}>
                            <td style={styles.td}>#KB-101</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>Teclado Mecánico</td>
                            <td style={styles.td}>Periféricos</td>
                            <td style={styles.td}>$120.00</td>
                            <td style={styles.td}>4</td>
                            <td style={styles.td}><span style={styles.badgeOrange}>Bajo Stock</span></td>
                            <td style={styles.td}><button style={styles.actionBtn}>✏️</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { margin: 0, color: '#1e293b' },
    subtitle: { margin: 0, color: '#64748b', fontSize: '14px' },
    addButton: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' },
    tableContainer: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    headerRow: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
    th: { padding: '16px', color: '#475569', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' },
    row: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px', color: '#334155', fontSize: '14px' },
    badgeGreen: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    badgeRed: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    badgeOrange: { backgroundColor: '#ffedd5', color: '#9a3412', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }
};

export default InventoryDashboard;