// components/InputForm.js (Updated with Render Production Config & Demo Fallback)
import React, { useState } from 'react';
import axios from 'axios';

function InputForm({ setGeneratedData, setLoading, setError, loading, error }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  // Customization Feature: Color Theme
  const [colorTheme, setColorTheme] = useState('Vibrant');
  // New State for Demo Status Notification
  const [demoLimitReached, setDemoLimitReached] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGeneratedData(null);
    setDemoLimitReached(false); // Reset status on every fresh attempt

    const dataPayload = { productName, description, targetAudience, colorTheme };
    
    // PRODUCTION FIX: Automatically use Vercel/Vite Config URL, or fallback locally
    const BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000';

    try {
      // 1. Image Generation Endpoint Request Execution
      const imageResponse = await axios.post(
        `${BASE_URL}/api/generate-images`,
        dataPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // 2. Video Generation
      const videoResponse = await axios.post(
        `${BASE_URL}/api/generate-video`,
        dataPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Check if backend cleanly responded with the custom DEMO LIMIT flag code
      if (imageResponse.data && imageResponse.data.errorType === "DEMO_LIMIT_REACHED") {
        setDemoLimitReached(true);
      }

      setGeneratedData({
        images: imageResponse.data.images,
        videoUrl: videoResponse.data.videoUrl,
      });

    } catch (err) {
      console.error('Error from backend:', err.response ? err.response.data : err.message);
      
      // Secondary check: double guard check if error code dropped via status structures
      if (err.response && (err.response.data.errorType === "DEMO_LIMIT_REACHED" || err.response.status === 429)) {
        setDemoLimitReached(true);
        setError('DEMO LIMIT REACHED: Free API keys exhausted. Showing high-quality design variations samples.');
      } else {
        setError(
          'Failed to generate ads. ' +
            (err.response ? err.response.data.error : err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      
      {/* --- FALLBACK BANNER NOTIFICATION DISPLAY --- */}
      {demoLimitReached && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          color: '#d93025',
          backgroundColor: '#feeee2',
          border: '1px solid #fad2cf',
          padding: '12px 20px',
          fontWeight: '600',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(217,48,37,0.05)',
          boxSizing: 'border-box'
        }}>
          ⚠️ DEMO LIMIT REACHED: Free-tier API quota exhausted. Displaying high-quality pre-generated design samples instead!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#ffffff',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          boxSizing: 'border-box'
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>
          Enter Ad Details
        </h2>
        
        {/* Product Name */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Product Name
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
        </label>

        {/* Description */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', minHeight: '100px', boxSizing: 'border-box' }} />
        </label>

        {/* Target Audience */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Target Audience
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
        </label>

        {/* Customization Feature: Color Theme */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Color Theme
          <select
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '15px',
              appearance: 'none',
              boxSizing: 'border-box',
              background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center / 16px 16px`,
            }}
          >
            <option value="Vibrant">Vibrant & Bold</option>
            <option value="Minimalist">Minimalist & Clean</option>
            <option value="Earthy">Earthy & Natural</option>
            <option value="Professional">Professional & Blue/Grey</option>
          </select>
        </label>

        {loading && (
          <p style={{ textAlign: 'center', fontWeight: '600', color: '#4f46e5', margin: '5px 0' }}>
            ⏳ Waking up AI Engine Status... Please wait (up to 30s)
          </p>
        )}

        {error && !demoLimitReached && (
          <p style={{ color: '#ef4444', textAlign: 'center', fontWeight: '600', margin: '5px 0' }}>
            ❌ Error: {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '10px',
            border: 'none',
            background: loading
              ? '#9ca3af'
              : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Processing System...' : '🚀 Generate Ads'}
        </button>
      </form>
    </div>
  );
}

export default InputForm;
