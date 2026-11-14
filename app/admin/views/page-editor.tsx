'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PAGE_SCHEMA, maxLength, type FieldDef, type PageContent, type PageDef, type PageKey } from '@/lib/site-content'
import type { ViewProps } from '../page'

export default function PageEditor({ page, setDirty, toast }: { page: PageKey } & ViewProps) {
  const def = PAGE_SCHEMA[page] as PageDef
  const [saved, setSaved] = useState<PageContent | null>(null)
  const [draft, setDraft] = useState<PageContent | null>(null)
  const [open, setOpen] = useState<string>(def.sections[0]?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState('')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const frame = useRef<HTMLIFrameElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [draft === null])
  // Desktop preview renders the page at a real laptop width, scaled to fit
  const DESKTOP_W = 1280
  const scale = device === 'desktop' && box.w ? Math.min(1, box.w / DESKTOP_W) : 1

  useEffect(() => {
    fetch(`/api/admin/content?page=${page}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setSaved(d.content); setDraft(d.content) })
      .catch(() => setLoadError('This page could not be loaded. Refresh to try again.'))
  }, [page])

  const changedKeys = useMemo(() => {
    if (!saved || !draft) return [] as string[]
    return Object.keys(draft).filter(k => draft[k] !== saved[k])
  }, [saved, draft])
  const dirty = changedKeys.length > 0
  useEffect(() => { setDirty(dirty) }, [dirty, setDirty])

  // Send the draft to the preview whenever it changes
  const postPreview = () => {
    if (draft) frame.current?.contentWindow?.postMessage({ type: 'bth-preview', page, content: draft }, window.location.origin)
  }
  useEffect(postPreview) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === 'bth-preview-ready') postPreview() }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  })

  function set(key: string, value: string) {
    setDraft(d => (d ? { ...d, [key]: value } : d))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function localErrors(): Record<string, string> {
    const out: Record<string, string> = {}
    if (!draft) return out
    for (const s of def.sections) for (const f of s.fields) {
      const v = (draft[f.key] ?? '').trim()
      if (!v && !f.optional) out[f.key] = `${f.label} cannot be empty.`
      else if (v.length > maxLength(f)) out[f.key] = `Too long: ${v.length} of ${maxLength(f)} characters.`
    }
    return out
  }

  async function save() {
    if (!draft || !dirty) return
    const errs = localErrors()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const firstSection = def.sections.find(s => s.fields.some(f => errs[f.key]))
      if (firstSection) setOpen(firstSection.id)
      toast('Some fields need attention before saving.', true)
      return
    }
    setSaving(true)
    const values = Object.fromEntries(changedKeys.map(k => [k, draft[k]]))
    const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page, values }) })
    const data = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) {
      if (data.fieldErrors) setErrors(data.fieldErrors)
      toast(data.error || 'Could not save. Please try again.', true)
      return
    }
    setSaved(data.content); setDraft(data.content)
    toast('Changes saved. They are live on your website now.')
  }

  function discard() {
    if (!saved) return
    if (!window.confirm('Discard all unsaved changes on this page?')) return
    setDraft(saved); setErrors({})
  }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">{def.label} page</div>
          <div className="main-topbar-sub">{def.description}</div>
        </div>
        <div className="save-bar">
          {draft && (dirty
            ? <span className="status-pill unsaved">{changedKeys.length} unsaved {changedKeys.length === 1 ? 'change' : 'changes'}</span>
            : <span className="status-pill saved">All changes saved</span>)}
          <a className="open-link" href={def.path} target="_blank" rel="noopener noreferrer">Open live page ↗</a>
          {dirty && <button className="ghost-btn" onClick={discard}>Discard</button>}
          <button className="save-btn" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </div>

      {loadError && <div className="page-wrap"><div className="notice err"><strong>Problem:</strong> {loadError}</div></div>}

      {draft && saved && (
        <div className="editor-layout">
          <div className="editor-fields">
            <div className="fields-inner">
              <p className="field-hint" style={{ marginBottom: 14 }}>
                Click a section to open it. The preview on the right updates as you type. Nothing changes on your website until you press <strong>Save Changes</strong>.
              </p>
              {def.sections.map(s => {
                const isOpen = open === s.id
                const sectionDirty = s.fields.some(f => draft[f.key] !== saved[f.key])
                const sectionErr = s.fields.some(f => errors[f.key])
                return (
                  <div key={s.id} className="section-card">
                    <button className="section-head" onClick={() => setOpen(isOpen ? '' : s.id)} aria-expanded={isOpen}>
                      <div>
                        <div className="section-head-title">
                          {s.title}
                          {sectionDirty && <span className="changed-dot" title="Unsaved changes" />}
                          {sectionErr && <span className="field-error" style={{ display: 'inline', marginLeft: 8 }}>needs attention</span>}
                        </div>
                        <div className="section-head-desc">{s.description}</div>
                      </div>
                      <span className="section-head-chev">{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div className="section-body">
                        {s.fields.map(f => f.type === 'image'
                          ? <ImageField key={f.key} f={f} page={page} value={draft[f.key]} savedValue={saved[f.key]} onChange={v => set(f.key, v)} toast={toast} />
                          : <TextField key={f.key} f={f} value={draft[f.key]} error={errors[f.key]} changed={draft[f.key] !== saved[f.key]} onChange={v => set(f.key, v)} />,
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="editor-preview">
            <div className="preview-label">
              <span>Preview {dirty ? '(includes unsaved changes)' : ''}</span>
              <span style={{ display: 'flex', gap: 6 }}>
                <button className="ghost-btn" style={{ padding: '4px 10px' }} disabled={device === 'desktop'} onClick={() => setDevice('desktop')}>Computer</button>
                <button className="ghost-btn" style={{ padding: '4px 10px' }} disabled={device === 'mobile'} onClick={() => setDevice('mobile')}>Phone</button>
              </span>
            </div>
            <div ref={wrap} className={`preview-frame-wrap ${device}`} style={{ overflow: 'hidden', position: 'relative' }}>
              <iframe ref={frame} className="preview-frame" src={`/admin/preview/${page}`} title={`${def.label} page preview`} onLoad={postPreview}
                style={device === 'desktop' && box.w
                  ? { width: DESKTOP_W, height: box.h / scale, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0, flex: 'none' }
                  : undefined} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function TextField({ f, value, error, changed, onChange }: { f: FieldDef; value: string; error?: string; changed: boolean; onChange: (v: string) => void }) {
  const id = `f-${f.key}`
  const max = maxLength(f)
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        <span>{f.label}{f.optional ? <span className="muted" style={{ fontWeight: 400 }}> (optional)</span> : null}{changed && <span className="changed-dot" />}</span>
        <span className="count">{value.length}/{max}</span>
      </label>
      {f.help && <span className="field-hint">{f.help}</span>}
      {f.type === 'textarea'
        ? <textarea id={id} className={`field-input ${error ? 'invalid' : ''}`} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 48)))} value={value} onChange={e => onChange(e.target.value)} />
        : <input id={id} className={`field-input ${error ? 'invalid' : ''}`} value={value} onChange={e => onChange(e.target.value)} />}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

function ImageField({ f, page, value, savedValue, onChange, toast }: {
  f: FieldDef; page: PageKey; value: string; savedValue: string; onChange: (v: string) => void; toast: ViewProps['toast']
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const spec = f.image!

  async function pick(file: File) {
    setNote('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast('Please choose a JPG, PNG, or WebP photo.', true); return }
    if (file.size > 10 * 1024 * 1024) { toast('That photo is larger than 10 MB. Please use a smaller file.', true); return }
    const dims = await new Promise<{ w: number; h: number } | null>(resolve => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => resolve(null)
      img.src = URL.createObjectURL(file)
    })
    if (!dims) { toast('That file could not be read as a photo.', true); return }
    if (dims.w < spec.minWidth) { toast(`That photo is ${dims.w} pixels wide. Please use one at least ${spec.minWidth} pixels wide so it stays sharp.`, true); return }
    const ratio = dims.w / dims.h
    if (Math.abs(ratio - spec.aspect) / spec.aspect > 0.15) {
      setNote(`This photo's shape (${dims.w} × ${dims.h}) differs from the ${spec.ratio} space, so its edges will be trimmed to fit. Check the preview.`)
    }
    setBusy(true)
    const body = new FormData()
    body.append('file', file)
    body.append('slot', `${page}-${f.key}`)
    const res = await fetch('/api/admin/images', { method: 'POST', body })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { toast(data.error || 'Upload failed. Please try again.', true); return }
    onChange(data.url)
  }

  const isNew = value !== savedValue
  return (
    <div className="field">
      <div className="field-label"><span>{f.label}{isNew && <span className="changed-dot" />}</span></div>
      {f.help && <span className="field-hint">{f.help}</span>}
      <div className="img-slot">
        <img src={value} alt={`${f.label} (current)`} />
        <div className="img-meta">Recommended: {spec.ratio}, {spec.recommended}. JPG, PNG, or WebP, up to 10 MB.</div>
        <div className="img-actions">
          <button className="ghost-btn" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Replace Image'}</button>
          {isNew && <button className="ghost-btn danger-btn" onClick={() => { onChange(savedValue); setNote('') }}>Cancel</button>}
        </div>
        {isNew && <div className="img-new">New photo shown in the preview. Press Save Changes to put it on your website.</div>}
        {note && <div className="img-new">{note}</div>}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) pick(file) }} />
      </div>
    </div>
  )
}
