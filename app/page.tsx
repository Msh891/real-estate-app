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
      // This sends them to the add-listing page after they "log in"
      window.location.href = '/add-listing';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3', margin: 0 }}>Mivida Portal</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleBrokerLogin} style={navBtn}>Broker Login</button>
          <Link href="/signup"><button style={navBtn}>Join as Broker</button></Link>
          <Link href="/admin-gate"><button style={{ ...navBtn, background: '#000', color: '#fff' }}>Admin</button></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Property Feed</h2>
        <p style={{ color: '#666' }}>Browse real-time listings from approved brokers.</p>
      </div>

      {/* Listing Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Loading units...</p>
        ) : listings.length > 0 ? (
          listings.map((item: any) => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{item.title}</h3>
              <p style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '20px', margin: '0 0 5px 0' }}>{Number(item.price).toLocaleString()} EGP</p>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>📍 {item.location}</p>
              <p style={{ fontSize: '14px', color: '#444', height: '40px', overflow: 'hidden', marginBottom: '15px' }}>{item.description}</p>
              <button 
                onClick={() => alert(`Contact Broker at: ${item.broker_email}`)} 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #0070f3', background: 'transparent', color: '#0070f3', fontWeight: '600', cursor: 'pointer' }}
              >
                Contact
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#999' }}>No listings found.</p>
        )}
      </div>
    </div>
  );
}

const navBtn = { 
  padding: '8px 16px', 
  background: '#fff', 
  color: '#000', 
  border: '1px solid #ddd', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontSize: '14px', 
  fontWeight: '500' 
};