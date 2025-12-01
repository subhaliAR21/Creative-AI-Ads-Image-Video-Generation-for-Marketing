// Date 12/11/2025

//  ..................................................................................................................................................................

// components/InputForm.js (Updated)
import React, { useState } from 'react';
import axios from 'axios';

function InputForm({ setGeneratedData, setLoading, setError, loading, error }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  // Customization Feature: Color Theme
  const [colorTheme, setColorTheme] = useState('Vibrant');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGeneratedData(null);

    const dataPayload = { productName, description, targetAudience, colorTheme };
    const BASE_URL = 'http://localhost:5000'; // Define backend URL

    try {
      // 1. Image Generation
      const imageResponse = await axios.post(
        `/api/generate-images`,
        dataPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // 2. Video Generation
      const videoResponse = await axios.post(
        `/api/generate-video`,
        dataPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setGeneratedData({
        images: imageResponse.data.images,
        videoUrl: videoResponse.data.videoUrl,
      });
    } catch (err) {
      console.error('Error from backend:', err.response ? err.response.data : err.message);
      setError(
        'Failed to generate ads. ' +
          (err.response ? err.response.data.error : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>
          Enter Ad Details
        </h2>

        {/* Input Fields (Styled for Professional Look) */}
        {/* ... (Use the same styling as your latest InputForm.js for the input fields) ... */}
        
        {/* Product Name */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Product Name
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', }} />
        </label>

        {/* Description */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', minHeight: '100px', }} />
        </label>

        {/* Target Audience */}
        <label style={{ fontWeight: '600', color: '#374151' }}>
          Target Audience
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', }} />
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
              appearance: 'none', // Hide default select arrow
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
          <p style={{ textAlign: 'center', fontWeight: '600', color: '#4f46e5' }}>
            ⏳ Generating Ads with AI... Please wait (up to 30s)
          </p>
        )}

        {error && (
          <p style={{ color: '#ef4444', textAlign: 'center', fontWeight: '600' }}>
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
          {loading ? 'Generating...' : '🚀 Generate Ads'}
        </button>
      </form>
    </div>
  );
}

export default InputForm;
