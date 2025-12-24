'use client'

import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. Direct Connection (Bypasses all .env issues)
const supabase = createClient(
  "https://vouwxpzkyqtsqslxkhwf.supabase.co", 
  "sb_publishable_iYnq09GE5Wa1Tjq7YQIH3w_ploK2Rok"
);

export default function SignupPage() {
  // 2. State Definitions (Ensures 'password' and others exist)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxCard, setTaxCard] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTaxCard(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Step A: Create the User
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw new Error(signUpError.message);
      const userId = signUpData.user?.id;
      if (!userId) throw new Error('User creation failed.');

      // Step B: Upload File
      if (!taxCard) throw new Error('Please upload a Tax Card.');
      const ext = taxCard.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}-tax-card.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('tax-cards')
        .upload(filePath, taxCard);

      if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

      // Step C: Save Profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, company_name: companyName, email: email }]);

      if (insertError) throw new Error('Profile creation failed: ' + insertError.message);

      setSuccessMsg('Success! Your brokerage account is pending approval.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Brokerage Signup</h1>
        
        {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required 
            className="w-full border p-2 rounded"
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full border p-2 rounded"
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          <input 
            type="text" placeholder="Company Name" required 
            className="w-full border p-2 rounded"
            value={companyName} onChange={e => setCompanyName(e.target.value)} 
          />
          <input 
            type="file" accept="image/*,.pdf" required 
            className="w-full border p-2 rounded"
            onChange={handleFileChange} ref={fileInputRef}
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
