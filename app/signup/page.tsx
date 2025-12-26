'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      alert(authError?.message || "Auth failed");
      setLoading(false);
      return;
    }

    // 2. Create the Company (Phase 3.1: status = pending)
    const { data: compData, error: compError } = await supabase
      .from('companies')
      .insert([{ name: companyName, status: 'pending' }])
      .select()
      .single();

    if (compError) {
      alert("Company creation failed: " + compError.message);
      setLoading(false);
      return;
    }

    // 3. Create the Profile (linking User to Company)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        company_id: compData.id,
        full_name: fullName,
        role: 'admin' // First user in company is admin
      }]);

    if (profileError) {
      alert("Profile creation failed: " + profileError.message);
    } else {
      alert("Registration successful! Check your email for a confirmation link. Your company is pending admin approval.");
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', fontFamily: 'sans-serif', border: '1px solid #eee', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center' }}>Broker Registration</h2>
      <p style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>Phase 4.2: Real Auth + Company Entity</p>
      
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input placeholder="Full Name" required style={inp} onChange={e => setFullName(e.target.value)} />
        <input placeholder="Company Name" required style={inp} onChange={e => setCompanyName(e.target.value)} />
        <input placeholder="Email" type="email" required style={inp} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password (min 6 chars)" type="password" required style={inp} onChange={e => setPassword(e.target.value)} />
        
        <button type="submit" disabled={loading} style={btn}>
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

const inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', color: 'black' };
const btn = { padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };