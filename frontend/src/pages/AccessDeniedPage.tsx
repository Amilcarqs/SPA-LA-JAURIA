export default function AccessDeniedPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Acceso denegado</h2>
        <p>No tienes permisos para ver esta sección.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', padding: '24px' },
  card: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' },
};
