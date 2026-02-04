import React from 'react';

const AdminSearch = () => {
    return (
        <div style={styles.container}>
            <span style={styles.icon}>🔍</span>
            <input
                type="text"
                placeholder="Buscar en el sistema..."
                style={styles.input}
            />
        </div>
    );
};

const styles = {
    container: { display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '8px', width: '300px' },
    icon: { marginRight: '10px', color: '#64748b' },
    input: { border: 'none', background: 'transparent', outline: 'none', width: '100%', color: '#334155' }
};

export default AdminSearch;