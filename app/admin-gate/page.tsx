'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGate() {
  const [password, setPassword] = useState(''); 
  const router = useRouter();

  const handleUnlock = (e: React.FormEvent) => {
    // TRUTH: This line below is the most important. It stops the page from resetting.
    e.preventDefault(); 

    if (password === "Egypt2025") { 
      localStorage.setItem('adminKey', 'true');
      router.push('/ops');
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleUnlock} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>🔐 Admin Access</h2>
        <input 
          type="password" 
          placeholder="Enter Password"
          style={{ padding: '12px', width: '250px', borderRadius: '8px', border: '1px solid #ddd', display: 'block', marginBottom: '15px' }}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          type="submit"
          style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}