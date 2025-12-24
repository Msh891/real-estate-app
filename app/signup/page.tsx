'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', company: '', taxCard: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('brokers').insert([
      { email: form.email, company_name: form.company, tax_card: form.taxCard, phone: form.phone, status: 'pending' }
    ]);

    if (error) alert(error.message);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>✅ Application Sent!</h2>
        <p>Your details are being reviewed by the Admin.</p>
        <p>You will be notified once your Tax Card is verified.</p>
        <button onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0070f3', color: 'white' }}>Return Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Broker Registration</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Email" type="email" required style={inputStyle} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Company Name" required style={inputStyle} onChange={e => setForm({...form, company: e.target.value})} />
        <input placeholder="Tax Card Number" required style={inputStyle} onChange={e => setForm({...form, taxCard: e.target.value})} />
        <input placeholder="Phone Number" required style={inputStyle} onChange={e => setForm({...form, phone: e.target.value})} />
        <button type="submit" style={btnStyle}>Submit for Approval</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' };
const btnStyle = { padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };