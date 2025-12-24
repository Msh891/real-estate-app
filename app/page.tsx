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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>Mivida Real Estate</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/signup"><button style={secondaryBtn}>Broker Join</button></Link>
          <Link href="/admin-gate"><button style={primaryBtn}>Admin</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Available Units</h2>
        <p style={{ color: '#666' }}>Browse the latest listings from our approved brokers.</p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {loading ? <p>Loading units...</p> : listings.map((item: any) => (
          <div key={item.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{item.title}</h3>
              <p style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '18px', margin: '0 0 10px 0' }}>{Number(item.price).toLocaleString()} EGP</p>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>📍 {item.location}</p>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.5', height: '45px', overflow: 'hidden' }}>{item.description}</p>
              <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }} />
              <button onClick={() => alert(`Contact broker at: ${item.broker_email}`)} style={{ width: '100%', padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                Contact Broker
              </button>
            </div>
          </div>
        ))}
      </div>
      {listings.length === 0 && !loading && <p style={{ textAlign: 'center', color: '#999' }}>No units available yet.</p>}
    </div>
  );
}

const primaryBtn = { padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const secondaryBtn = { padding: '10px 20px', background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };