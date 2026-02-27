import { useEffect, useState } from 'react';
import { api } from '../api';

export function Settings() {
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [serverPath, setServerPath] = useState('');

  useEffect(() => {
    api.getVersion().then(setVersion);
    api.getServerPath().then(setServerPath);
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Application configuration and system information</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">System Information</span>
        </div>
        <table className="data-table">
          <tbody>
            <tr><td style={{ fontWeight: 600, width: 200 }}>App Version</td><td>{version?.app || '—'}</td></tr>
            <tr><td style={{ fontWeight: 600 }}>Electron</td><td>{version?.electron || '—'}</td></tr>
            <tr><td style={{ fontWeight: 600 }}>Node.js</td><td>{version?.node || '—'}</td></tr>
            <tr><td style={{ fontWeight: 600 }}>Platform</td><td>{navigator.platform}</td></tr>
            <tr><td style={{ fontWeight: 600 }}>MCP Server Path</td><td><span className="code">{serverPath}</span></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Links</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => api.openExternal('https://nowaitkit.com/docs')}>
            Documentation
          </button>
          <button className="btn btn-secondary" onClick={() => api.openExternal('https://github.com/aartiq/nowaikit')}>
            GitHub Repository
          </button>
          <button className="btn btn-secondary" onClick={() => api.openExternal('https://github.com/aartiq/nowaikit/issues')}>
            Report an Issue
          </button>
          <button className="btn btn-secondary" onClick={() => api.openExternal('https://nowaitkit.com')}>
            Website
          </button>
        </div>
      </div>
    </div>
  );
}
