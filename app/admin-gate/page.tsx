'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// THIS LINE FIXES THE RED PROBLEM:
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', company: '', taxCard: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('brokers').insert([
      { 
        email: form.email, 
        company_name: form.company, 
        tax_card: form.taxCard, 
        phone: form.phone,
        status: 'pending' 
      }
    ]);

    setLoading(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '40px' }}>✅</h1>
        <h2>Application Received</h2>
        <p>Admin is verifying your Tax Card. We will contact you soon.</p>
        <button onClick={() => router.push('/')} style={btnStyle}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Broker Registration</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Email" required style={inputStyle} type="email" onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Company Name" required style={inputStyle} onChange={e => setForm({...form, company: e.target.value})} />
        <input placeholder="Tax Card Number" required style={inputStyle} onChange={e => setForm({...form, taxCard: e.target.value})} />
        <input placeholder="Phone Number" required style={inputStyle} type="tel" onChange={e => setForm({...form, phone: e.target.value})} />
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Submitting...' : 'Apply for Access'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' };
const btnStyle = { padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };