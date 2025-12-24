'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListing() {
  const [form, setForm] = useState({ title: '', price: '', location: '', description: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('brokerEmail');
    if (!email) { router.push('/signup'); return; }
    const checkStatus = async () => {
      const { data } = await supabase.from('brokers').select('status').eq('email', email).single();
      if (data?.status === 'approved') setLoading(false);
      else { alert("Not approved"); router.push('/'); }
    };
    checkStatus();
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('listings').insert([
      { 
        title: form.title, 
        price: parseFloat(form.price), 
        location: form.location, 
        description: form.description, 
        phone: form.phone,
        broker_email: localStorage.getItem('brokerEmail') 
      }
    ]);
    if (error) alert(error.message);
    else { alert("Unit Live!"); router.push('/'); }
  };

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Loading...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Post Unit (Owner Side)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input placeholder="Unit Title" required style={inp} onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Price" type="number" required style={inp} onChange={e => setForm({...form, price: e.target.value})} />
        <input placeholder="Location" required style={inp} onChange={e => setForm({...form, location: e.target.value})} />
        <input placeholder="Your WhatsApp Number (e.g. 2010...)" required style={inp} onChange={e => setForm({...form, phone: e.target.value})} />
        <textarea placeholder="Details" required style={{...inp, height: '80px'}} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ padding: '15px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Unit</button>
      </form>
    </div>
  );
}
const inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', color: 'black' };