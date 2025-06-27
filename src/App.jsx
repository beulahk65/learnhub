import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000') // <-- calling your Express backend
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error("Error fetching from backend:", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Frontend Connected to Backend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
