'use client'

import { useEffect, useMemo, useState } from 'react'
import { joinSections, splitSections, type AgreementSection } from '@/lib/agreement-sections'
import type { ViewProps } from '../page'

interface AgreementRecord {
  id: string; version: string; effective_date: string; content: string
  content_hash: string; is_active: boolean; notes: string | null; created_at: string
}

const NOTICE = 'Updating the agreement affects future enrollments only. Agreements already signed by clients will remain unchanged.'
const STEPS = ['Edit agreement', 'Preview changes', 'Version label', 'Effective date', 'Save new version', 'Activate for future enrollments']

const fmtDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const todayIso = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
function nextVersion(versions: string[]) {
  const nums = versions.map(v => v.match(/^(\d+)\.(\d+)$/)).filter(Boolean).map(m => [Number(m![1]), Number(m![2])])
  if (!nums.length) return '1.1'
  nums.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const [maj, min] = nums[nums.length - 1]
  return `${maj}.${min + 1}`
}

export default function AgreementView({ setDirty, toast }: ViewProps) {
  const [records, setRecords] = useState<AgreementRecord[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [base, setBase] = useState<AgreementSection[]>([])
  const [draft, setDraft] = useState<AgreementSection[]>([])
  const [openId, setOpenId] = useState('')
  const [wholeDoc, setWholeDoc] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [version, setVersion] = useState('')
  const [effective, setEffective] = useState(todayIso())
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [savedNew, setSavedNew] = useState<AgreementRecord | null>(null)
  const [confirmActivate, setConfirmActivate] = useState<AgreementRecord | null>(null)
  const [showCurrent, setShowCurrent] = useState(false)

  async function load() {
    const r = await fetch('/api/admin/agreements')
    if (!r.ok) { toast('The agreement could not be loaded. Refresh to try again.', true); return }
    setRecords((await r.json()).agreements)
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const active = records?.find(a => a.is_active) ?? null
  const baseText = useMemo(() => joinSections(base), [base])
  const draftText = wholeDoc ?? joinSections(draft)
  const changed = editing && draftText !== baseText
  useEffect(() => { setDirty(changed && !savedNew) }, [changed, savedNew, setDirty])

  function startEditing() {
    if (!active) return
    const s = splitSections(active.content)
    setBase(s); setDraft(s); setWholeDoc(null)
    setVersion(nextVersion(records!.map(r => r.version)))
    setEffective(todayIso()); setNotes(''); setStep(0); setSavedNew(null)
    setOpenId(''); setEditing(true)
  }
  function cancelEditing() {
    if (changed && !savedNew && !window.confirm('Discard your edits to the agreement?')) return
    setEditing(false); setSavedNew(null)
  }

  const changedIds = new Set(draft.filter((s, i) => s.body !== base[i]?.body).map(s => s.id))

  async function saveVersion() {
    setBusy(true)
    const res = await fetch('/api/admin/agreements', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: version.trim(), effective_date: fmtDate(effective), content: draftText, notes }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { toast(data.error || 'Could not save the new version.', true); return }
    setSavedNew(data.agreement); setStep(5)
    toast(`Version ${data.agreement.version} saved. It is not in use until you activate it.`)
    load()
  }

  async function activate(rec: AgreementRecord) {
    setBusy(true)
    const res = await fetch('/api/admin/agreements', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: rec.id }) })
    setBusy(false); setConfirmActivate(null)
    if (!res.ok) { toast('Could not activate that version. Please try again.', true); return }
    toast(`Version ${rec.version} is now the agreement new clients sign.`)
    setEditing(false); setSavedNew(null)
    load()
  }

  const stepReady = [changed, true, /^[\w.\- ]{1,20}$/.test(version.trim()), !!effective, true, !!savedNew]

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Coaching Agreement</div>
          <div className="main-topbar-sub">The Coaching Services Agreement clients read and sign when they enroll online.</div>
        </div>
        <div className="save-bar">
          {editing
            ? <>{changed && !savedNew && <span className="status-pill unsaved">Unsaved edits</span>}<button className="ghost-btn" onClick={cancelEditing}>{savedNew ? 'Close' : 'Cancel editing'}</button></>
            : <button className="save-btn" onClick={startEditing} disabled={!active}>Edit / Create New Version</button>}
        </div>
      </div>

      <div className="page-wrap">
        <div className="notice"><strong>Important:</strong> {NOTICE}</div>

        {!editing && (
          <>
            <div className="card">
              <div className="eyebrow">Current Agreement</div>
              {active ? (
                <>
                  <dl className="kv" style={{ marginBottom: 14 }}>
                    <dt>Version</dt><dd>{active.version} <span className="tag active" style={{ marginLeft: 6 }}>Active</span></dd>
                    <dt>Effective date</dt><dd>{active.effective_date}</dd>
                    <dt>Status</dt><dd>Active: new clients read and sign this version</dd>
                  </dl>
                  <button className="ghost-btn" onClick={() => setShowCurrent(v => !v)}>{showCurrent ? 'Hide full agreement' : 'Preview full agreement'}</button>
                  {showCurrent && <div className="doc-preview" style={{ marginTop: 14 }}>{active.content}</div>}
                </>
              ) : <p className="muted">{records ? 'No agreement is active.' : 'Loading…'}</p>}
            </div>

            {records && records.filter(r => !r.is_active).length > 0 && (
              <div className="card">
                <div className="eyebrow">Other versions</div>
                <p className="field-hint">Clients who signed an older version keep that version on file. Activating a version only changes what new clients sign.</p>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Version</th><th>Effective date</th><th>Saved</th><th>Notes</th><th /></tr></thead>
                    <tbody>
                      {records.filter(r => !r.is_active).map(r => (
                        <tr key={r.id}>
                          <td>{r.version}</td><td>{r.effective_date}</td>
                          <td>{new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td className="muted">{r.notes || ''}</td>
                          <td><button className="ghost-btn" onClick={() => setConfirmActivate(r)}>Activate</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {editing && (
          <>
            <div className="steps" aria-label="Steps">
              {STEPS.map((s, i) => <div key={s} className={`step ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>{i + 1}. {s}</div>)}
            </div>

            {step === 0 && (
              <div className="card">
                <div className="card-title">1. Edit agreement</div>
                <p className="card-sub">Starting from version {active?.version}. Open a section to edit its wording. Sections you change are marked with a dot.</p>
                <div style={{ marginBottom: 12 }}>
                  {wholeDoc === null
                    ? <button className="ghost-btn" onClick={() => setWholeDoc(joinSections(draft))}>Edit as one document instead</button>
                    : <button className="ghost-btn" onClick={() => { setDraft(splitSections(wholeDoc)); setWholeDoc(null) }}>Back to sections</button>}
                </div>
                {wholeDoc !== null ? (
                  <textarea className="field-input" style={{ minHeight: 520, fontFamily: 'Georgia, serif', fontSize: 13 }} value={wholeDoc} onChange={e => setWholeDoc(e.target.value)} />
                ) : draft.map((s, i) => s.groupOnly ? (
                  <div key={s.id} className="eyebrow" style={{ marginTop: 18 }}>{s.title}</div>
                ) : (
                  <div key={s.id} className="section-card">
                    <button className="section-head" onClick={() => setOpenId(openId === s.id ? '' : s.id)} aria-expanded={openId === s.id}>
                      <div className="section-head-title">{s.title}{changedIds.has(s.id) && <span className="changed-dot" />}</div>
                      <span className="section-head-chev">{openId === s.id ? '▲' : '▼'}</span>
                    </button>
                    {openId === s.id && (
                      <div className="section-body">
                        <textarea className="field-input" style={{ minHeight: Math.min(560, 90 + s.body.length / 3.2), fontFamily: 'Georgia, serif', fontSize: 13, marginTop: 12 }}
                          value={s.body} onChange={e => setDraft(d => d.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))} />
                        {changedIds.has(s.id) && (
                          <button className="ghost-btn" style={{ marginTop: 8 }} onClick={() => setDraft(d => d.map((x, j) => (j === i ? { ...x, body: base[i].body } : x)))}>Undo changes to this section</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button className="save-btn" disabled={!changed} onClick={() => setStep(1)}>Next: Preview changes</button>
                  {!changed && <span className="field-hint" style={{ margin: 0 }}>Make at least one change to continue.</span>}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card">
                <div className="card-title">2. Preview changes</div>
                <p className="card-sub">This is the full agreement new clients will read. Changed sections are highlighted.</p>
                <div className="doc-preview">
                  {wholeDoc !== null ? wholeDoc : draft.map(s => (
                    <span key={s.id} className={changedIds.has(s.id) ? 'chg' : undefined}>{s.body}{s.sep}</span>
                  ))}
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                  <button className="ghost-btn" onClick={() => setStep(0)}>Back to editing</button>
                  <button className="save-btn" onClick={() => setStep(2)}>Looks right: Next</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <div className="card-title">3. Version label</div>
                <p className="card-sub">A short label so you and your clients can tell versions apart. Each version needs a new label.</p>
                <div className="field" style={{ maxWidth: 240 }}>
                  <label className="field-label" htmlFor="ver">Version</label>
                  <input id="ver" className="field-input" value={version} onChange={e => setVersion(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="notes">What changed (for your records, optional)</label>
                  <input id="notes" className="field-input" value={notes} placeholder="Example: Updated program prices" onChange={e => setNotes(e.target.value)} />
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                  <button className="ghost-btn" onClick={() => setStep(1)}>Back</button>
                  <button className="save-btn" disabled={!stepReady[2]} onClick={() => setStep(3)}>Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <div className="card-title">4. Effective date</div>
                <p className="card-sub">The date this version takes effect, for your records. Each client&apos;s own signed agreement always shows the date they signed.</p>
                <div className="field" style={{ maxWidth: 240 }}>
                  <label className="field-label" htmlFor="eff">Effective date</label>
                  <input id="eff" type="date" className="field-input" value={effective} onChange={e => setEffective(e.target.value)} />
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                  <button className="ghost-btn" onClick={() => setStep(2)}>Back</button>
                  <button className="save-btn" disabled={!stepReady[3]} onClick={() => setStep(4)}>Next</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="card">
                <div className="card-title">5. Save new version</div>
                <dl className="kv" style={{ margin: '10px 0 16px' }}>
                  <dt>New version</dt><dd>{version}</dd>
                  <dt>Effective date</dt><dd>{effective ? fmtDate(effective) : ''}</dd>
                  <dt>Sections changed</dt><dd>{wholeDoc !== null ? 'Edited as one document' : draft.filter(s => changedIds.has(s.id)).map(s => s.title).join(', ')}</dd>
                  <dt>Replaces</dt><dd>Version {active?.version} (kept on file)</dd>
                </dl>
                <div className="notice warn"><strong>Not live yet:</strong> Saving stores this version. New clients keep signing version {active?.version} until you activate it in the next step.</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="ghost-btn" onClick={() => setStep(3)} disabled={busy}>Back</button>
                  <button className="save-btn" onClick={saveVersion} disabled={busy}>{busy ? 'Saving…' : 'Save new version'}</button>
                </div>
              </div>
            )}

            {step === 5 && savedNew && (
              <div className="card">
                <div className="card-title">6. Activate for future enrollments</div>
                <div className="notice ok"><strong>Saved:</strong> Version {savedNew.version} is stored.</div>
                <p className="card-sub">Activate it when you are ready for new clients to sign it. You can also activate it later from this page.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="ghost-btn" onClick={() => { setEditing(false); setSavedNew(null) }}>Activate later</button>
                  <button className="save-btn" onClick={() => setConfirmActivate(savedNew)}>Activate version {savedNew.version}</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {confirmActivate && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Activate version {confirmActivate.version}?</h3>
            <ul>
              <li>New clients will read and sign version {confirmActivate.version} starting now.</li>
              <li>Clients who already signed keep their original agreement, unchanged.</li>
              {active && <li>Version {active.version} stays on file and can be activated again later.</li>}
            </ul>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setConfirmActivate(null)} disabled={busy}>Go back</button>
              <button className="save-btn" onClick={() => activate(confirmActivate)} disabled={busy}>{busy ? 'Activating…' : 'Activate'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
