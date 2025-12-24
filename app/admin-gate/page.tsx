'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGate() {
  const [password, setPassword] = useState(''); 
  const router = useRouter();

  const handleUnlock = () => {
    // Change "Egypt2025" to your actual desired password
    if (password === "Egypt2025") { 
      localStorage.setItem('adminKey', 'granted');
      router.push('/ops');
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>🔐 Admin Login</h2>
        <input 
          type="password" 
          placeholder="Enter Password"
          style={{ padding: '12px', width: '250px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', display: 'block', marginBottom: '15px' }}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={handleUnlock}
          style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Unlock Dashboard
        </button>
      </div>
    </div>
  );
}