import { useEffect, useState } from 'react';

export function Dashboard() {
  const [status, setStatus] = useState<ServerStatus>({ running: false });
  const [instances, setInstances] = useState<InstanceConfig[]>([]);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
    const poll = setInterval(refresh, 5000);
    return () => clearInterval(poll);
  }, []);

  async function refresh() {
    const [s, i, l] = await Promise.all([
      window.api.getServerStatus(),
      window.api.listInstances(),
      window.api.getAuditLogs(10),
    ]);
    setStatus(s);
    setInstances(i);
    setLogs(l);
  }

  async function toggleServer() {
    setLoading(true);
    if (status.running) {
      await window.api.stopServer();
    } else {
      await window.api.startServer();
    }
    await refresh();
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">ServiceNow MCP Server status and quick actions</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Server Status</div>
          <div className={`stat-value ${status.running ? 'green' : ''}`}>
            {status.running ? 'Running' : 'Stopped'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Instances</div>
          <div className="stat-value accent">{instances.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Instance</div>
          <div className="stat-value">{status.instance || 'None'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recent Actions</div>
          <div className="stat-value">{logs.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Server Control</span>
          <button className={`btn ${status.running ? 'btn-danger' : 'btn-primary'}`} onClick={toggleServer} disabled={loading}>
            {loading && <span className="spinner" />}
            {status.running ? 'Stop Server' : 'Start Server'}
          </button>
        </div>
        {status.running && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <p>PID: <span className="code">{status.pid}</span> | Started: {status.startedAt ? new Date(status.startedAt).toLocaleTimeString() : '—'}</p>
            <p style={{ marginTop: 8 }}>
              The MCP server is running and ready to accept connections from Claude, Cursor, VS Code, or any MCP-compatible AI client.
            </p>
          </div>
        )}
        {!status.running && instances.length === 0 && (
          <div className="alert alert-info">
            No instances configured. Go to <strong>Setup Wizard</strong> to connect your ServiceNow instance.
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Tool</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td>{log.ts ? new Date(log.ts).toLocaleTimeString() : '—'}</td>
                  <td><span className="code">{log.event}</span></td>
                  <td>{log.tool || '—'}</td>
                  <td>
                    {log.success !== undefined && (
                      <span className={`badge ${log.success ? 'badge-green' : 'badge-red'}`}>
                        {log.success ? 'OK' : 'Error'}
                      </span>
                    )}
                  </td>
                  <td>{log.durationMs ? `${log.durationMs}ms` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
