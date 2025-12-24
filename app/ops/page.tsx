'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://vouwxpzkyqtsqslxkhwf.supabase.co", 
  "sb_publishable_iYnq09GE5Wa1Tjq7YQIH3w_ploK2Rok"
);

export default function OpsDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_access');
    if (isAuth !== 'true') {
      window.location.href = '/admin-gate'; 
    } else {
      fetchReports();
    }
  }, []);

  async function fetchReports() {
    const { data } = await supabase
      .from('reports')
      .select('id, status, reported_at, listings(id, compound_name, rent_price, is_active)')
      .eq('status', 'pending');
    if (data) setReports(data);
    setLoading(false);
  }

  async function handleAction(reportId: string, listingId: string, action: 'remove' | 'keep') {
    if (action === 'remove') {
      await supabase.from('listings').update({ is_active: false }).eq('id', listingId);
    }
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);
    alert("Action completed.");
    fetchReports();
  }

  if (loading) return <div style={{padding: '50px'}}>Checking authorization...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🚨 Ops Dashboard</h1>
      <p>Manage reported listings below:</p>
      
      {reports.map((r) => (
        <div key={r.id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{r.listings?.compound_name}</strong>
            <div style={{ fontSize: '14px', color: '#666' }}>{r.listings?.rent_price} EGP</div>
          </div>
          <div>
            <button onClick={() => handleAction(r.id, r.listings.id, 'remove')} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Remove</button>
            <button onClick={() => handleAction(r.id, r.listings.id, 'keep')} style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Ignore</button>
          </div>
        </div>
      ))}
      {reports.length === 0 && <p>No reports to show.</p>}
    </div>
  );
}