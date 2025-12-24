'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListing() {
  const [form, setForm] = useState({ title: '', price: '', location: '', description: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const email = localStorage.getItem('brokerEmail');
      if (!email) {
        router.push('/signup');
        return;
      }

      const { data, error } = await supabase
        .from('brokers')
        .select('status')
        .eq('email', email)
        .single();

      if (data?.status === 'approved') {
        setLoading(false);
      } else {
        alert("Account not approved yet. Please wait for admin approval.");
        router.push('/');
      }
    };
    checkStatus();
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = localStorage.getItem('brokerEmail');

    const { error } = await supabase.from('listings').insert([
      { 
        title: form.title,
        price: parseFloat(form.price), 
        location: form.location,
        description: form.description,
        broker_email: email 
      }
    ]);

    if (error) {
      alert("Database Error: " + error.message);
    } else {
      alert("Success! Unit is now live.");
      router.push('/');
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Verifying Authorization...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>🏠 Post New Unit</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input placeholder="Title" required style={inp} onChange={(e: any) => setForm({...form, title: e.target.value})} />
        <input placeholder="Price (EGP)" type="number" required style={inp} onChange={(e: any) => setForm({...form, price: e.target.value})} />
        <input placeholder="Location" required style={inp} onChange={(e: any) => setForm({...form, location: e.target.value})} />
        <textarea placeholder="Full Description" required style={{...inp, height: '100px'}} onChange={(e: any) => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Listing</button>
      </form>
    </div>
  );
}

const inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', color: 'black', fontSize: '16px' };