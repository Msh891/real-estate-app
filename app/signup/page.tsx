'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', company: '', taxCard: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // TRUTH: We save the email to the browser so we can check their status later
    localStorage.setItem('brokerEmail', form.email);

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
      alert("Application sent! Once the admin approves this email, you can post units.");
      router.push('/');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Broker Registration</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Email" required style={{padding: '12px'}} type="email" onChange={(e: any) => setForm({...form, email: e.target.value})} />
        <input placeholder="Company Name" required style={{padding: '12px'}} onChange={(e: any) => setForm({...form, company: e.target.value})} />
        <input placeholder="Tax Card Number" required style={{padding: '12px'}} onChange={(e: any) => setForm({...form, taxCard: e.target.value})} />
        <input placeholder="Phone Number" required style={{padding: '12px'}} type="tel" onChange={(e: any) => setForm({...form, phone: e.target.value})} />
        <button type="submit" disabled={loading} style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Apply for Access'}
        </button>
      </form>
    </div>
  );
}