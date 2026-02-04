import React from 'react';

const Search = () => {
    return (
        <div style={styles.container}>
            <span style={styles.icon}>🔎</span>
            <input
                type="text"
                placeholder="Buscar producto por SKU o nombre..."
                style={styles.input}
            />
        </div>
    );
};

const styles = {
    container: { display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '8px', width: '350px', border: '1px solid #e2e8f0' },
    icon: { marginRight: '10px', fontSize: '14px' },
    input: { border: 'none', background: 'transparent', outline: 'none', width: '100%', color: '#334155', fontSize: '14px' }
};

export default Search;