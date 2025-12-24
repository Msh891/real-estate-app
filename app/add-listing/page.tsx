'use client'

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://vouwxpzkyqtsqslxkhwf.supabase.co", 
  "sb_publishable_iYnq09GE5Wa1Tjq7YQIH3w_ploK2Rok"
);

export default function AddListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    compound_name: '',
    rent_price: '',
    bedrooms: '',
    furnishing: 'Unfurnished',
    availability_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sending data to the 'listings' table
    const { error } = await supabase.from('listings').insert([
      { 
        compound_name: formData.compound_name,
        rent_price: parseFloat(formData.rent_price),
        bedrooms: parseInt(formData.bedrooms),
        furnishing: formData.furnishing,
        availability_date: formData.availability_date,
        is_active: true
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("🟢 Listing Published Successfully!");
      // Reset form
      setFormData({
        compound_name: '',
        rent_price: '',
        bedrooms: '',
        furnishing: 'Unfurnished',
        availability_date: ''
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Add New Listing</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>Workflow A2: Immediate Publish</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <div>
          <label style={labelStyle}>Compound Name</label>
          <input 
            required 
            value={formData.compound_name}
            onChange={e => setFormData({...formData, compound_name: e.target.value})} 
            style={inputStyle} 
            placeholder="e.g. SODIC, Mivida..."
          />
        </div>

        <div>
          <label style={labelStyle}>Monthly Rent</label>
          <input 
            type="number" 
            required 
            value={formData.rent_price}
            onChange={e => setFormData({...formData, rent_price: e.target.value})} 
            style={inputStyle} 
            placeholder="Amount in EGP/USD"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Bedrooms</label>
            <input 
              type="number" 
              required 
              value={formData.bedrooms}
              onChange={e => setFormData({...formData, bedrooms: e.target.value})} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Furnishing</label>
            <select 
              value={formData.furnishing}
              onChange={e => setFormData({...formData, furnishing: e.target.value})} 
              style={inputStyle}
            >
              <option value="Unfurnished">Unfurnished</option>
              <option value="Furnished">Furnished</option>
              <option value="Partially">Partially</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Availability Date</label>
          <input 
            type="date" 
            required 
            value={formData.availability_date}
            onChange={e => setFormData({...formData, availability_date: e.target.value})} 
            style={inputStyle} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            ...btnStyle, 
            backgroundColor: loading ? '#ccc' : '#000',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "PUBLISHING..." : "PUBLISH LISTING"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' as const };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' as const };
const btnStyle = { padding: '15px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };