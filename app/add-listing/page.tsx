'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListing() {
  const [form, setForm] = useState({ title: '', price: '', location: '', description: '' });
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkBrokerStatus();
  }, []);

  async function checkBrokerStatus() {
    // TRUTH: We check the email you stored in localStorage during signup
    const userEmail = localStorage.getItem('brokerEmail');
    
    if (!userEmail) {
      alert("Please apply for access first.");
      router.push('/signup');
      return;
    }

    // FIX: Changed .where() to .eq() which is the correct Supabase syntax
    const { data, error } = await supabase
      .from('brokers')
      .select('status')
      .eq('email', userEmail)
      .eq('status', 'approved')
      .single();

    if (data) {
      setIsApproved(true);
      setLoading(false);
    } else {
      alert("Access Denied: You are not an approved broker yet.");
      router.push('/');
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('listings').insert([
      { 
        title: form.title, 
        price: form.price, 
        location: form.location, 
        description: form.description,
        broker_email: localStorage.getItem('brokerEmail') 
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Unit posted successfully!");
      router.push('/');
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Verifying Approval Status...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>🏠 Post New Unit</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input placeholder="Unit Title" style={inputStyle} onChange={(e: any) => setForm({...form, title: e.target.value})} required />
        <input placeholder="Price (EGP)" type="number" style={inputStyle} onChange={(e: any) => setForm({...form, price: e.target.value})} required />
        <input placeholder="Location" style={inputStyle} onChange={(e: any) => setForm({...form, location: e.target.value})} required />
        <textarea placeholder="Description" style={{...inputStyle, height: '100px'}} onChange={(e: any) => setForm({...form, description: e.target.value})} required />
        <button type="submit" style={btnStyle}>Publish Listing</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', color: 'black' };
const btnStyle = { padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };