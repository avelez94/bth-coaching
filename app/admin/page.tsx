'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Page = { id: string; slug: string; title: string; content: Record<string, string> }
type Testimonial = { id: string; name: string; role: string; company: string; quote: string; is_active: boolean; sort_order: number }
type SiteSetting = { id: string; key: string; value: string }

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0F1117; color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; min-height: 100vh; }

  /* LOGIN */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0F1117; }
  .login-card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 48px 44px; width: 100%; max-width: 400px; }
  .login-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #fff; margin-bottom: 4px; }
  .login-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; }
  .login-title { font-size: 1.3rem; font-weight: 600; color: #fff; margin-bottom: 24px; }
  .login-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.1); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; }
  .login-input:focus { border-color: #C9A23A; }
  .login-btn { width: 100%; background: #C9A23A; color: #0D1B2A; border: none; padding: 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
  .login-error { font-size: 12px; color: #e74c3c; margin-bottom: 12px; }

  /* SHELL */
  .admin-shell { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar { background: #12151E; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .sidebar-logo { padding: 28px 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-logo-name { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: #fff; margin-bottom: 2px; }
  .sidebar-logo-sub { font-size: 0.58rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; }
  .sidebar-group { padding: 20px 0 8px; }
  .sidebar-group-label { font-size: 0.58rem; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 20px 8px; }
  .nav-item { display: flex; align-items: center; gap: 9px; padding: 9px 20px; font-size: 12.5px; color: rgba(255,255,255,0.45); cursor: pointer; transition: all 0.15s; border-left: 2px solid transparent; }
  .nav-item:hover { color: #fff; background: rgba(255,255,255,0.03); }
  .nav-item.active { color: #C9A23A; border-left-color: #C9A23A; background: rgba(201,162,58,0.05); }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); }
  .signout-btn { font-size: 11px; color: rgba(255,255,255,0.25); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .signout-btn:hover { color: #e74c3c; }

  /* MAIN */
  .main-area { background: #0F1117; display: flex; flex-direction: column; min-height: 100vh; }
  .main-topbar { background: #12151E; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; }
  .main-topbar-title { font-size: 13px; font-weight: 500; color: #fff; }
  .main-topbar-sub { font-size: 11px; color: rgba(255,255,255,0.3); }
  .save-bar { display: flex; align-items: center; gap: 12px; }
  .save-btn { background: #C9A23A; color: #0D1B2A; border: none; padding: 9px 22px; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .save-btn:hover:not(:disabled) { opacity: 0.88; }
  .save-success { font-size: 11px; color: #27ae60; }
  .preview-btn { font-size: 11px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
  .preview-btn:hover { color: #C9A23A; }

  /* EDITOR LAYOUT */
  .editor-layout { display: grid; grid-template-columns: 380px 1fr; flex: 1; }
  .editor-fields { background: #1A1D27; border-right: 1px solid rgba(255,255,255,0.05); padding: 28px 24px; overflow-y: auto; }
  .editor-preview { background: #0F1117; overflow-y: auto; }

  /* FIELDS */
  .field-section { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .field-section:last-child { border-bottom: none; margin-bottom: 0; }
  .field-section-title { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 16px; }
  .field { margin-bottom: 14px; }
  .field-label { font-size: 10.5px; color: rgba(255,255,255,0.4); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500; margin-bottom: 6px; }
  .field-hint { font-size: 10px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 6px; font-style: italic; text-transform: none; letter-spacing: 0; }
  .field-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.07); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 12.5px; padding: 9px 12px; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #C9A23A; }
  .field-input.accent { color: #C9A23A; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; }
  textarea.field-input { resize: vertical; min-height: 80px; line-height: 1.6; }

  /* IMAGE UPLOAD */
  .upload-zone { border: 1.5px dashed rgba(255,255,255,0.1); padding: 24px 16px; text-align: center; cursor: pointer; transition: border-color 0.2s; position: relative; }
  .upload-zone:hover { border-color: rgba(201,162,58,0.3); }
  .upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-preview { width: 100%; max-height: 160px; object-fit: cover; display: block; margin-bottom: 8px; }
  .upload-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 6px; }

  /* ===================== */
  /* LIVE PREVIEW STYLES   */
  /* These match the real  */
  /* site exactly          */
  /* ===================== */

  /* HERO PREVIEW */
  .preview-hero { background: #0D1B2A; padding: 60px 48px; position: relative; overflow: hidden; }
  .preview-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, #C9A23A 0, #C9A23A 1px, transparent 0, transparent 50%); background-size: 30px 30px; pointer-events: none; }
  .preview-hero-gold-line { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: linear-gradient(90deg, transparent, #C9A23A, transparent); }
  .preview-hero-inner { position: relative; z-index: 2; max-width: 560px; }
  .preview-eyebrow { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .preview-eyebrow::before { content: ''; width: 24px; height: 1px; background: #C9A23A; }
  .preview-hero-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 56px); font-weight: 600; line-height: 1.05; color: #fff; margin-bottom: 16px; }
  .preview-hero-headline em { font-style: italic; color: #C9A23A; }
  .preview-hero-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.6); margin-bottom: 28px; max-width: 420px; }
  .preview-btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .preview-cta { background: #C9A23A; color: #0D1B2A; padding: 11px 24px; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; border: none; }
  .preview-cta-outline { background: transparent; color: rgba(247,244,237,0.7); border: 1px solid rgba(247,244,237,0.2); padding: 11px 24px; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .preview-stats { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
  .preview-stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,162,58,0.15); border-left: 2px solid #C9A23A; padding: 14px 18px; }
  .preview-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: #C9A23A; line-height: 1; margin-bottom: 3px; }
  .preview-stat-label { font-size: 0.72rem; color: rgba(247,244,237,0.5); }

  /* ABOUT PREVIEW */
  .preview-about { background: #F7F4ED; padding: 48px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }
  .preview-about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, #1A2E45, #4C78A0); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; text-transform: uppercase; overflow: hidden; }
  .preview-about-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .preview-about-eyebrow { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .preview-about-eyebrow::before { content: ''; width: 20px; height: 1px; background: #C9A23A; }
  .preview-about-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(24px, 3vw, 36px); font-weight: 600; line-height: 1.1; color: #0D1B2A; margin-bottom: 16px; }
  .preview-about-title em { font-style: italic; color: #4C78A0; }
  .preview-about-body { font-size: 0.84rem; line-height: 1.8; color: #2C3E50; margin-bottom: 12px; }
  .preview-credentials { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
  .preview-credential { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; color: #6B7A8D; }
  .preview-credential::before { content: ''; width: 16px; height: 1px; background: #C9A23A; flex-shrink: 0; }

  /* SECTION PREVIEW (business/individual/contact) */
  .preview-page-hero { background: #0D1B2A; padding: 60px 48px; position: relative; overflow: hidden; min-height: 280px; display: flex; align-items: center; }
  .preview-page-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, #C9A23A 0, #C9A23A 1px, transparent 0, transparent 50%); background-size: 30px 30px; pointer-events: none; }
  .preview-page-hero-inner { position: relative; z-index: 2; max-width: 600px; }
  .preview-breadcrumb { font-size: 0.6rem; color: rgba(247,244,237,0.3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; }
  .preview-page-eyebrow { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .preview-page-eyebrow::before { content: ''; width: 24px; height: 1px; background: #C9A23A; }
  .preview-page-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 600; line-height: 1.05; color: #fff; margin-bottom: 16px; }
  .preview-page-title em { font-style: italic; color: #C9A23A; }
  .preview-page-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.6); margin-bottom: 28px; max-width: 480px; }

  /* TESTIMONIAL PREVIEW */
  .preview-testimonials { background: #0D1B2A; padding: 48px; }
  .preview-t-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .preview-t-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); padding: 24px 20px; }
  .preview-t-quote { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; line-height: 1.65; color: rgba(247,244,237,0.7); margin-bottom: 16px; }
  .preview-t-author { font-size: 0.7rem; color: #C9A23A; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
  .preview-t-role { font-size: 0.65rem; color: rgba(247,244,237,0.3); margin-top: 3px; }

  /* SETTINGS PREVIEW */
  .preview-footer { background: #0D1B2A; padding: 40px 48px; }
  .preview-footer-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .preview-footer-sub { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; }
  .preview-footer-item { font-size: 0.8rem; color: rgba(247,244,237,0.4); margin-bottom: 8px; }

  /* PREVIEW LABEL */
  .preview-section-label { background: rgba(201,162,58,0.08); border-bottom: 1px solid rgba(201,162,58,0.15); padding: 8px 16px; font-size: 10px; color: rgba(201,162,58,0.7); letter-spacing: 0.12em; text-transform: uppercase; }

  /* TESTIMONIAL MANAGER */
  .t-manager { padding: 28px 24px; }
  .add-t-btn { background: rgba(201,162,58,0.08); border: 1px solid rgba(201,162,58,0.2); color: #C9A23A; padding: 9px 18px; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .add-t-btn:hover { background: rgba(201,162,58,0.14); }
  .t-item { background: #12151E; border: 1px solid rgba(255,255,255,0.05); padding: 18px 20px; margin-bottom: 10px; }
  .t-item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .t-item-name { font-size: 13px; font-weight: 500; color: #fff; }
  .t-item-meta { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }
  .t-item-quote { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; line-height: 1.6; }
  .t-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .t-status { font-size: 10px; font-weight: 500; }
  .t-status.on { color: #27ae60; }
  .t-status.off { color: rgba(255,255,255,0.25); }
  .t-btn { background: none; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.35); padding: 4px 10px; font-size: 10.5px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .t-btn:hover { border-color: #C9A23A; color: #C9A23A; }
  .t-btn.del:hover { border-color: #e74c3c; color: #e74c3c; }

  @media (max-width: 1100px) {
    .editor-layout { grid-template-columns: 320px 1fr; }
  }
  @media (max-width: 900px) {
    .admin-shell { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; }
    .editor-layout { grid-template-columns: 1fr; }
    .editor-preview { display: none; }
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
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('bth_admin') === 'true') { setAuthed(true); fetchAll() }
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
    if (pRes.data) { setPages(pRes.data); const p = pRes.data.find((p: Page) => p.slug === 'home'); if (p) setEditingPage({...p, content: {...p.content}}) }
    if (tRes.data) setTestimonials(tRes.data)
    if (sRes.data) setSettings(sRes.data)
  }

  function selectPage(slug: string) {
    setView(slug)
    const p = pages.find(p => p.slug === slug)
    setEditingPage(p ? { ...p, content: { ...p.content } } : null)
    setSaved('')
  }

  function u(key: string, value: string) {
    if (!editingPage) return
    setEditingPage({ ...editingPage, content: { ...editingPage.content, [key]: value } })
  }

  async function savePage() {
    if (!editingPage) return
    setSaving(true)
    await supabase.from('pages').update({ content: editingPage.content, updated_at: new Date().toISOString() }).eq('id', editingPage.id)
    setSaving(false); setSaved('Saved'); setTimeout(() => setSaved(''), 2500); fetchAll()
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingPage) return
    setUploading(true)
    const path = `pages/${editingPage.slug}/${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      u('about_photo', data.publicUrl)
    }
    setUploading(false)
  }

  async function saveSettings() {
    setSaving(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('id', s.id)))
    setSaving(false); setSaved('Saved'); setTimeout(() => setSaved(''), 2500)
  }

  async function addTestimonial() {
    if (!newT.name || !newT.quote) return
    await supabase.from('testimonials').insert({ ...newT, is_active: true, sort_order: testimonials.length })
    setNewT({ name: '', role: '', company: '', quote: '' }); setAddingT(false); fetchAll()
  }

  async function toggleT(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id); fetchAll()
  }

  async function deleteT(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id); fetchAll()
  }

  function updateSetting(key: string, value: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s))
  }

  const c = editingPage?.content || {}
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || ''

  const pageLinks: Record<string, string> = { home: '/', business: '/business', individual: '/individual', contact: '/contact' }
  const pageLabels: Record<string, string> = { home: 'Home Page', business: 'Business Coaching', individual: 'Individual Coaching', contact: 'Contact Page' }

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Beyond the Horizon</div>
          <div className="login-sub">Content Management</div>
          <div className="login-title">Sign in to edit your site</div>
          {loginError && <div className="login-error">{loginError}</div>}
          <input className="login-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} autoFocus />
          <button className="login-btn" onClick={login}>Sign In →</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="admin-shell">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Beyond the Horizon</div>
            <div className="sidebar-logo-sub">Content Management</div>
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Pages</div>
            {['home','business','individual','contact'].map(slug => (
              <div key={slug} className={`nav-item ${view === slug ? 'active' : ''}`} onClick={() => selectPage(slug)}>
                <span>{slug === 'home' ? '🏠' : slug === 'business' ? '💼' : slug === 'individual' ? '👤' : '📧'}</span>
                {pageLabels[slug]}
              </div>
            ))}
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Content</div>
            {[{ id: 'testimonials', icon: '💬', label: 'Testimonials' }, { id: 'settings', icon: '⚙️', label: 'Site Settings' }].map(item => (
              <div key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => { setView(item.id); setSaved('') }}>
                <span>{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="signout-btn" onClick={() => { sessionStorage.removeItem('bth_admin'); setAuthed(false) }}>Sign out</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main-area">
          <div className="main-topbar">
            <div>
              <div className="main-topbar-title">{pageLabels[view] || (view === 'testimonials' ? 'Testimonials' : 'Site Settings')}</div>
              <div className="main-topbar-sub">{['home','business','individual','contact'].includes(view) ? 'Left: edit fields · Right: live preview exactly as it appears on your site' : view === 'testimonials' ? 'Manage client testimonials' : 'Update contact info and global settings'}</div>
            </div>
            <div className="save-bar">
              {saved && <span className="save-success">✓ {saved}</span>}
              {['home','business','individual','contact'].includes(view) && (
                <a className="preview-btn" href={pageLinks[view]} target="_blank">Open live page →</a>
              )}
              {['home','business','individual','contact'].includes(view) && (
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              )}
              {view === 'settings' && (
                <button className="save-btn" onClick={saveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
              )}
            </div>
          </div>

          {/* HOME */}
          {view === 'home' && (
            <div className="editor-layout">
              <div className="editor-fields">
                <div className="field-section">
                  <div className="field-section-title">Hero — Top of the homepage</div>
                  <div className="field">
                    <div className="field-label">Main headline</div>
                    <span className="field-hint">White text. Large. First thing visitors read.</span>
                    <input className="field-input" value={c.hero_headline || ''} onChange={e => u('hero_headline', e.target.value)} placeholder="Navigate. Elevate." />
                  </div>
                  <div className="field">
                    <div className="field-label">Gold accent line</div>
                    <span className="field-hint">Gold italic text. Appears on the line below the headline.</span>
                    <input className="field-input accent" value={c.hero_accent || ''} onChange={e => u('hero_accent', e.target.value)} placeholder="Transform." />
                  </div>
                  <div className="field">
                    <div className="field-label">Subheadline</div>
                    <span className="field-hint">One or two sentences. Appears below the headline in smaller text.</span>
                    <textarea className="field-input" value={c.hero_subheadline || ''} onChange={e => u('hero_subheadline', e.target.value)} placeholder="Strategic guidance for leaders..." rows={3} />
                  </div>
                </div>
                <div className="field-section">
                  <div className="field-section-title">About — Your photo and bio section</div>
                  <div className="field">
                    <div className="field-label">Your photo</div>
                    <span className="field-hint">Professional headshot or portrait. Recommended: at least 800x1000px.</span>
                    <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                      <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} style={{display:'none'}} />
                      {c.about_photo
                        ? <><img src={c.about_photo} alt="About" className="upload-preview" /><div className="upload-label">Click to replace</div></>
                        : <><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{uploading ? 'Uploading...' : 'Click to upload your photo'}</div><div className="upload-label">JPG or PNG</div></>
                      }
                    </div>
                  </div>
                  <div className="field">
                    <div className="field-label">Section title</div>
                    <span className="field-hint">Heading above your bio.</span>
                    <input className="field-input" value={c.about_title || ''} onChange={e => u('about_title', e.target.value)} placeholder="Leadership forged through experience." />
                  </div>
                  <div className="field">
                    <div className="field-label">Bio — first paragraph</div>
                    <span className="field-hint">Introduce yourself and your background.</span>
                    <textarea className="field-input" value={c.about_body_1 || ''} onChange={e => u('about_body_1', e.target.value)} rows={4} placeholder="John McCracken is a retired U.S. Navy Captain..." />
                  </div>
                  <div className="field">
                    <div className="field-label">Bio — second paragraph</div>
                    <span className="field-hint">What you offer your clients.</span>
                    <textarea className="field-input" value={c.about_body_2 || ''} onChange={e => u('about_body_2', e.target.value)} rows={4} placeholder="Whether you are leading a team through change..." />
                  </div>
                  <div className="field">
                    <div className="field-label">Credentials</div>
                    <span className="field-hint">One credential per line. Each one appears as a separate line item below your bio.</span>
                    <textarea className="field-input" value={c.about_credentials || ''} onChange={e => u('about_credentials', e.target.value)} rows={5} placeholder={"CAPT, USN (Ret.) — U.S. Navy\nExecutive MBA (EMBA)\nACC Certified Coach — ICF"} />
                  </div>
                </div>
              </div>

              {/* HOME PREVIEW - exact site markup */}
              <div className="editor-preview">
                <div className="preview-section-label">↓ Live preview — this is exactly how your homepage looks to visitors</div>
                <div className="site-preview">
                  <style>{`
                    .site-preview { font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }
                            :root {
          --navy: #0D1B2A;
          --navy-mid: #1A2E45;
          --slate: #4C78A0;
          --slate-light: #6B9ABF;
          --gold: #C9A23A;
          --gold-light: #D4B563;
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --white: #FFFFFF;
          --text-body: #2C3E50;
          --text-muted: #6B7A8D;
          --border: rgba(13,27,42,0.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }

        /* REVEAL ANIMATIONS */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; }
        .reveal.delay-2 { transition-delay: 0.2s; }
        .reveal.delay-3 { transition-delay: 0.3s; }
        .reveal.delay-4 { transition-delay: 0.4s; }
        .reveal.delay-5 { transition-delay: 0.5s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* SPLIT TEXT */
        .split-text .word { display: inline-block; opacity: 0; transform: translateY(20px); animation: none; }
        .split-text.revealed .word { animation: wordIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes wordIn { to { opacity: 1; transform: translateY(0); } }

        /* MAGNETIC */
        .btn-magnetic { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1) !important; }

        /* HERO */
        .hero { min-height: 100vh; background: var(--navy); position: relative; overflow: hidden; display: flex; align-items: center; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #1B3A5C 100%); will-change: transform; }
        .hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; will-change: transform; }
        .hero-gold-line { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, transparent, var(--gold), transparent); animation: shimmer 3s ease-in-out infinite; }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 140px 60px 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .hero-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 6.5vw, 82px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 28px; letter-spacing: -0.01em; opacity: 0; animation: fadeUp 0.9s 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-headline em { font-style: italic; color: var(--gold); }
        .hero-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.7); margin-bottom: 44px; max-width: 460px; opacity: 0; animation: fadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.9s 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(24px); } }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); font-weight: 500; cursor: pointer; border: none; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); }
        .btn-outline { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.3); }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
        .hero-right { display: flex; flex-direction: column; gap: 16px; opacity: 0; animation: fadeIn 1.2s 0.8s ease forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        .hero-stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,162,58,0.2); padding: 28px 32px; backdrop-filter: blur(10px); transition: all 0.3s; }
        .hero-stat-card:hover { background: rgba(201,162,58,0.08); border-color: rgba(201,162,58,0.4); transform: translateX(6px); }
        .hero-stat-card:first-child { border-left: 3px solid var(--gold); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: rgba(247,244,237,0.6); letter-spacing: 0.06em; line-height: 1.5; }

        /* INTRO STRIP */
        .intro-strip { background: var(--gold); padding: 20px 60px; display: flex; justify-content: center; gap: 60px; align-items: center; overflow: hidden; }
        .intro-item { font-size: 0.72rem; color: var(--navy); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
        .intro-dot { width: 4px; height: 4px; background: var(--navy); border-radius: 50%; opacity: 0.4; flex-shrink: 0; }

        /* ABOUT */
        .about { padding: 140px 60px; background: var(--ivory); }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .about-image { position: relative; }
        .about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, var(--navy-mid), var(--slate)); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; overflow: hidden; }
        .about-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,42,0.3), transparent); }
        .about-badge { position: absolute; bottom: -20px; right: -20px; background: var(--gold); padding: 24px 28px; }
        .about-badge-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy); line-height: 1; }
        .about-badge-label { font-size: 0.65rem; color: var(--navy); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; opacity: 0.7; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; letter-spacing: -0.01em; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .credentials { display: flex; flex-direction: column; gap: 10px; margin: 32px 0; }
        .credential { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .credential::before { content: ''; width: 20px; height: 1px; background: var(--gold); flex-shrink: 0; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); }

        /* SERVICES */
        .services { padding: 140px 60px; background: var(--navy); }
        .services-inner { max-width: 1200px; margin: 0 auto; }
        .services-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--white); letter-spacing: -0.01em; }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .service-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 48px 40px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); cursor: pointer; position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s ease; }
        .service-card:hover::before { width: 3px; }
        .service-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .service-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: rgba(201,162,58,0.15); line-height: 1; margin-bottom: 20px; transition: color 0.3s; }
        .service-card:hover .service-num { color: rgba(201,162,58,0.3); }
        .service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--white); margin-bottom: 14px; }
        .service-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.5); margin-bottom: 28px; }
        .service-link { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.3s; font-weight: 500; }
        .service-link:hover { gap: 14px; }

        /* APPROACH */
        .approach { padding: 140px 60px; background: var(--ivory-dark); }
        .approach-inner { max-width: 1200px; margin: 0 auto; }
        .approach-header { text-align: center; margin-bottom: 80px; }
        .approach-header .eyebrow { justify-content: center; }
        .approach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .approach-card { background: var(--white); padding: 48px 36px; border-bottom: 3px solid transparent; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .approach-card:hover { border-bottom-color: var(--gold); transform: translateY(-8px); box-shadow: 0 20px 60px rgba(13,27,42,0.08); }
        .approach-icon { width: 56px; height: 56px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background 0.3s; }
        .approach-card:hover .approach-icon { background: var(--gold); }
        .approach-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--navy); margin-bottom: 14px; }
        .approach-desc { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* TESTIMONIALS */
        .testimonials { padding: 140px 60px; background: var(--navy); }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials-header .eyebrow-light { justify-content: center; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 40px 32px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .testimonial-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-6px); border-color: rgba(201,162,58,0.2); }
        .testimonial-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; line-height: 1.7; color: rgba(247,244,237,0.75); margin-bottom: 28px; }
        .quote-mark { font-size: 4rem; color: var(--gold); opacity: 0.25; line-height: 0; vertical-align: -0.5em; display: inline-block; margin-right: 4px; font-family: 'Cormorant Garamond', serif; }
        .testimonial-author { font-size: 0.8rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .testimonial-role { font-size: 0.75rem; color: rgba(247,244,237,0.35); margin-top: 4px; }

        /* CTA */
        .cta-section { padding: 140px 60px; background: var(--ivory); }
        .cta-inner { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px, 6vw, 72px); font-weight: 600; line-height: 1.05; color: var(--navy); margin-bottom: 24px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 44px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-outline-navy { background: transparent; color: var(--navy); border: 1px solid rgba(13,27,42,0.25); }
        .btn-outline-navy:hover { border-color: var(--navy); }



        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; padding: 120px 24px 80px; gap: 48px; }
          .hero-headline { font-size: clamp(40px, 10vw, 64px); }
          .hero-right { flex-direction: row; flex-wrap: wrap; gap: 12px; }
          .hero-stat-card { flex: 1; min-width: 140px; padding: 20px; }
          .stat-num { font-size: 2rem; }
          .about { padding: 80px 24px; }
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-photo { aspect-ratio: 4/3; }
          .about-badge { display: none; }
          .services { padding: 80px 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .service-card { padding: 32px 24px; }
          .approach { padding: 80px 24px; }
          .approach-grid { grid-template-columns: 1fr; gap: 20px; }
          .approach-card { padding: 32px 24px; }
          .testimonials { padding: 80px 24px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .testimonial-card { padding: 28px 24px; }
          .cta-section { padding: 80px 24px; }
          .cta-title { font-size: clamp(36px, 8vw, 56px); }
          .intro-strip { gap: 16px; padding: 14px 24px; flex-wrap: wrap; justify-content: flex-start; }
          .section-title { font-size: clamp(32px, 6vw, 48px); }
          .section-title-light { font-size: clamp(32px, 6vw, 48px); }
        }
        @media (max-width: 540px) {
          .hero-content { padding: 100px 20px 60px; }
          .hero-headline { font-size: clamp(36px, 9vw, 52px); }
          .hero-right { flex-direction: column; }
          .hero-stat-card { min-width: unset; }
          .hero-btns { flex-direction: column; }
          .hero-btns .btn { width: 100%; justify-content: center; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
          .services-header { gap: 12px; }
          .testimonials-header, .approach-header, .cta-inner { text-align: left; }
          .testimonials-header .eyebrow-light, .approach-header .eyebrow, .cta-inner .eyebrow { justify-content: flex-start; }
        }

                    .site-preview .hero { min-height: unset; }
                    .site-preview .hero-content { padding: 60px 40px 60px; }
                    .site-preview .hero-eyebrow { animation: none; opacity: 1; }
                    .site-preview .hero-headline { animation: none; opacity: 1; font-size: clamp(32px, 4vw, 52px); }
                    .site-preview .hero-desc { animation: none; opacity: 1; }
                    .site-preview .hero-btns { animation: none; opacity: 1; }
                    .site-preview .hero-right { animation: none; opacity: 1; }
                    .site-preview .about { padding: 60px 40px; }
                    .site-preview .reveal { opacity: 1; transform: none; }
                    .site-preview .btn { cursor: default; }
                    .site-preview .btn-magnetic { transform: none !important; }
                  `}</style>

                  <section className="hero">
                    <div className="hero-bg" />
                    <div className="hero-pattern" />
                    <div className="hero-gold-line" />
                    <div className="hero-content">
                      <div className="hero-left">
                        <div className="hero-eyebrow">Executive Coaching and Consulting</div>
                        <h1 className="hero-headline">
                          {(c.hero_headline || 'Navigate.\nElevate.').split('\n').map((line, i) => (
                            <span key={i} style={{display:'block'}}>{line}</span>
                          ))}
                          <em>{c.hero_accent || 'Transform.'}</em>
                        </h1>
                        <p className="hero-desc">{c.hero_subheadline || 'Strategic guidance for leaders who are ready to go beyond the horizon. Executive coaching and consulting designed to help you lead with confidence and purpose.'}</p>
                        <div className="hero-btns">
                          <span className="btn btn-gold">Schedule a Session →</span>
                          <span className="btn btn-outline">Explore Coaching →</span>
                        </div>
                      </div>
                      <div className="hero-right">
                        <div className="hero-stat-card">
                          <div className="stat-num">20+</div>
                          <div className="stat-label">Years of leadership experience in the U.S. Navy and private sector</div>
                        </div>
                        <div className="hero-stat-card">
                          <div className="stat-num">EMBA</div>
                          <div className="stat-label">Executive MBA and ACC certified coach through the ICF</div>
                        </div>
                        <div className="hero-stat-card">
                          <div className="stat-num">CAPT</div>
                          <div className="stat-label">Retired U.S. Navy Captain with proven leadership at every level</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="intro-strip">
                    <div className="intro-item">Business Coaching</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Individual Coaching</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Executive Leadership</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Strategic Consulting</div>
                  </div>

                  <section className="about">
                    <div className="about-inner">
                      <div className="about-image">
                        <div className="about-photo">
                          {c.about_photo
                            ? <img src={c.about_photo} alt="John McCracken" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                            : 'Your photo will appear here'}
                        </div>
                        <div className="about-badge">
                          <div className="about-badge-num">20+</div>
                          <div className="about-badge-label">Years Leading</div>
                        </div>
                      </div>
                      <div className="about-content">
                        <div className="eyebrow">About John McCracken</div>
                        <h2 className="section-title">{c.about_title || 'Leadership forged through experience.'}</h2>
                        <p className="body-text">{c.about_body_1 || 'John McCracken is a retired U.S. Navy Captain and certified executive coach with over two decades of leadership experience.'}</p>
                        {c.about_body_2 && <p className="body-text">{c.about_body_2}</p>}
                        <div className="credentials">
                          {(c.about_credentials || 'CAPT, USN (Ret.) — U.S. Navy\nExecutive MBA (EMBA)\nACC Certified Coach — International Coaching Federation\nFounder, Beyond the Horizon Executive Coaching and Consulting').split('\n').filter(Boolean).map((cred, i) => (
                            <div key={i} className="credential">{cred}</div>
                          ))}
                        </div>
                        <span className="btn btn-navy" style={{display:'inline-flex',marginTop:8}}>Work with John →</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* BUSINESS / INDIVIDUAL / CONTACT */}
          {['business','individual','contact'].includes(view) && (
            <div className="editor-layout">
              <div className="editor-fields">
                <div className="field-section">
                  <div className="field-section-title">Hero — Top of the {pageLabels[view]} page</div>
                  <div className="field">
                    <div className="field-label">Main headline</div>
                    <span className="field-hint">White text. Large. First thing visitors read on this page.</span>
                    <input className="field-input" value={c.headline || ''} onChange={e => u('headline', e.target.value)} placeholder={view === 'business' ? 'Coaching that moves' : view === 'individual' ? 'Invest in the leader' : "Let's start a"} />
                  </div>
                  <div className="field">
                    <div className="field-label">Gold accent line</div>
                    <span className="field-hint">Gold italic text. Appears on the next line after the headline.</span>
                    <input className="field-input accent" value={c.headline_accent || ''} onChange={e => u('headline_accent', e.target.value)} placeholder={view === 'business' ? 'your business forward.' : view === 'individual' ? 'you are becoming.' : 'conversation.'} />
                  </div>
                  <div className="field">
                    <div className="field-label">Subheadline</div>
                    <span className="field-hint">One or two sentences. Appears below the headline.</span>
                    <textarea className="field-input" value={c.subheadline || ''} onChange={e => u('subheadline', e.target.value)} rows={3} placeholder="Describe this service in one or two sentences..." />
                  </div>
                </div>
              </div>
              <div className="editor-preview">
                <div className="preview-section-label">↓ Live preview — exactly how this page looks to visitors</div>
                <div className="site-preview-page">
                  <style>{`
                    .site-preview-page { font-family: 'Inter', sans-serif; font-weight: 300; }
                            :root {
          --navy: #0D1B2A; --navy-mid: #1A2E45; --slate: #4C78A0;
          --gold: #C9A23A; --gold-light: #D4B563;
          --ivory: #F7F4ED; --ivory-dark: #EDE8DC;
          --white: #FFFFFF; --text-body: #2C3E50; --text-muted: #6B7A8D;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; } .reveal.delay-2 { transition-delay: 0.2s; } .reveal.delay-3 { transition-delay: 0.3s; } .reveal.delay-4 { transition-delay: 0.4s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* HERO */
        .page-hero { min-height: 70vh; background: var(--navy); display: flex; align-items: center; position: relative; overflow: hidden; }
        .page-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, #1A2E45 60%, #1B3A5C 100%); }
        .page-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .page-hero-line { position: absolute; left: 60px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(201,162,58,0.3), transparent); }
        .page-hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 160px 60px 100px; width: 100%; }
        .breadcrumb { font-size: 0.68rem; color: rgba(247,244,237,0.4); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
        .breadcrumb a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { opacity: 0.3; }
        .page-eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .page-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px, 7vw, 88px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 24px; max-width: 800px; }
        .page-hero-title em { font-style: italic; color: var(--gold); }
        .page-hero-desc { font-size: 1.05rem; line-height: 1.8; color: rgba(247,244,237,0.65); max-width: 580px; margin-bottom: 44px; }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.25); }
        .btn-outline-light:hover { border-color: var(--gold); color: var(--gold); }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

        /* INTRO */
        .intro { padding: 100px 60px; background: var(--ivory); }
        .intro-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .intro-right { padding-top: 16px; }
        .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 32px; }
        .stat-box { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 28px 24px; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

        /* OFFERINGS */
        .offerings { padding: 100px 60px; background: var(--navy); }
        .offerings-inner { max-width: 1200px; margin: 0 auto; }
        .offerings-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--white); }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .offerings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .offering-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 40px 32px; transition: all 0.4s; position: relative; overflow: hidden; }
        .offering-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s; }
        .offering-card:hover::before { width: 3px; }
        .offering-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .offering-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.15); margin-bottom: 16px; line-height: 1; }
        .offering-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--white); margin-bottom: 12px; }
        .offering-desc { font-size: 0.87rem; line-height: 1.75; color: rgba(247,244,237,0.5); }

        /* WHO */
        .who { padding: 100px 60px; background: var(--ivory-dark); }
        .who-inner { max-width: 1200px; margin: 0 auto; }
        .who-header { text-align: center; margin-bottom: 64px; }
        .who-header .eyebrow { justify-content: center; }
        .who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .who-card { background: var(--white); padding: 36px 28px; border-bottom: 3px solid transparent; transition: all 0.4s; }
        .who-card:hover { border-bottom-color: var(--gold); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(13,27,42,0.08); }
        .who-icon { width: 48px; height: 48px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.2rem; transition: background 0.3s; }
        .who-card:hover .who-icon { background: var(--gold); }
        .who-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--navy); margin-bottom: 10px; }
        .who-desc { font-size: 0.86rem; line-height: 1.7; color: var(--text-muted); }

        /* PROCESS */
        .process { padding: 100px 60px; background: var(--ivory); }
        .process-inner { max-width: 1200px; margin: 0 auto; }
        .process-header { margin-bottom: 64px; }
        .process-steps { display: flex; flex-direction: column; gap: 2px; }
        .process-step { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 32px 40px; display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: start; transition: border-color 0.3s; }
        .process-step:hover { border-color: rgba(201,162,58,0.3); }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.25); line-height: 1; min-width: 48px; }
        .step-content h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
        .step-content p { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* CTA */
        .cta-section { padding: 120px 60px; background: var(--navy); }
        .cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow-light { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 6vw, 64px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 20px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.6); margin-bottom: 40px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .page-hero-content { padding: 140px 24px 80px; }
          .page-hero-title { font-size: clamp(40px, 9vw, 64px); }
          .intro { padding: 72px 24px; }
          .intro-inner { grid-template-columns: 1fr; gap: 48px; }
          .offerings { padding: 72px 24px; }
          .offerings-grid { grid-template-columns: 1fr; }
          .who { padding: 72px 24px; }
          .who-grid { grid-template-columns: 1fr; }
          .process { padding: 72px 24px; }
          .process-step { grid-template-columns: auto 1fr; gap: 20px; padding: 24px; }
          .cta-section { padding: 80px 24px; }
          .stat-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .hero-btns { flex-direction: column; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
          .stat-row { grid-template-columns: 1fr; }
        }

                    .site-preview-page .page-hero { min-height: unset; }
                    .site-preview-page .page-hero-content { padding: 80px 40px 60px; }
                    .site-preview-page .btn { cursor: default; }
                    .site-preview-page .reveal { opacity: 1 !important; transform: none !important; }
                  `}</style>
                  <div className="page-hero">
                    <div className="page-hero-bg" />
                    <div className="page-hero-pattern" />
                    <div className="page-hero-line" />
                    <div className="page-hero-content">
                      <div className="breadcrumb">
                        <a href="/" style={{color:'rgba(247,244,237,0.4)',textDecoration:'none'}}>Home</a>
                        <span className="breadcrumb-sep">→</span>
                        <span>{pageLabels[view]}</span>
                      </div>
                      <div className="page-eyebrow">
                        {view === 'business' ? 'For Organizations and Teams' : view === 'individual' ? 'One on One Coaching' : 'Get in Touch'}
                      </div>
                      <h1 className="page-hero-title">
                        {c.headline || (view === 'business' ? 'Coaching that moves' : view === 'individual' ? 'Invest in the leader' : "Let's start a")}<br />
                        <em>{c.headline_accent || (view === 'business' ? 'your business forward.' : view === 'individual' ? 'you are becoming.' : 'conversation.')}</em>
                      </h1>
                      <p className="page-hero-desc">{c.subheadline || 'Your subheadline will appear here.'}</p>
                      <div className="hero-btns">
                        <span className="btn btn-gold">Schedule a Consultation →</span>
                        {view !== 'contact' && <span className="btn btn-outline-light">View Offerings →</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {view === 'testimonials' && (
            <div className="editor-layout">
              <div className="editor-fields" style={{gridColumn:'1/-1'}}>
                <div className="t-manager">
                  <button className="add-t-btn" onClick={() => setAddingT(!addingT)}>+ Add New Testimonial</button>
                  {addingT && (
                    <div style={{background:'#12151E',border:'1px solid rgba(255,255,255,0.06)',padding:24,marginBottom:20}}>
                      <div className="field-section-title" style={{marginBottom:16}}>New Testimonial</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                        <div className="field">
                          <div className="field-label">Client name *</div>
                          <input className="field-input" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} placeholder="Full name" />
                        </div>
                        <div className="field">
                          <div className="field-label">Title or role</div>
                          <input className="field-input" value={newT.role} onChange={e => setNewT({...newT, role: e.target.value})} placeholder="CEO, VP of Operations, etc." />
                        </div>
                        <div className="field">
                          <div className="field-label">Company</div>
                          <input className="field-input" value={newT.company} onChange={e => setNewT({...newT, company: e.target.value})} placeholder="Company name" />
                        </div>
                      </div>
                      <div className="field">
                        <div className="field-label">What they said *</div>
                        <span className="field-hint">Copy their exact words. Do not add quote marks — the site adds them automatically.</span>
                        <textarea className="field-input" value={newT.quote} onChange={e => setNewT({...newT, quote: e.target.value})} rows={5} placeholder="Paste the testimonial here..." />
                      </div>
                      <div style={{display:'flex',gap:10,marginTop:16}}>
                        <button className="save-btn" onClick={addTestimonial}>Add Testimonial</button>
                        <button style={{background:'none',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.35)',padding:'9px 16px',fontSize:11,cursor:'pointer'}} onClick={() => setAddingT(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {testimonials.length === 0 && !addingT && (
                    <div style={{color:'rgba(255,255,255,0.25)',fontSize:13,padding:'24px 0'}}>No testimonials yet. Click the button above to add your first one.</div>
                  )}
                  {testimonials.map(t => (
                    <div key={t.id} className="t-item">
                      <div className="t-item-top">
                        <div>
                          <div className="t-item-name">{t.name}</div>
                          {(t.role || t.company) && <div className="t-item-meta">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                        </div>
                        <div className="t-actions">
                          <span className={`t-status ${t.is_active ? 'on' : 'off'}`}>{t.is_active ? '● Showing on site' : '○ Hidden'}</span>
                          <button className="t-btn" onClick={() => toggleT(t.id, t.is_active)}>{t.is_active ? 'Hide' : 'Show'}</button>
                          <button className="t-btn del" onClick={() => deleteT(t.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="t-item-quote">"{t.quote}"</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {view === 'settings' && (
            <div className="editor-layout">
              <div className="editor-fields">
                <div className="field-section">
                  <div className="field-section-title">Contact Information</div>
                  {[
                    { key: 'phone', label: 'Phone number', hint: 'Appears in the footer and contact page.' },
                    { key: 'email', label: 'Email address', hint: 'Where contact form submissions are sent.' },
                    { key: 'linkedin', label: 'LinkedIn URL', hint: 'Optional. Leave blank if you do not want a LinkedIn link.' },
                    { key: 'tagline', label: 'Tagline', hint: 'Short line shown under your name in the footer.' },
                  ].map(({ key, label, hint }) => (
                    <div key={key} className="field">
                      <div className="field-label">{label}</div>
                      <span className="field-hint">{hint}</span>
                      <input className="field-input" value={getSetting(key)} onChange={e => updateSetting(key, e.target.value)} placeholder={key} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="editor-preview">
                <div className="preview-section-label">Footer — how your contact info appears at the bottom of every page</div>
                <div className="preview-footer">
                  <div className="preview-footer-name">Beyond the Horizon</div>
                  <div className="preview-footer-sub">{getSetting('tagline') || 'Executive Coaching and Consulting'}</div>
                  <div className="preview-footer-item">📧 {getSetting('email') || 'john@mccrackencoaching.com'}</div>
                  <div className="preview-footer-item">📞 {getSetting('phone') || '703.343.6960'}</div>
                  {getSetting('linkedin') && <div className="preview-footer-item">🔗 {getSetting('linkedin')}</div>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}