'use client';
import { useState } from 'react';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [product, setProduct] = useState('Argan Glow Oil');
  const [details, setDetails] = useState('amber glass bottle with a gold cap');
  const [style, setStyle] = useState('studio');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [url, setUrl] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setErr(''); setUrl(''); setMsg('Sending your request…');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, details, style, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      // Poll every 4 seconds, for up to about 8 minutes.
      for (let i = 0; i < 120; i++) {
        await wait(4000);
        setMsg('Generating your video… this usually takes 1 to 3 minutes.');
        const s = await fetch('/api/status?id=' + encodeURIComponent(data.id));
        const st = await s.json();
        if (!s.ok) throw new Error(st.error || 'Status check failed');
        if (st.status === 'COMPLETED') {
          if (!st.url) throw new Error('The model finished but returned no video.');
          setUrl(st.url); setMsg('Done!');
          return;
        }
      }
      throw new Error('Timed out. Check your fal.ai dashboard.');
    } catch (e2) {
      setErr(e2.message); setMsg('');
    } finally { setBusy(false); }
  }

  return (
    <main>
      <h1>Product video ads for your shop</h1>
      <p className="lead">Describe your product, pick a style, and get a real vertical AI video you can download.</p>
      <form onSubmit={onSubmit}>
        <label>Product name<input value={product} onChange={(e) => setProduct(e.target.value)} maxLength={60} required /></label>
        <label>What does it look like?<input value={details} onChange={(e) => setDetails(e.target.value)} maxLength={140} /></label>
        <label>Style
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="studio">Studio hero shot</option>
            <option value="lifestyle">Lifestyle, natural light</option>
            <option value="luxury">Luxury, dark and golden</option>
          </select>
        </label>
        <label>Access code<input type="password" value={code} onChange={(e) => setCode(e.target.value)} /></label>
        <button className="go" disabled={busy}>{busy ? 'Working…' : 'Generate video'}</button>
        {msg && <p className="msg" role="status">{msg}</p>}
        {err && <p className="err" role="alert">{err}</p>}
      </form>
      {url && (
        <>
          <video src={url} controls autoPlay loop playsInline />
          <a className="dl" href={url} download target="_blank" rel="noreferrer">Download video</a>
        </>
      )}
    </main>
  );
}
