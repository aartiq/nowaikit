import React, { useState, useEffect } from 'react';
import type { AppInstance, Page } from '../App.js';
import { api as getApi } from '../api.js';

const PACKAGE_COUNTS: Record<string, string> = {
  full: '400+', service_desk: '47', change_coordinator: '32',
  platform_developer: '51', system_administrator: '38', itom_engineer: '29',
};

function api(): ElectronAPI { return getApi; }

interface Props {
  instances: AppInstance[];
  serverOnline: boolean;
  appVersion: string;
  serverUrl: string;
  onRefresh: () => void;
  onNavigate: (p: Page) => void;
}

function StatCard({ label, value, sub, subTitle, accent, valueColor }: {
  label: string; value: string | number; sub?: string; subTitle?: string;
  accent?: boolean; valueColor?: string;
}) {
  return (
    <div className="card" style={{ padding:'20px 22px', flex:1, minWidth:0, overflow:'hidden' }}>
      <div style={{ fontSize:'0.68rem', color:'var(--dim)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8, whiteSpace:'nowrap' }}>{label}</div>
      <div style={{ fontSize:'1.75rem', fontWeight:700, color: valueColor ?? (accent ? 'var(--accent)' : 'var(--text)'), lineHeight:1, marginBottom: sub ? 6 : 0 }}>
        {value}
      </div>
      {sub && (
        <div
          title={subTitle ?? sub}
          style={{
            fontSize:'0.78rem', color:'var(--text2)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            cursor: subTitle ? 'help' : 'default',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function ServerPanel({ serverOnline, serverUrl, onRefresh }: { serverOnline: boolean; serverUrl: string; onRefresh: () => void }) {
  const [busy,      setBusy]      = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  async function handleStartStop() {
    const a = api();
    if (!a) { setStatusMsg('Desktop app required to manage the server'); return; }
    setBusy(true); setStatusMsg(serverOnline ? 'Stopping…' : 'Starting…');
    try {
      if (serverOnline) {
        await a.stopServer();
        setStatusMsg('Server stopped');
      } else {
        const r = await a.startServer();
        if (r.success) {
          setStatusMsg('Server started');
        } else {
          setStatusMsg(r.error ?? 'Start failed');
        }
      }
      setTimeout(onRefresh, 1500);
    } catch (e) {
      setStatusMsg(`Error: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleRestart() {
    const a = api();
    if (!a) return;
    setBusy(true); setStatusMsg('Restarting…');
    try {
      await a.stopServer();
      const r = await a.startServer();
      setStatusMsg(r.success ? 'Server restarted' : (r.error ?? 'Restart failed'));
      setTimeout(onRefresh, 1500);
    } catch (e) {
      setStatusMsg(`Error: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally {
      setBusy(false);
    }
  }

  const dot = (color: string) => (
    <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:`var(--${color})`, marginRight:6, flexShrink:0,
      boxShadow: color === 'green' ? '0 0 6px var(--green)' : 'none' }} />
  );

  return (
    <div className="card" style={{ marginBottom:28, overflow:'hidden' }}>
      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', flex:1, minWidth:200 }}>
          {serverOnline ? dot('green') : dot('dim')}
          <span style={{ fontWeight:600, fontSize:'0.88rem' }}>Server</span>
          <span style={{ marginLeft:8, fontSize:'0.78rem', color: serverOnline ? 'var(--green)' : 'var(--dim)' }}>
            {serverOnline ? 'Online · MCP Server (stdio)' : 'Offline'}
          </span>
        </div>

        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <button
            onClick={handleStartStop}
            disabled={busy}
            style={{
              background: serverOnline ? 'rgba(248,113,113,0.12)' : 'var(--accent)',
              border: serverOnline ? '1px solid rgba(248,113,113,0.3)' : 'none',
              color: serverOnline ? 'var(--red)' : '#fff',
              borderRadius:6, padding:'6px 14px', fontSize:'0.82rem', fontWeight:600,
              cursor:'pointer', opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? '…' : serverOnline ? '■ Stop' : '▶ Start'}
          </button>
          {serverOnline && (
            <button onClick={handleRestart} disabled={busy}
              style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', color:'var(--green)', borderRadius:6, padding:'6px 14px', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', opacity: busy ? 0.6 : 1 }}>
              ↻ Restart
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding:'8px 16px', fontSize:'0.78rem', color:'var(--text2)', background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>
          {statusMsg}
        </div>
      )}

      {!serverOnline && !busy && !statusMsg && (
        <div style={{ padding:'12px 16px', fontSize:'0.82rem', color:'var(--text2)' }}>
          <strong style={{ color:'var(--yellow)' }}>Server is offline.</strong>{' '}
          Click <strong>▶ Start</strong> above to launch the server, or run <code style={{ background:'var(--surface2)', padding:'1px 6px', borderRadius:4 }}>nowaikit server</code> in a terminal.
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ instances, serverOnline, appVersion, serverUrl, onRefresh, onNavigate }: Props): React.ReactElement {
  const active = instances.find(i => i.active);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </h2>
        <button className="btn-ghost" onClick={onRefresh} style={{ padding:'6px 14px', fontSize:'0.8rem' }}>↻ Refresh</button>
      </div>

      {/* Stat cards */}
      <div style={{ display:'flex', gap:14, marginBottom:28, flexWrap:'wrap' }}>
        <StatCard
          label="Active Instance"
          value={active?.name ?? '—'}
          sub={active?.url}
          subTitle={active?.url}
          accent
        />
        <StatCard
          label="Tools"
          value={active ? (PACKAGE_COUNTS[active.toolPackage] ?? '—') : '—'}
          sub={active ? active.toolPackage.replace(/_/g,' ') + ' package' : 'no instance'}
        />
        <StatCard
          label="Instances"
          value={instances.length}
          sub="configured"
        />
        <StatCard
          label="Server"
          value={serverOnline ? 'Online' : 'Offline'}
          sub={undefined}
          valueColor={serverOnline ? 'var(--green)' : 'var(--dim)'}
        />
      </div>

      {/* Server management panel */}
      <ServerPanel serverOnline={serverOnline} serverUrl={serverUrl} onRefresh={onRefresh} />

      {/* Quick actions */}
      <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
        <button className="btn-primary" onClick={() => onNavigate('chat')} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Start Chat
        </button>
        <button className="btn-ghost" onClick={() => onNavigate('tools')} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          Browse Tools
        </button>
        <button className="btn-ghost" onClick={() => onNavigate('instances')} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          Manage Instances
        </button>
      </div>

      {/* Instance list */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:'0.7rem', color:'var(--dim)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Configured Instances</span>
          <button onClick={() => onNavigate('instances')} style={{ background:'none', border:'none', color:'var(--accent)', fontSize:'0.78rem', cursor:'pointer' }}>
            Manage →
          </button>
        </div>
        {instances.length === 0 ? (
          <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--dim)', fontSize:'0.875rem' }}>
            No instances configured.{' '}
            <button onClick={() => onNavigate('instances')} style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontSize:'0.875rem' }}>
              Add one →
            </button>
          </div>
        ) : instances.map((inst, i) => (
          <div key={inst.name} style={{
            display:'flex', alignItems:'center', padding:'13px 16px',
            borderBottom: i < instances.length - 1 ? '1px solid var(--border)' : 'none',
            gap:12, minWidth:0,
          }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, marginBottom:3, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inst.name}</span>
                {inst.active && <span className="badge-green" style={{ flexShrink:0 }}>active</span>}
              </div>
              <div title={inst.url} style={{ fontSize:'0.8rem', color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', cursor:'help', maxWidth:'100%' }}>
                {inst.url}
              </div>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center', fontSize:'0.75rem', color:'var(--dim)', flexShrink:0 }}>
              <span className="badge-dim">{inst.toolPackage.replace(/_/g,' ')}</span>
              <span>·</span>
              <span>{inst.authMethod}</span>
              <span>·</span>
              <span style={{ color: inst.writeEnabled ? 'var(--yellow)' : 'var(--dim)' }}>
                {inst.writeEnabled ? 'read/write' : 'read-only'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
