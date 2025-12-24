'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://vouwxpzkyqtsqslxkhwf.supabase.co", 
  "sb_publishable_iYnq09GE5Wa1Tjq7YQIH3w_ploK2Rok"
);

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // CHANGE THIS TO YOUR SECURE PASSWORD
  const ADMIN_PASSWORD = "admin123"; 

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfiles();
    }
  }, [isAuthenticated]);

  async function fetchProfiles() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) console.error(error);
    if (data) setProfiles(data);
    setLoading(false);
  }

  async function toggleApproval(userId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ approved: !currentStatus })
      .eq('id', userId);
    if (!error) fetchProfiles();
  }

  async function viewTaxCard(userId: string) {
    const { data } = await supabase.storage.from('tax-cards').list(userId);
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('tax-cards')
        .getPublicUrl(`${userId}/${data[0].name}`);
      window.open(urlData.publicUrl, '_blank');
    } else {
      alert("No file found.");
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password");
    }
  };

  // 1. Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Admin Access</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div style={{padding: '40px'}}>Loading database...</div>;

  // 2. The Real Dashboard
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Broker Approvals</h1>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Company</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>File</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{p.company_name}</td>
              <td style={{ padding: '12px' }}>{p.email}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => viewTaxCard(p.id)}>View File</button>
              </td>
              <td style={{ padding: '12px' }}>
                {p.approved ? '✅ Approved' : '⏳ Pending'}
              </td>
              <td style={{ padding: '12px' }}>
                <button 
                  onClick={() => toggleApproval(p.id, p.approved)}
                  style={{ 
                    background: p.approved ? '#ff4d4d' : '#2ecc71', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 15px', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {p.approved ? 'Revoke' : 'Approve'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}