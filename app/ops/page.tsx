'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function OpsDashboard() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminKey');
    if (isAdmin !== 'true') {
      router.push('/admin-gate');
      return;
    }
    fetchBrokers();
  }, []);

  async function fetchBrokers() {
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    setBrokers(data || []);
    setLoading(false);
  }

  async function updateStatus(id: any, newStatus: string) {
    const { error } = await supabase
      .from('brokers')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) alert(error.message);
    else fetchBrokers(); 
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button 
          onClick={() => { localStorage.removeItem('adminKey'); router.push('/admin-gate'); }}
          style={{ padding: '10px', background: '#333', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{padding: '15px'}}>Email</th>
            <th style={{padding: '15px'}}>Company</th>
            <th style={{padding: '15px'}}>Status</th>
            <th style={{padding: '15px'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brokers.map((broker: any) => (
            <tr key={broker.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{padding: '15px'}}>{broker.email}</td>
              <td style={{padding: '15px'}}>{broker.company_name}</td>
              <td style={{padding: '15px'}}>
                <b style={{ color: broker.status === 'approved' ? 'green' : 'orange' }}>
                  {broker.status?.toUpperCase()}
                </b>
              </td>
              <td style={{padding: '15px'}}>
                <button onClick={() => updateStatus(broker.id, 'approved')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Approve</button>
                <button onClick={() => updateStatus(broker.id, 'rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}