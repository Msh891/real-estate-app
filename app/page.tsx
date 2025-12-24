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
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      {/* Navigation */}
      <nav style={{ padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>MIVIDA B2B NETWORK</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleBrokerLogin} style={navBtn}>Broker Login</button>
          <Link href="/signup"><button style={navBtn}>Join Network</button></Link>
          <Link href="/admin-gate"><button style={{ ...navBtn, background: '#0070f3', border: 'none' }}>Admin</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: '#333' }}>Available Inventory</h2>
        <p style={{ color: '#666' }}>Internal database for approved brokers only.</p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Fetching internal records...</p>
        ) : listings.map((item: any) => (
          <div key={item.id} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1a1a1a' }}>{item.title}</h3>
                <span style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>UNIT</span>
              </div>
              <p style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>{Number(item.price).toLocaleString()} EGP</p>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>📍 {item.location}</p>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>{item.description}</p>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>LISTING BROKER: {item.broker_email}</p>
                <button 
                  onClick={() => window.open(`mailto:${item.broker_email}?subject=Inquiry: ${item.title}`)} 
                  style={{ width: '100%', padding: '10px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Contact Listing Broker
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const navBtn = { padding: '8px 15px', background: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' };