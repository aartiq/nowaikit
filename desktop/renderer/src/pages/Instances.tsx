import { useEffect, useState } from 'react';

export function Instances() {
  const [instances, setInstances] = useState<InstanceConfig[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; error?: string }>>({});

  useEffect(() => {
    window.api.listInstances().then(setInstances);
  }, []);

  async function testInstance(inst: InstanceConfig) {
    setTesting(inst.name);
    const result = await window.api.testInstance(inst);
    setTestResults(prev => ({ ...prev, [inst.name]: result }));
    setTesting(null);
  }

  async function removeInstance(name: string) {
    await window.api.removeInstance(name);
    setInstances(prev => prev.filter(i => i.name !== name));
  }

  async function startWithInstance(name: string) {
    await window.api.startServer(name);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Instances</h1>
        <p className="page-subtitle">Manage your ServiceNow instance connections</p>
      </div>

      {instances.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            </svg>
            <h3>No instances configured</h3>
            <p>Use the Setup Wizard to add your first ServiceNow instance.</p>
          </div>
        </div>
      ) : (
        instances.map(inst => (
          <div className="card" key={inst.name}>
            <div className="card-header">
              <span className="card-title">{inst.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-primary" onClick={() => startWithInstance(inst.name)}>
                  Connect
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => testInstance(inst)}
                  disabled={testing === inst.name}
                >
                  {testing === inst.name ? <span className="spinner" /> : 'Test'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => removeInstance(inst.name)}>
                  Remove
                </button>
              </div>
            </div>

            <table className="data-table" style={{ marginBottom: 0 }}>
              <tbody>
                <tr><td style={{ fontWeight: 600, width: 160 }}>URL</td><td>{inst.instanceUrl}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Auth Method</td><td>{inst.authMethod === 'basic' ? 'Basic Auth' : 'OAuth 2.0'}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Username</td><td>{inst.username || '—'}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Tool Package</td><td><span className="badge badge-accent">{inst.toolPackage || 'full'}</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>Write Enabled</td><td>{inst.writeEnabled ? <span className="badge badge-yellow">Yes</span> : <span className="badge badge-green">No (read-only)</span>}</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Now Assist</td><td>{inst.nowAssistEnabled ? <span className="badge badge-accent">Enabled</span> : 'Disabled'}</td></tr>
              </tbody>
            </table>

            {testResults[inst.name] && (
              <div className={`alert ${testResults[inst.name].success ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 12, marginBottom: 0 }}>
                {testResults[inst.name].success ? 'Connection successful' : `Failed: ${testResults[inst.name].error}`}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
