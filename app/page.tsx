'use client'

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1a1a1a' }}>🏘️ BrokerConnect</h1>
      <p style={{ color: '#666', marginBottom: '40px', maxWidth: '300px' }}>
        The fastest way to find and post verified rental units in Egypt.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
        <Link href="/feed" style={primaryBtn}>
          🔍 Browse Units
        </Link>
        
        <Link href="/add-listing" style={secondaryBtn}>
          ➕ Post a Unit
        </Link>
      </div>

      <Link href="/admin-gate" style={{ marginTop: '50px', color: '#999', fontSize: '12px', textDecoration: 'none' }}>
        Admin Access
      </Link>
    </div>
  );
}

const primaryBtn = {
  padding: '18px',
  background: '#0070f3',
  color: 'white',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '18px',
  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
};

const secondaryBtn = {
  padding: '18px',
  background: 'white',
  color: '#0070f3',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '18px',
  border: '2px solid #0070f3'
};