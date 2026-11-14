'use client'

import { useEffect, useState } from 'react'
import { validateSetting, type SiteSettings } from '@/lib/site-settings'
import type { ViewProps } from '../page'

export interface SettingField {
  key: keyof SiteSettings
  label: string
  help?: string
  placeholder?: string
}

// Loads Site Settings, edits the given fields, validates, and saves.
export function useSettingsForm(fields: SettingField[], { setDirty, toast }: ViewProps) {
  const [saved, setSaved] = useState<SiteSettings | null>(null)
  const [draft, setDraft] = useState<SiteSettings | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { setSaved(d.settings); setDraft(d.settings) })
      .catch(() => toast('Settings could not be loaded. Refresh to try again.', true))
  }, [toast])

  const dirty = !!saved && !!draft && fields.some(f => saved[f.key] !== draft[f.key])
  useEffect(() => { setDirty(dirty) }, [dirty, setDirty])

  async function save() {
    if (!draft || !dirty) return
    const errs: Record<string, string> = {}
    for (const f of fields) { const c = validateSetting(f.key, draft[f.key]); if (!c.ok) errs[f.key] = c.error }
    setErrors(errs)
    if (Object.keys(errs).length) { toast('Some fields need attention before saving.', true); return }
    setSaving(true)
    const changed = Object.fromEntries(fields.filter(f => saved![f.key] !== draft[f.key]).map(f => [f.key, draft[f.key]]))
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: changed }) })
    const data = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { if (data.fieldErrors) setErrors(data.fieldErrors); toast(data.error || 'Could not save. Please try again.', true); return }
    setSaved(data.settings); setDraft(data.settings)
    toast('Changes saved. They are live on your website now.')
  }

  const discard = () => { if (saved) { setDraft(saved); setErrors({}) } }

  const renderField = (f: SettingField) => draft && (
    <div className="field" key={f.key}>
      <label className="field-label" htmlFor={`s-${f.key}`}>{f.label}{saved && saved[f.key] !== draft[f.key] && <span className="changed-dot" />}</label>
      {f.help && <span className="field-hint">{f.help}</span>}
      <input id={`s-${f.key}`} className={`field-input ${errors[f.key] ? 'invalid' : ''}`} value={draft[f.key]} placeholder={f.placeholder}
        onChange={e => { setDraft({ ...draft, [f.key]: e.target.value }); setErrors(x => { const n = { ...x }; delete n[f.key]; return n }) }} />
      {errors[f.key] && <div className="field-error">{errors[f.key]}</div>}
    </div>
  )

  const saveBar = (
    <div className="save-bar">
      {draft && (dirty ? <span className="status-pill unsaved">Unsaved changes</span> : <span className="status-pill saved">All changes saved</span>)}
      {dirty && <button className="ghost-btn" onClick={discard}>Discard</button>}
      <button className="save-btn" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
    </div>
  )

  return { saved, draft, renderField, saveBar }
}
