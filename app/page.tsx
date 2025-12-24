'use client'
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>Mivida Portal</h1>
        {/* TRUTH: This link below MUST point to /admin-gate */}
        <Link href="/admin-gate">
          <button style={{ padding: '10px 18px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            Admin Access
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '15px' }}>Broker Management System</h2>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>Submit applications and manage property units.</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link href="/signup">
            <button style={{ padding: '15px 35px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Register as Broker
            </button>
          </Link>

          <button onClick={() => alert('Unit Feed is currently being built.')} style={{ padding: '15px 35px', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Browse Units
          </button>
        </div>
      </main>
    </div>
  );
}