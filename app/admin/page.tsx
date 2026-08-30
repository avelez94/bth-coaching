'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Page = { id: string; slug: string; title: string; content: Record<string, string> }
type Testimonial = { id: string; name: string; role: string; company: string; quote: string; is_active: boolean; sort_order: number }
type SiteSetting = { id: string; key: string; value: string }

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0F1117; color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; min-height: 100vh; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0F1117; }
  .login-card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 48px 44px; width: 100%; max-width: 400px; }
  .login-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #fff; margin-bottom: 4px; }
  .login-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; }
  .login-title { font-size: 1.3rem; font-weight: 600; color: #fff; margin-bottom: 24px; }
  .login-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.1); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; }
  .login-input:focus { border-color: #C9A23A; }
  .login-btn { width: 100%; background: #C9A23A; color: #0D1B2A; border: none; padding: 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .login-btn:hover { opacity: 0.9; }
  .login-error { font-size: 12px; color: #e74c3c; margin-bottom: 12px; }

  .admin-wrap { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
  .sidebar { background: #1A1D27; border-right: 1px solid rgba(255,255,255,0.06); padding: 32px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; }
  .sidebar-logo { padding: 0 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 20px; }
  .sidebar-logo-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: #fff; margin-bottom: 2px; }
  .sidebar-logo-sub { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; }
  .sidebar-section { font-size: 0.6rem; color: rgba(255,255,255,0.25); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 24px; margin: 20px 0 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 24px; font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; }
  .sidebar-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
  .sidebar-item.active { color: #C9A23A; border-left-color: #C9A23A; background: rgba(201,162,58,0.06); }
  .sidebar-bottom { margin-top: auto; padding: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
  .logout-btn { font-size: 12px; color: rgba(255,255,255,0.3); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .logout-btn:hover { color: #e74c3c; }

  .main { background: #0F1117; padding: 48px; overflow-y: auto; }
  .page-header { margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .page-title { font-size: 1.5rem; font-weight: 600; color: #FFFFFF; margin-bottom: 6px; }
  .page-sub { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; }

  .section-card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 28px 32px; margin-bottom: 16px; }
  .section-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .section-card-title { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
  .section-card-location { font-size: 11px; color: rgba(255,255,255,0.25); }

  .field-group { margin-bottom: 20px; }
  .field-label { font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
  .field-hint { font-size: 10px; color: rgba(255,255,255,0.25); font-weight: 400; text-transform: none; letter-spacing: 0; }
  .field-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.08); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 13px; padding: 11px 14px; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #C9A23A; }
  .field-input.gold-preview { color: #C9A23A; font-style: italic; }
  textarea.field-input { resize: vertical; min-height: 90px; line-height: 1.65; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .preview-box { background: #0F1117; border: 1px solid rgba(255,255,255,0.06); border-left: 3px solid #C9A23A; padding: 16px 20px; margin-bottom: 20px; }
  .preview-label { font-size: 10px; color: rgba(201,162,58,0.6); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
  .preview-headline { font-size: 18px; font-weight: 600; color: #fff; line-height: 1.2; }
  .preview-headline em { font-style: italic; color: #C9A23A; }

  .image-upload-area { border: 1.5px dashed rgba(255,255,255,0.12); padding: 32px; text-align: center; cursor: pointer; transition: border-color 0.2s; position: relative; }
  .image-upload-area:hover { border-color: rgba(201,162,58,0.4); }
  .image-upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
  .image-upload-text { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 8px; }
  .image-preview { width: 100%; max-height: 200px; object-fit: cover; display: block; margin-bottom: 12px; }
  .image-name { font-size: 11px; color: #C9A23A; margin-top: 8px; }

  .save-row { display: flex; align-items: center; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
  .save-btn { background: #C9A23A; color: #0D1B2A; border: none; padding: 12px 28px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .save-btn:hover:not(:disabled) { opacity: 0.9; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .preview-link { font-size: 12px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
  .preview-link:hover { color: #C9A23A; }
  .save-success { font-size: 12px; color: #27ae60; }

  .testimonial-item { background: #0F1117; border: 1px solid rgba(255,255,255,0.06); padding: 20px 24px; margin-bottom: 10px; }
  .testimonial-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .testimonial-name { font-size: 14px; font-weight: 500; color: #fff; }
  .testimonial-meta { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; }
  .testimonial-quote { font-size: 13px; color: rgba(255,255,255,0.5); font-style: italic; line-height: 1.6; }
  .t-actions { display: flex; gap: 8px; align-items: center; }
  .t-btn { background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); padding: 5px 12px; font-size: 11px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .t-btn:hover { border-color: #C9A23A; color: #C9A23A; }
  .t-btn.del:hover { border-color: #e74c3c; color: #e74c3c; }
  .t-active { font-size: 11px; color: #27ae60; }
  .t-hidden { font-size: 11px; color: rgba(255,255,255,0.3); }
  .add-btn { background: rgba(201,162,58,0.08); border: 1px solid rgba(201,162,58,0.2); color: #C9A23A; padding: 10px 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .add-btn:hover { background: rgba(201,162,58,0.14); }

  @media (max-width: 900px) {
    .admin-wrap { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; }
    .main { padding: 24px; }
    .two-col { grid-template-columns: 1fr; }
  }
`

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [view, setView] = useState('home')
  const [pages, setPages] = useState<Page[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [newT, setNewT] = useState({ name: '', role: '', company: '', quote: '' })
  const [addingT, setAddingT] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const a = sessionStorage.getItem('bth_admin')
    if (a === 'true') { setAuthed(true); fetchAll() }
  }, [])

  async function login() {
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (res.ok) { sessionStorage.setItem('bth_admin', 'true'); setAuthed(true); fetchAll() }
      else setLoginError('Incorrect password.')
    } catch { setLoginError('Something went wrong.') }
  }

  async function fetchAll() {
    const [pRes, tRes, sRes] = await Promise.all([
      supabase.from('pages').select('*').order('slug'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('site_settings').select('*'),
    ])
    if (pRes.data) setPages(pRes.data)
    if (tRes.data) setTestimonials(tRes.data)
    if (sRes.data) setSettings(sRes.data)
  }

  function selectPage(slug: string) {
    setView(slug)
    const p = pages.find(p => p.slug === slug)
    setEditingPage(p ? { ...p, content: { ...p.content } } : null)
    setSaved('')
  }

  function updateContent(key: string, value: string) {
    if (!editingPage) return
    setEditingPage({ ...editingPage, content: { ...editingPage.content, [key]: value } })
  }

  async function savePage() {
    if (!editingPage) return
    setSaving(true)
    await supabase.from('pages').update({ content: editingPage.content, updated_at: new Date().toISOString() }).eq('id', editingPage.id)
    setSaving(false); setSaved('Saved successfully'); setTimeout(() => setSaved(''), 3000)
    fetchAll()
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingPage) return
    setUploadingImage(true)
    const path = `pages/${editingPage.slug}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      updateContent('about_photo', data.publicUrl)
    }
    setUploadingImage(false)
  }

  async function saveSettings() {
    setSaving(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('id', s.id)))
    setSaving(false); setSaved('Saved successfully'); setTimeout(() => setSaved(''), 3000)
  }

  async function addTestimonial() {
    if (!newT.name || !newT.quote) return
    await supabase.from('testimonials').insert({ ...newT, is_active: true, sort_order: testimonials.length })
    setNewT({ name: '', role: '', company: '', quote: '' }); setAddingT(false); fetchAll()
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return
    await supabase.from('testimonials').delete().eq('id', id); fetchAll()
  }

  async function toggleTestimonial(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id); fetchAll()
  }

  function updateSetting(key: string, value: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s))
  }

  const c = editingPage?.content || {}

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Beyond the Horizon</div>
          <div className="login-sub">Content Management</div>
          <div className="login-title">Sign in to edit your site</div>
          {loginError && <div className="login-error">{loginError}</div>}
          <input className="login-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          <button className="login-btn" onClick={login}>Sign In →</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="admin-wrap">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Beyond the Horizon</div>
            <div className="sidebar-logo-sub">Content Management</div>
          </div>
          <div className="sidebar-section">Pages</div>
          {[
            { id: 'home', icon: '🏠', label: 'Home Page' },
            { id: 'business', icon: '💼', label: 'Business Coaching' },
            { id: 'individual', icon: '👤', label: 'Individual Coaching' },
            { id: 'contact', icon: '📧', label: 'Contact Page' },
          ].map(item => (
            <div key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => selectPage(item.id)}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
          <div className="sidebar-section">Content</div>
          {[
            { id: 'testimonials', icon: '💬', label: 'Testimonials' },
            { id: 'settings', icon: '⚙️', label: 'Site Settings' },
          ].map(item => (
            <div key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => { setView(item.id); setSaved('') }}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => { sessionStorage.removeItem('bth_admin'); setAuthed(false) }}>Sign out</button>
          </div>
        </div>

        <div className="main">

          {/* HOME PAGE */}
          {view === 'home' && (
            <>
              <div className="page-header">
                <div className="page-title">Home Page</div>
                <div className="page-sub">These fields control the content on your homepage. Save when done and click Preview to see changes live.</div>
              </div>

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">Hero Section — Top of the page</div>
                  <div className="section-card-location">Visitors see this first</div>
                </div>
                <div className="field-group">
                  <div className="field-label">Main headline <span className="field-hint">— appears in white, large text</span></div>
                  <input className="field-input" value={c.hero_headline || ''} onChange={e => updateContent('hero_headline', e.target.value)} placeholder="Navigate. Elevate. Transform." />
                </div>
                <div className="field-group">
                  <div className="field-label">Accent line <span className="field-hint">— appears in gold italic text below the headline</span></div>
                  <input className="field-input gold-preview" value={c.hero_accent || ''} onChange={e => updateContent('hero_accent', e.target.value)} placeholder="e.g. Transform." />
                </div>
                <div className="field-group">
                  <div className="field-label">Subheadline <span className="field-hint">— one or two sentences below the headline</span></div>
                  <textarea className="field-input" value={c.hero_subheadline || ''} onChange={e => updateContent('hero_subheadline', e.target.value)} placeholder="Strategic guidance for leaders who are ready to go beyond the horizon." rows={3} />
                </div>
                {(c.hero_headline || c.hero_accent) && (
                  <div className="preview-box">
                    <div className="preview-label">Preview — how the headline looks on the site</div>
                    <div className="preview-headline">{c.hero_headline || ''}<br /><em>{c.hero_accent || ''}</em></div>
                  </div>
                )}
              </div>

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">About Section — Midway down the page</div>
                  <div className="section-card-location">Your photo, name, and bio appear here</div>
                </div>
                <div className="field-group">
                  <div className="field-label">Your photo <span className="field-hint">— upload a professional headshot or portrait</span></div>
                  <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} style={{display:'none'}} />
                    {c.about_photo ? (
                      <>
                        <img src={c.about_photo} alt="About photo" className="image-preview" />
                        <div className="image-name">Click to replace photo</div>
                      </>
                    ) : (
                      <>
                        <div style={{fontSize:32,marginBottom:8}}>📷</div>
                        <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',fontWeight:500}}>{uploadingImage ? 'Uploading...' : 'Click to upload your photo'}</div>
                        <div className="image-upload-text">Recommended: Professional headshot, at least 800x1000px, JPG or PNG</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="field-group">
                  <div className="field-label">Section title <span className="field-hint">— the heading above your bio</span></div>
                  <input className="field-input" value={c.about_title || ''} onChange={e => updateContent('about_title', e.target.value)} placeholder="Leadership forged through experience." />
                </div>
                <div className="field-group">
                  <div className="field-label">Bio paragraph 1 <span className="field-hint">— introduce yourself and your background</span></div>
                  <textarea className="field-input" value={c.about_body_1 || ''} onChange={e => updateContent('about_body_1', e.target.value)} placeholder="John McCracken is a retired U.S. Navy Captain..." rows={4} />
                </div>
                <div className="field-group">
                  <div className="field-label">Bio paragraph 2 <span className="field-hint">— what you offer clients</span></div>
                  <textarea className="field-input" value={c.about_body_2 || ''} onChange={e => updateContent('about_body_2', e.target.value)} placeholder="Whether you are leading a team through change..." rows={4} />
                </div>
                <div className="field-group">
                  <div className="field-label">Credentials <span className="field-hint">— one per line, shown as a list below your bio</span></div>
                  <textarea className="field-input" value={c.about_credentials || ''} onChange={e => updateContent('about_credentials', e.target.value)} placeholder={"CAPT, USN (Ret.) — U.S. Navy\nExecutive MBA (EMBA)\nACC Certified Coach — ICF\nFounder, Beyond the Horizon"} rows={5} />
                </div>
              </div>

              <div className="save-row">
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Home Page'}</button>
                <a className="preview-link" href="/" target="_blank">Open homepage to preview →</a>
                {saved && <span className="save-success">✓ {saved}</span>}
              </div>
            </>
          )}

          {/* BUSINESS PAGE */}
          {view === 'business' && (
            <>
              <div className="page-header">
                <div className="page-title">Business Coaching Page</div>
                <div className="page-sub">Edit the hero section content for the Business Coaching page.</div>
              </div>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">Hero Section — Top of the Business Coaching page</div>
                </div>
                <div className="field-group">
                  <div className="field-label">Main headline <span className="field-hint">— white text, large</span></div>
                  <input className="field-input" value={c.headline || ''} onChange={e => updateContent('headline', e.target.value)} placeholder="Coaching that moves" />
                </div>
                <div className="field-group">
                  <div className="field-label">Accent line <span className="field-hint">— gold italic text, second line of the headline</span></div>
                  <input className="field-input gold-preview" value={c.headline_accent || ''} onChange={e => updateContent('headline_accent', e.target.value)} placeholder="your business forward." />
                </div>
                <div className="field-group">
                  <div className="field-label">Subheadline <span className="field-hint">— one or two sentences below the headline</span></div>
                  <textarea className="field-input" value={c.subheadline || ''} onChange={e => updateContent('subheadline', e.target.value)} rows={3} placeholder="Strategic coaching for executives, leadership teams, and organizations navigating change, growth, and transformation." />
                </div>
                {(c.headline || c.headline_accent) && (
                  <div className="preview-box">
                    <div className="preview-label">Preview — how the headline looks on the site</div>
                    <div className="preview-headline">{c.headline || ''}<br /><em>{c.headline_accent || ''}</em></div>
                  </div>
                )}
              </div>
              <div className="save-row">
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Business Page'}</button>
                <a className="preview-link" href="/business" target="_blank">Open Business Coaching page →</a>
                {saved && <span className="save-success">✓ {saved}</span>}
              </div>
            </>
          )}

          {/* INDIVIDUAL PAGE */}
          {view === 'individual' && (
            <>
              <div className="page-header">
                <div className="page-title">Individual Coaching Page</div>
                <div className="page-sub">Edit the hero section content for the Individual Coaching page.</div>
              </div>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">Hero Section — Top of the Individual Coaching page</div>
                </div>
                <div className="field-group">
                  <div className="field-label">Main headline <span className="field-hint">— white text, large</span></div>
                  <input className="field-input" value={c.headline || ''} onChange={e => updateContent('headline', e.target.value)} placeholder="Invest in the leader" />
                </div>
                <div className="field-group">
                  <div className="field-label">Accent line <span className="field-hint">— gold italic text, second line of the headline</span></div>
                  <input className="field-input gold-preview" value={c.headline_accent || ''} onChange={e => updateContent('headline_accent', e.target.value)} placeholder="you are becoming." />
                </div>
                <div className="field-group">
                  <div className="field-label">Subheadline <span className="field-hint">— one or two sentences below the headline</span></div>
                  <textarea className="field-input" value={c.subheadline || ''} onChange={e => updateContent('subheadline', e.target.value)} rows={3} placeholder="Personalized coaching for professionals and leaders who are ready to grow." />
                </div>
                {(c.headline || c.headline_accent) && (
                  <div className="preview-box">
                    <div className="preview-label">Preview — how the headline looks on the site</div>
                    <div className="preview-headline">{c.headline || ''}<br /><em>{c.headline_accent || ''}</em></div>
                  </div>
                )}
              </div>
              <div className="save-row">
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Individual Page'}</button>
                <a className="preview-link" href="/individual" target="_blank">Open Individual Coaching page →</a>
                {saved && <span className="save-success">✓ {saved}</span>}
              </div>
            </>
          )}

          {/* CONTACT PAGE */}
          {view === 'contact' && (
            <>
              <div className="page-header">
                <div className="page-title">Contact Page</div>
                <div className="page-sub">Edit the contact page headline and subheadline.</div>
              </div>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">Hero Section — Top of the Contact page</div>
                </div>
                <div className="field-group">
                  <div className="field-label">Main headline <span className="field-hint">— white text, large</span></div>
                  <input className="field-input" value={c.headline || ''} onChange={e => updateContent('headline', e.target.value)} placeholder="Let's start a" />
                </div>
                <div className="field-group">
                  <div className="field-label">Accent line <span className="field-hint">— gold italic text</span></div>
                  <input className="field-input gold-preview" value={c.headline_accent || ''} onChange={e => updateContent('headline_accent', e.target.value)} placeholder="conversation." />
                </div>
                <div className="field-group">
                  <div className="field-label">Subheadline <span className="field-hint">— sentence below the headline</span></div>
                  <textarea className="field-input" value={c.subheadline || ''} onChange={e => updateContent('subheadline', e.target.value)} rows={3} placeholder="Whether you are ready to get started or just exploring, the first conversation is always complimentary." />
                </div>
              </div>
              <div className="save-row">
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Contact Page'}</button>
                <a className="preview-link" href="/contact" target="_blank">Open Contact page →</a>
                {saved && <span className="save-success">✓ {saved}</span>}
              </div>
            </>
          )}

          {/* TESTIMONIALS */}
          {view === 'testimonials' && (
            <>
              <div className="page-header">
                <div className="page-title">Testimonials</div>
                <div className="page-sub">Add and manage client testimonials. Only testimonials marked as Active will appear on your site. You can hide a testimonial without deleting it.</div>
              </div>
              <button className="add-btn" onClick={() => setAddingT(!addingT)}>+ Add New Testimonial</button>
              {addingT && (
                <div className="section-card">
                  <div className="section-card-header">
                    <div className="section-card-title">New Testimonial</div>
                  </div>
                  <div className="two-col">
                    <div className="field-group">
                      <div className="field-label">Client name *</div>
                      <input className="field-input" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} placeholder="Full name" />
                    </div>
                    <div className="field-group">
                      <div className="field-label">Title or role</div>
                      <input className="field-input" value={newT.role} onChange={e => setNewT({...newT, role: e.target.value})} placeholder="CEO, VP of Operations, etc." />
                    </div>
                    <div className="field-group">
                      <div className="field-label">Company</div>
                      <input className="field-input" value={newT.company} onChange={e => setNewT({...newT, company: e.target.value})} placeholder="Company or organization name" />
                    </div>
                  </div>
                  <div className="field-group">
                    <div className="field-label">What they said * <span className="field-hint">— copy their exact words</span></div>
                    <textarea className="field-input" value={newT.quote} onChange={e => setNewT({...newT, quote: e.target.value})} placeholder="Type or paste the testimonial here..." rows={5} />
                  </div>
                  <div className="save-row">
                    <button className="save-btn" onClick={addTestimonial}>Add Testimonial</button>
                    <button style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',padding:'12px 20px',fontSize:12,cursor:'pointer'}} onClick={() => setAddingT(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {testimonials.length === 0 && !addingT && (
                <div style={{color:'rgba(255,255,255,0.3)',fontSize:13,padding:'32px 0'}}>No testimonials yet. Click the button above to add your first one.</div>
              )}
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-item">
                  <div className="testimonial-top">
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      {(t.role || t.company) && <div className="testimonial-meta">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                    </div>
                    <div className="t-actions">
                      <span className={t.is_active ? 't-active' : 't-hidden'}>{t.is_active ? '● Active' : '○ Hidden'}</span>
                      <button className="t-btn" onClick={() => toggleTestimonial(t.id, t.is_active)}>{t.is_active ? 'Hide' : 'Show'}</button>
                      <button className="t-btn del" onClick={() => deleteTestimonial(t.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="testimonial-quote">"{t.quote}"</div>
                </div>
              ))}
            </>
          )}

          {/* SETTINGS */}
          {view === 'settings' && (
            <>
              <div className="page-header">
                <div className="page-title">Site Settings</div>
                <div className="page-sub">Update your contact information and other global details that appear across the site.</div>
              </div>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">Contact Information — appears in footer and contact page</div>
                </div>
                {settings.map(s => (
                  <div key={s.id} className="field-group">
                    <div className="field-label">
                      {s.key === 'phone' ? 'Phone number' : s.key === 'email' ? 'Email address' : s.key === 'linkedin' ? 'LinkedIn profile URL' : s.key === 'tagline' ? 'Tagline' : s.key}
                      <span className="field-hint">— {s.key === 'phone' ? 'shown in footer and contact page' : s.key === 'email' ? 'where inquiries are sent' : s.key === 'linkedin' ? 'optional, leave blank if not needed' : 'shown under your name in the footer'}</span>
                    </div>
                    <input className="field-input" value={s.value || ''} onChange={e => updateSetting(s.key, e.target.value)} placeholder={s.key} />
                  </div>
                ))}
                <div className="save-row">
                  <button className="save-btn" onClick={saveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
                  {saved && <span className="save-success">✓ {saved}</span>}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}