'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setListings(data || []);
    setLoading(false);
  }

  const handleBrokerLogin = () => {
    const email = prompt("Enter your registered broker email:");
    if (email) {
      localStorage.setItem('brokerEmail', email);
      window.location.href = '/add-listing';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>Mivida Real Estate</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handleBrokerLogin} style={secondaryBtn}>Broker Login</button>
          <Link href="/signup"><button style={secondaryBtn}>Join as Broker</button></Link>
          <Link href="/admin-gate"><button style={primaryBtn}>Admin</button></Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Available Units</h2>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {loading ? <p>Loading...</p> : listings.map((item: any) => (
          <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3>{item.title}</h3>
            <p style={{ color: '#0070f3', fontWeight: 'bold' }}>{Number(item.price).toLocaleString()} EGP</p>
            <p style={{ fontSize: '14px', color: '#666' }}>📍 {item.location}</p>
            <button onClick={() => alert(`Contact: ${item.broker_email}`)} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Contact Broker</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const primaryBtn = { padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const secondaryBtn = { padding: '10px 20px', background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' };