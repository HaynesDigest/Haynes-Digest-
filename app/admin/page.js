'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

export default function Admin() {
  const [links, setLinks] = useState([])
  const [digest, setDigest] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [emailsCopied, setEmailsCopied] = useState(false)

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    const { data } = await supabase.from('links').select('*').eq('sent', false).order('created_at', { ascending: false })
    setLinks(data || [])
  }

  const uniqueEmails = () => {
    const seen = new Set()
    return links.filter(l => l.email && !seen.has(l.email) && seen.add(l.email))
  }

  const copyEmails = () => {
    navigator.clipboard.writeText(uniqueEmails().map(l => l.email).join(', '))
    setEmailsCopied(true)
    setTimeout(() => setEmailsCopied(false), 1800)
  }

  const generateDigest = async () => {
    if (!links.length) return alert('No links yet!')
    setLoading(true)
    setDigest('')
    const linkList = links.map((l, i) =>
      `${i + 1}. Title: ${l.title}\n   URL: ${l.url}\n   Shared by: ${l.name}\n   Category: ${l.category}\n   Why it's cool: ${l.description || '(no description)'}`
    ).join('\n\n')

    const res = await fetch('/api/digest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkList })
    })
    const data = await res.json()
    setDigest(data.digest || 'Error generating digest.')
    setLoading(false)
  }

  const copyDigest = () => {
    navigator.clipboard.writeText(digest)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const markAsSent = async () => {
    if (!confirm('Mark all current links as sent? They will be cleared from this list.')) return
    const ids = links.map(l => l.id)
    await supabase.from('links').update({ sent: true }).in('id', ids)
    setLinks([])
    setDigest('')
  }

  return (
    <main>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Admin — Weekly digest</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>{links.length} link{links.length !== 1 ? 's' : ''} this week</p>

      {/* Emails */}
      <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#444' }}>📬 Send to</div>
        {uniqueEmails().length === 0
          ? <div style={{ fontSize: '13px', color: '#aaa' }}>No emails collected yet.</div>
          : uniqueEmails().map(l => (
            <div key={l.email} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '4px 0', borderBottom: '1px solid #eee' }}>
              <span>{l.name}</span>
              <span style={{ color: '#2563eb' }}>{l.email}</span>
            </div>
          ))
        }
        {uniqueEmails().length > 0 && (
          <button onClick={copyEmails} style={{ marginTop: '10px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            {emailsCopied ? '✅ Copied!' : '📋 Copy all emails'}
          </button>
        )}
      </div>

      {/* Links list */}
      <div style={{ marginBottom: '1rem' }}>
        {links.map(l => (
          <div key={l.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>{l.title}</div>
            <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</div>
            {l.description && <div style={{ fontSize: '13px', color: '#555' }}>{l.description}</div>}
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>{l.name} · {l.category}</div>
          </div>
        ))}
      </div>

      {/* Generate */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={generateDigest} disabled={loading} style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          {loading ? 'Writing digest...' : '✨ Generate digest'}
        </button>
        {links.length > 0 && (
          <button onClick={markAsSent} style={{ background: '#fff', color: '#111', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
            ✅ Mark as sent & clear
          </button>
        )}
      </div>

      {/* Digest output */}
      {digest && (
        <div>
          <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', fontSize:
