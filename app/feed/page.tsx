'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://vouwxpzkyqtsqslxkhwf.supabase.co", 
  "sb_publishable_iYnq09GE5Wa1Tjq7YQIH3w_ploK2Rok"
);

export default function ListingFeed() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    // FLOW B1: Only show active units, ranked by freshness
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('last_confirmed_at', { ascending: false });

    if (data) setListings(data);
    setLoading(false);
  }

  // FLOW A3: Update timestamp to move listing to top
  async function handleConfirm(id: string) {
    const { error } = await supabase.rpc('confirm_availability', { listing_id: id });
    if (!error) {
      alert("🟢 Confirmed! Your listing is now at the top.");
      fetchListings();
    }
  }

  // FLOW B2: WhatsApp handoff
  const contactWhatsApp = (compound: string) => {
    const phone = "20123456789"; // This will eventually come from the listing's owner profile
    const message = `Hello, I saw your listing for ${compound} on the app. Is it still available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // FLOW B3: Lightweight reporting
  async function handleReport(id: string) {
    const { error } = await supabase
      .from('reports')
      .insert([{ listing_id: id }]);

    if (!error) {
      alert("🚨 Report logged. Our team will verify this listing.");
    } else {
      console.error(error);
    }
  }

  if (loading) return <div style={{padding: '50px'}}>Loading Feed...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Live Listings</h1>
        <button onClick={() => window.location.href='/add-listing'} style={addBtn}>+ Post</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {listings.map((item) => (
          <div key={item.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>{item.compound_name}</h2>
              <span style={priceTag}>{item.rent_price.toLocaleString()} EGP</span>
            </div>
            
            <p style={{ color: '#666', fontSize: '14px' }}>
              {item.bedrooms} Bedrooms • {item.furnishing} • Confirmed {new Date(item.last_confirmed_at).toLocaleDateString()}
            </p>

            <div style={buttonGroup}>
              {/* FLOW B2 */}
              <button onClick={() => contactWhatsApp(item.compound_name)} style={whatsappBtn}>
                WhatsApp Broker
              </button>

              {/* FLOW A3 (Usually for the owner, but visible for testing) */}
              <button onClick={() => handleConfirm(item.id)} style={confirmBtn}>
                Still Available ✅
              </button>

              {/* FLOW B3 */}
              <button onClick={() => handleReport(item.id)} style={reportBtn}>
                Unit Gone? 🚨
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {listings.length === 0 && <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>No units available right now.</p>}
    </div>
  );
}

// --- STYLING ---
const cardStyle = { padding: '20px', borderRadius: '15px', border: '1px solid #eee', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const priceTag = { fontSize: '20px', fontWeight: 'bold', color: '#2ecc71' };
const buttonGroup = { display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' as const };
const addBtn = { padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' };
const whatsappBtn = { flex: '2', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const confirmBtn = { flex: '1', padding: '12px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' };
const reportBtn = { padding: '12px', background: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer' };