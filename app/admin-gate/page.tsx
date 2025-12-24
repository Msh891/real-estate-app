'use client'

import React, { useState } from 'react';

export default function AdminGate() {
  const [pass, setPass] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const checkPass = () => {
    if (pass === "Ops2025") { // You can change this password
      localStorage.setItem('admin_access', 'true');
      setAuthorized(true);
      alert("Access Granted");
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🔐 Admin Access</h1>
      <input 
        type="password" 
        placeholder="Enter Password" 
        onChange={(e) => setPass(e.target.value)}
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button onClick={checkPass} style={{ marginLeft: '10px', padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Unlock
      </button>
      {authorized && <p style={{color: 'green', marginTop: '20px'}}>✅ You can now access /ops and /admin</p>}
    </div>
  );
}