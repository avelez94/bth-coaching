'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Page = { id: string; slug: string; title: string; content: Record<string, string> }
type Testimonial = { id: string; name: string; role: string; company: string; quote: string; is_active: boolean; sort_order: number }
type SiteSetting = { id: string; key: string; value: string }

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
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
  .login-btn { width: 100%; background: #C9A23A; color: #0D1B2A; border: none; padding: 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .login-btn:hover { opacity: 0.9; }
  .login-error { font-size: 12px; color: #e74c3c; margin-bottom: 12px; }

  /* LAYOUT */
  .admin-wrap { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .sidebar { background: #1A1D27; border-right: 1px solid rgba(255,255,255,0.06); padding: 32px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .sidebar-logo { padding: 0 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px; }
  .sidebar-logo-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: #fff; margin-bottom: 2px; }
  .sidebar-logo-sub { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; }
  .sidebar-label { font-size: 0.6rem; color: rgba(255,255,255,0.25); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 24px; margin-bottom: 8px; margin-top: 24px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 24px; font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; }
  .sidebar-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
  .sidebar-item.active { color: #C9A23A; border-left-color: #C9A23A; background: rgba(201,162,58,0.06); }
  .sidebar-icon { font-size: 14px; width: 18px; text-align: center; }
  .sidebar-logout { margin-top: auto; padding: 24px 24px 0; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 32px; }
  .logout-btn { font-size: 12px; color: rgba(255,255,255,0.3); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .logout-btn:hover { color: #e74c3c; }

  /* MAIN */
  .main { padding: 48px; overflow-y: auto; background: #0F1117; }
  .page-header { margin-bottom: 40px; }
  .page-title { font-size: 1.6rem; font-weight: 600; color: #FFFFFF; margin-bottom: 6px; }
  .page-sub { font-size: 13px; color: rgba(255,255,255,0.5); }

  /* CARDS */
  .card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 32px; margin-bottom: 20px; }
  .card-title { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .field-group { margin-bottom: 20px; }
  .field-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; font-weight: 500; }
  .field-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.08); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 13px; padding: 11px 14px; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #C9A23A; }
  textarea.field-input { resize: vertical; min-height: 100px; line-height: 1.6; }
  .save-btn { background: #C9A23A; color: #0D1B2A; border: none; padding: 12px 28px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s; }
  .save-btn:hover:not(:disabled) { opacity: 0.9; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .save-success { font-size: 12px; color: #27ae60; margin-left: 12px; }
  .save-row { display: flex; align-items: center; margin-top: 24px; }

  /* TESTIMONIALS */
  .testimonial-card { background: #0F1117; border: 1px solid rgba(255,255,255,0.06); padding: 24px; margin-bottom: 12px; }
  .testimonial-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .testimonial-name { font-size: 14px; font-weight: 500; color: #fff; }
  .testimonial-actions { display: flex; gap: 8px; }
  .action-btn { background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.2s; }
  .action-btn:hover { border-color: #C9A23A; color: #C9A23A; }
  .action-btn.danger:hover { border-color: #e74c3c; color: #e74c3c; }
  .add-btn { background: rgba(201,162,58,0.1); border: 1px solid rgba(201,162,58,0.2); color: #C9A23A; padding: 10px 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .add-btn:hover { background: rgba(201,162,58,0.15); }
  .toggle { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.5); }
  .toggle input { accent-color: #C9A23A; width: 14px; height: 14px; }

  /* GRID */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  @media (max-width: 768px) {
    .admin-wrap { grid-template-columns: 1fr; }
    .sidebar { position: fixed; left: 0; top: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform 0.3s; width: 240px; }
    .sidebar.open { transform: translateX(0); }
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
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', company: '', quote: '' })
  const [addingTestimonial, setAddingTestimonial] = useState(false)

  useEffect(() => {
    const a = sessionStorage.getItem('bth_admin')
    if (a === 'true') { setAuthed(true); fetchAll() }
  }, [])

  async function login() {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        sessionStorage.setItem('bth_admin', 'true')
        setAuthed(true)
        fetchAll()
      } else {
        setLoginError('Incorrect password.')
      }
    } catch {
      setLoginError('Something went wrong. Try again.')
    }
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

  async function savePage() {
    if (!editingPage) return
    setSaving(true)
    await supabase.from('pages').update({ content: editingPage.content, title: editingPage.title, updated_at: new Date().toISOString() }).eq('id', editingPage.id)
    setSaving(false)
    setSaved('Saved')
    setTimeout(() => setSaved(''), 2000)
    fetchAll()
  }

  async function saveSettings() {
    setSaving(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('id', s.id)))
    setSaving(false)
    setSaved('Saved')
    setTimeout(() => setSaved(''), 2000)
  }

  async function addTestimonial() {
    if (!newTestimonial.name || !newTestimonial.quote) return
    await supabase.from('testimonials').insert({ ...newTestimonial, is_active: true, sort_order: testimonials.length })
    setNewTestimonial({ name: '', role: '', company: '', quote: '' })
    setAddingTestimonial(false)
    fetchAll()
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchAll()
  }

  async function toggleTestimonial(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id)
    fetchAll()
  }

  function updatePageContent(key: string, value: string) {
    if (!editingPage) return
    setEditingPage({ ...editingPage, content: { ...editingPage.content, [key]: value } })
  }

  function updateSetting(key: string, value: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s))
  }

  const pageLabels: Record<string, Record<string, string>> = {
    home: { hero_headline: 'Hero Headline', hero_subheadline: 'Hero Subheadline', about_title: 'About Section Title', about_body: 'About Section Body' },
    business: { headline: 'Page Headline', subheadline: 'Page Subheadline' },
    individual: { headline: 'Page Headline', subheadline: 'Page Subheadline' },
    contact: { headline: 'Page Headline', subheadline: 'Page Subheadline' },
  }

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Beyond the Horizon</div>
          <div className="login-sub">Content Management</div>
          <div className="login-title">Admin Login</div>
          {loginError && <div className="login-error">{loginError}</div>}
          <input className="login-input" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          <button className="login-btn" onClick={login}>Sign In →</button>
        </div>
      </div>
    </>
  )

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home Page' },
    { id: 'business', icon: '💼', label: 'Business Coaching' },
    { id: 'individual', icon: '👤', label: 'Individual Coaching' },
    { id: 'contact', icon: '📧', label: 'Contact Page' },
    { id: 'testimonials', icon: '💬', label: 'Testimonials' },
    { id: 'settings', icon: '⚙️', label: 'Site Settings' },
  ]

  const currentPage = pages.find(p => p.slug === view)

  return (
    <>
      <style>{STYLES}</style>
      <div className="admin-wrap">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Beyond the Horizon</div>
            <div className="sidebar-logo-sub">Content Management</div>
          </div>
          <div className="sidebar-label">Pages</div>
          {navItems.slice(0, 4).map(item => (
            <div key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => { setView(item.id); setEditingPage(pages.find(p => p.slug === item.id) || null); setSaved('') }}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
          <div className="sidebar-label">Content</div>
          {navItems.slice(4).map(item => (
            <div key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => { setView(item.id); setSaved('') }}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
          <div className="sidebar-logout">
            <button className="logout-btn" onClick={() => { sessionStorage.removeItem('bth_admin'); setAuthed(false) }}>Sign out</button>
          </div>
        </div>

        <div className="main">
          {/* PAGE EDITOR */}
          {['home', 'business', 'individual', 'contact'].includes(view) && (
            <>
              <div className="page-header">
                <div className="page-title">{navItems.find(n => n.id === view)?.label}</div>
                <div className="page-sub">Edit the content for this page. Changes go live immediately when saved.</div>
              </div>
              {currentPage && (
                <div className="card">
                  <div className="card-title">Page Content</div>
                  {Object.entries(pageLabels[view] || {}).map(([key, label]) => (
                    <div key={key} className="field-group">
                      <div className="field-label">{label}</div>
                      {key.includes('body') || key.includes('headline') && currentPage.content[key]?.length > 80 ? (
                        <textarea className="field-input" value={currentPage.content[key] || ''} onChange={e => updatePageContent(key, e.target.value)} rows={4} />
                      ) : (
                        <input className="field-input" type="text" value={currentPage.content[key] || ''} onChange={e => updatePageContent(key, e.target.value)} />
                      )}
                    </div>
                  ))}
                  <div className="save-row">
                    <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    {saved && <span className="save-success">✓ {saved}</span>}
                  </div>
                </div>
              )}
              <div className="card" style={{marginTop:8}}>
                <div className="card-title">Preview</div>
                <a href={`/${view === 'home' ? '' : view}`} target="_blank" style={{fontSize:13,color:'#C9A23A',textDecoration:'none'}}>Open {view === 'home' ? 'homepage' : view} page →</a>
              </div>
            </>
          )}

          {/* TESTIMONIALS */}
          {view === 'testimonials' && (
            <>
              <div className="page-header">
                <div className="page-title">Testimonials</div>
                <div className="page-sub">Add, edit, and manage client testimonials. Only active testimonials appear on the site.</div>
              </div>
              <button className="add-btn" onClick={() => setAddingTestimonial(!addingTestimonial)}>+ Add Testimonial</button>
              {addingTestimonial && (
                <div className="card">
                  <div className="card-title">New Testimonial</div>
                  <div className="two-col">
                    <div className="field-group">
                      <div className="field-label">Client Name *</div>
                      <input className="field-input" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} placeholder="Full name" />
                    </div>
                    <div className="field-group">
                      <div className="field-label">Title or Role</div>
                      <input className="field-input" value={newTestimonial.role} onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})} placeholder="CEO, Executive Director, etc." />
                    </div>
                    <div className="field-group">
                      <div className="field-label">Company</div>
                      <input className="field-input" value={newTestimonial.company} onChange={e => setNewTestimonial({...newTestimonial, company: e.target.value})} placeholder="Company name" />
                    </div>
                  </div>
                  <div className="field-group">
                    <div className="field-label">Testimonial *</div>
                    <textarea className="field-input" value={newTestimonial.quote} onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})} placeholder="What did they say..." rows={4} />
                  </div>
                  <div className="save-row">
                    <button className="save-btn" onClick={addTestimonial}>Add Testimonial</button>
                    <button className="action-btn" style={{marginLeft:12}} onClick={() => setAddingTestimonial(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {testimonials.length === 0 && <div style={{color:'rgba(255,255,255,0.3)',fontSize:13,padding:'24px 0'}}>No testimonials yet. Add your first one above.</div>}
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      {(t.role || t.company) && <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginTop:3}}>{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                    </div>
                    <div className="testimonial-actions">
                      <label className="toggle">
                        <input type="checkbox" checked={t.is_active} onChange={() => toggleTestimonial(t.id, t.is_active)} />
                        {t.is_active ? 'Active' : 'Hidden'}
                      </label>
                      <button className="action-btn danger" onClick={() => deleteTestimonial(t.id)}>Delete</button>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.55)',fontStyle:'italic',lineHeight:1.65}}>"{t.quote}"</div>
                </div>
              ))}
            </>
          )}

          {/* SETTINGS */}
          {view === 'settings' && (
            <>
              <div className="page-header">
                <div className="page-title">Site Settings</div>
                <div className="page-sub">Update contact info, social links, and other global site settings.</div>
              </div>
              <div className="card">
                <div className="card-title">Contact Information</div>
                {settings.map(s => (
                  <div key={s.id} className="field-group">
                    <div className="field-label">{s.key.charAt(0).toUpperCase() + s.key.slice(1).replace('_', ' ')}</div>
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