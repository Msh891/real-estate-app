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
    const { error } = await supabase.from('listings').insert([{ 
      ...form, 
      broker_email: localStorage.getItem('brokerEmail') 
    }]);

    if (error) alert(error.message);
    else {
      alert("Success!");
      router.push('/');
    }
  };

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Verifying Broker Status...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Post a Unit</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Title" required style={inp} onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Price" type="number" required style={inp} onChange={e => setForm({...form, price: e.target.value})} />
        <input placeholder="Location" required style={inp} onChange={e => setForm({...form, location: e.target.value})} />
        <textarea placeholder="Description" required style={inp} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Publish</button>
      </form>
    </div>
  );
}
const inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc' };