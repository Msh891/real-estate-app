'use client'
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🏘️ BrokerConnect Egypt</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: 'auto' }}>
        <Link href="/feed" style={btnPrimary}>Browse Units</Link>
        <Link href="/signup" style={btnSecondary}>Register as Broker</Link>
      </div>
      <Link href="/admin-gate" style={{ display: 'block', marginTop: '40px', color: '#999' }}>Admin Login</Link>
    </div>
  );
}

const btnPrimary = { padding: '15px', background: '#0070f3', color: 'white', borderRadius: '8px', textDecoration: 'none' };
const btnSecondary = { padding: '15px', border: '2px solid #0070f3', color: '#0070f3', borderRadius: '8px', textDecoration: 'none' };