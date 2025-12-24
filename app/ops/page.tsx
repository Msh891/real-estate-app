'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function OpsDashboard() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // SECURITY CHECK: If no admin key, kick them out
    const isAdmin = localStorage.getItem('adminKey');
    if (!isAdmin) {
      router.push('/admin-gate');
      return;
    }
    fetchBrokers();
  }, []);

  async function fetchBrokers() {
    const { data } = await supabase.from('brokers').select('*').order('created_at', { ascending: false });
    setBrokers(data || []);
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('brokers').update({ status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    else fetchBrokers(); // Refresh list
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading applicants...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>📋 Broker Applications</h1>
        <button onClick={() => { localStorage.removeItem('adminKey'); router.push('/'); }} style={logoutBtn}>Logout</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={th}>Email</th>
            <th style={th}>Company</th>
            <th style={th}>Tax Card</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brokers.map((broker) => (
            <tr key={broker.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{broker.email}</td>
              <td style={td}>{broker.company_name}</td>
              <td style={td}>{broker.tax_card}</td>
              <td style={td}>
                <span style={{ padding: '4px 8px', borderRadius: '5px', fontSize: '12px', background: broker.status === 'approved' ? '#dcfce7' : '#fee2e2', color: broker.status === 'approved' ? '#166534' : '#991b1b' }}>
                  {broker.status}
                </span>
              </td>
              <td style={td}>
                <button onClick={() => updateStatus(broker.id, 'approved')} style={approveBtn}>Approve</button>
                <button onClick={() => updateStatus(broker.id, 'rejected')} style={rejectBtn}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {brokers.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No applications found.</p>}
    </div>
  );
}

const th = { padding: '15px' };
const td = { padding: '15px' };
const logoutBtn = { padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const approveBtn = { marginRight: '10px', padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const rejectBtn = { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };