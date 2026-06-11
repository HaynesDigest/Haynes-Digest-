'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

const CATEGORIES = [
  'Art', 'Music', 'Literature & Poetry', 'Film',
  'Design', 'Game', 'Science', 'Tech', 'Other'
]

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', url: '', title: '', desc: '', cat: 'Art' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.name || !form.url) return alert('Name and URL are required!')
    setLoading(true)
    const { error } = await supabase.from('links').insert([{
      name: form.name,
      email: form.email,
      url: form.url,
      title: form.title || form.url,
      description: form.desc,
      category: form.cat,
    }])
    setLoading(false)
    if (error) { setStatus('error'); return }
    setStatus('success')
    setForm({ name: '', email: '', url: '', title: '', desc: '', cat: 'Art' })
  }

  return (
    <main>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Share a link 🔗</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Drop something cool you found this week.</p>

      {status === 'success' && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', color: '#15803d' }}>
          ✅ Link saved! Thanks for sharing.
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', color: '#dc2626' }}>
          ❌ Something went wrong. Please try again.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>Your name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Alex" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>Your email</label>
          <input name="email" value={form.email} onChange={handle} placeholder="you@example.com" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>URL *</label>
        <input name="url" value={form.url} onChange={handle} placeholder="https://..." style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>Title <span style={{ color: '#aaa' }}>(optional)</span></label>
        <input name="title" value={form.title} onChange={handle} placeholder="Give it a short name" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>Why it's cool</label>
        <textarea name="desc" value={form.desc} onChange={handle} placeholder="A sentence or two about what makes this worth sharing..." rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#444' }}>Category</label>
        <select name="cat" value={form.cat} onChange={handle} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button onClick={submit} disabled={loading} style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
        {loading ? 'Saving...' : 'Submit link ↑'}
      </button>
    </main>
  )
}
