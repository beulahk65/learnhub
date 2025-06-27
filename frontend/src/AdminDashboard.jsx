import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // ✅ declare user from localStorage

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold' }}>🎓 LearnHub</div>
        <div>
          <span style={{ marginRight: '1rem' }}>{user?.name} ({user?.role})</span>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            style={navButtonStyle}
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <div
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/7d/66/04/7d6604111a2fb44b73a4bc8b643e479d.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.65)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            color: 'white',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            👩‍💼 Admin Dashboard
          </h2>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📋 All Registered Users</h3>

          {users.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {users.map(user => (
                <li
                  key={user._id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #00BFFF',
                    borderRadius: '0.5rem',
                  }}
                >
                  <strong>{user.name}</strong> ({user.email}) —{" "}
                  <span style={{ fontStyle: 'italic', color: '#87CEFA' }}>{user.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '1rem 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  fontFamily: 'Poppins, sans-serif',
};

const navButtonStyle = {
  backgroundColor: '#fff',
  color: '#000',
  padding: '0.4rem 1rem',
  borderRadius: '0.4rem',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default AdminDashboard;
