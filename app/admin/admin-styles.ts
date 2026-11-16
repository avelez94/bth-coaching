// Admin look and feel: dark workspace, gold accents (unchanged from the
// original admin), plus a few additions for the new sections.
export const ADMIN_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0F1117 !important; color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; min-height: 100vh; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .login-card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 48px 44px; width: 100%; max-width: 400px; }
  .login-logo { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: #fff; margin-bottom: 4px; }
  .login-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; }
  .login-title { font-size: 1.3rem; font-weight: 600; color: #fff; margin-bottom: 24px; }
  .login-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.1); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; }
  .login-input:focus { border-color: #C9A23A; }
  .login-btn { width: 100%; background: #C9A23A; color: #0D1B2A; border: none; padding: 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
  .login-error { font-size: 12px; color: #f87171; margin-bottom: 12px; }

  .admin-shell { display: grid; grid-template-columns: 236px 1fr; min-height: 100vh; }
  .sidebar { background: #12151E; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .sidebar-logo { padding: 26px 20px 22px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-logo-name { font-family: 'DM Serif Display', serif; font-size: 1rem; color: #fff; margin-bottom: 3px; }
  .sidebar-logo-sub { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; }
  .sidebar-group { padding: 18px 0 4px; }
  .sidebar-group-label { font-size: 0.62rem; color: rgba(255,255,255,0.32); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 20px 8px; font-weight: 600; }
  .nav-item { display: flex; align-items: center; justify-content: space-between; gap: 9px; padding: 9px 20px; font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.15s; border-left: 2px solid transparent; background: none; border-top: 0; border-right: 0; border-bottom: 0; width: 100%; text-align: left; font-family: inherit; }
  .nav-item:hover { color: #fff; background: rgba(255,255,255,0.03); }
  .nav-item.active { color: #C9A23A; border-left-color: #C9A23A; background: rgba(201,162,58,0.06); }
  .nav-item:focus-visible, .save-btn:focus-visible, .ghost-btn:focus-visible { outline: 2px solid #C9A23A; outline-offset: 2px; }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .sidebar-footer a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; }
  .sidebar-footer a:hover { color: #C9A23A; }
  .signout-btn { font-size: 11px; color: rgba(255,255,255,0.4); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .signout-btn:hover { color: #f87171; }

  .main-area { background: #0F1117; display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
  .main-topbar { background: #12151E; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-shrink: 0; position: sticky; top: 0; z-index: 20; flex-wrap: wrap; }
  .main-topbar-title { font-size: 15px; font-weight: 600; color: #fff; }
  .main-topbar-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; max-width: 640px; line-height: 1.5; }
  .save-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .save-btn { background: #C9A23A; color: #0D1B2A; border: none; padding: 10px 22px; font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
  .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .save-btn:hover:not(:disabled) { opacity: 0.88; }
  .ghost-btn { background: none; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); padding: 9px 16px; font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .ghost-btn:hover:not(:disabled) { border-color: #C9A23A; color: #C9A23A; }
  .ghost-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .danger-btn:hover:not(:disabled) { border-color: #f87171; color: #f87171; }
  .status-pill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
  .status-pill.saved { color: #4ade80; background: rgba(74,222,128,0.08); }
  .status-pill.unsaved { color: #fbbf24; background: rgba(251,191,36,0.1); }
  .status-pill.error { color: #f87171; background: rgba(248,113,113,0.1); }
  .open-link { font-size: 12px; color: rgba(255,255,255,0.5); text-decoration: none; }
  .open-link:hover { color: #C9A23A; }

  .editor-layout { display: grid; grid-template-columns: minmax(360px, 440px) 1fr; flex: 1; min-height: 0; height: calc(100vh - 66px); }
  .editor-fields { background: #1A1D27; border-right: 1px solid rgba(255,255,255,0.05); overflow-y: auto; }
  .editor-preview { background: #2a2d36; display: flex; flex-direction: column; min-width: 0; }
  .preview-label { background: #1A1D27; border-bottom: 1px solid rgba(201,162,58,0.15); padding: 8px 20px; font-size: 11px; color: rgba(201,162,58,0.8); letter-spacing: 0.08em; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .preview-frame { flex: 1; width: 100%; border: 0; background: #F7F4ED; }
  .preview-frame-wrap { flex: 1; display: flex; justify-content: center; min-height: 0; }
  .preview-frame-wrap.mobile .preview-frame { max-width: 390px; border-left: 1px solid #000; border-right: 1px solid #000; }
  .fields-inner { padding: 20px 24px 60px; }

  .section-card { border: 1px solid rgba(255,255,255,0.07); margin-bottom: 10px; background: rgba(255,255,255,0.015); }
  .section-head { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; background: none; border: 0; color: #fff; cursor: pointer; text-align: left; font-family: inherit; }
  .section-head-title { font-size: 13.5px; font-weight: 600; }
  .section-head-desc { font-size: 11.5px; color: rgba(255,255,255,0.45); margin-top: 3px; font-weight: 400; line-height: 1.45; }
  .section-head-chev { color: #C9A23A; font-size: 12px; flex-shrink: 0; }
  .section-body { padding: 4px 16px 16px; border-top: 1px solid rgba(255,255,255,0.05); }
  .changed-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #fbbf24; margin-left: 8px; vertical-align: middle; }

  .field { margin-top: 14px; }
  .field-label { font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 600; margin-bottom: 4px; display: flex; justify-content: space-between; gap: 8px; }
  .field-label .count { font-weight: 400; color: rgba(255,255,255,0.3); font-size: 11px; }
  .field-hint { font-size: 11.5px; color: rgba(255,255,255,0.45); display: block; margin-bottom: 6px; line-height: 1.5; }
  .field-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.1); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 13px; padding: 9px 12px; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #C9A23A; }
  .field-input.invalid { border-color: #f87171; }
  textarea.field-input { resize: vertical; min-height: 76px; line-height: 1.6; }
  .field-error { font-size: 11.5px; color: #f87171; margin-top: 5px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .money { position: relative; }
  .money span { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); font-size: 13px; }
  .money .field-input { padding-left: 24px; }

  .img-slot { border: 1px solid rgba(255,255,255,0.08); padding: 12px; background: #0F1117; }
  .img-slot img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block; background: #222; }
  .img-meta { font-size: 11.5px; color: rgba(255,255,255,0.45); margin: 8px 0; line-height: 1.5; }
  .img-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .img-new { font-size: 11px; color: #fbbf24; margin-top: 6px; }

  .page-wrap { padding: 28px; max-width: 1040px; width: 100%; }
  .intro-box { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; margin-bottom: 24px; max-width: 760px; }
  .notice { border: 1px solid rgba(201,162,58,0.3); background: rgba(201,162,58,0.07); color: rgba(255,255,255,0.8); padding: 12px 16px; font-size: 12.5px; line-height: 1.6; margin-bottom: 20px; }
  .notice strong { color: #C9A23A; }
  .notice.warn { border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.07); }
  .notice.warn strong { color: #fbbf24; }
  .notice.ok { border-color: rgba(74,222,128,0.35); background: rgba(74,222,128,0.06); }
  .notice.ok strong { color: #4ade80; }
  .notice.err { border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.07); }
  .notice.err strong { color: #f87171; }
  .card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 22px 24px; margin-bottom: 18px; }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 1.25rem; color: #fff; margin-bottom: 4px; font-weight: 400; }
  .card-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 14px; line-height: 1.5; }
  .eyebrow { font-size: 0.64rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 10px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .kv { display: grid; grid-template-columns: 160px 1fr; gap: 6px 14px; font-size: 12.5px; }
  .kv dt { color: rgba(255,255,255,0.45); }
  .kv dd { color: rgba(255,255,255,0.85); }
  .list-plain { list-style: none; font-size: 12.5px; color: rgba(255,255,255,0.75); line-height: 1.9; }
  .list-plain li::before { content: '•'; color: #C9A23A; margin-right: 8px; }
  .muted { color: rgba(255,255,255,0.45); }
  .table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .table th { text-align: left; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 600; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); white-space: nowrap; }
  .table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); vertical-align: top; }
  .table-wrap { overflow-x: auto; }
  .tag { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; }
  .tag.active { background: #C9A23A; color: #0D1B2A; }
  .tag.test { background: #ffc107; color: #1a1a1a; }
  .tag.hidden-tag { background: rgba(251,191,36,0.14); color: #fbbf24; font-size: 9px; padding: 2px 6px; }

  /* Page Status (Active / Hidden) for optional pages */
  .page-status { border: 1px solid rgba(255,255,255,0.1); padding: 14px 16px 16px; margin-bottom: 18px; }
  .page-status.is-active { border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.05); }
  .page-status.is-hidden { border-color: rgba(251,191,36,0.45); background: rgba(251,191,36,0.06); }
  .page-status-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 10px; }
  .page-status-title { font-size: 13px; font-weight: 600; color: #fff; }
  .page-status-now { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .is-active .page-status-now { color: #4ade80; }
  .is-hidden .page-status-now { color: #fbbf24; }
  .page-status-switch { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(255,255,255,0.15); }
  .page-status-switch button { background: none; border: 0; color: rgba(255,255,255,0.6); padding: 9px 12px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
  .page-status-switch button + button { border-left: 1px solid rgba(255,255,255,0.15); }
  .page-status-switch button:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.04); }
  .page-status-switch button[aria-pressed="true"].on-active { background: #4ade80; color: #0D1B2A; }
  .page-status-switch button[aria-pressed="true"].on-hidden { background: #fbbf24; color: #0D1B2A; }
  .page-status-switch button:disabled { cursor: default; }
  .page-status-switch button:focus-visible { outline: 2px solid #C9A23A; outline-offset: 2px; }
  .page-status-help { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.55; margin-top: 10px; }
  .doc-preview { background: #F7F4ED; color: #263746; font-family: Georgia, serif; font-size: 13px; line-height: 1.7; padding: 28px 32px; max-height: 520px; overflow-y: auto; white-space: pre-wrap; }
  .doc-preview .chg { background: rgba(251,191,36,0.25); display: block; margin: 0 -8px; padding: 0 8px; border-left: 3px solid #d97706; }
  .steps { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
  .step { font-size: 11px; padding: 6px 10px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); }
  .step.on { border-color: #C9A23A; color: #C9A23A; }
  .step.done { color: #4ade80; border-color: rgba(74,222,128,0.4); }
  .toast { position: fixed; right: 24px; bottom: 24px; background: #12151E; border: 1px solid rgba(74,222,128,0.4); color: #4ade80; padding: 12px 18px; font-size: 13px; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .toast.err { border-color: rgba(248,113,113,0.5); color: #f87171; }
  .modal-back { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: #1A1D27; border: 1px solid rgba(201,162,58,0.3); max-width: 560px; width: 100%; padding: 26px 28px; }
  .modal h3 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 1.3rem; color: #fff; margin-bottom: 12px; }
  .modal ul { margin: 0 0 16px 18px; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; flex-wrap: wrap; }

  @media (max-width: 1000px) {
    .editor-layout { grid-template-columns: 1fr; height: auto; }
    .editor-preview { min-height: 70vh; }
    .admin-shell { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; }
    .grid-2, .field-row { grid-template-columns: 1fr; }
    .kv { grid-template-columns: 1fr; }
  }
`
